---
layout: snippet
title: Optimized Bulk Table Update for T-SQL
tags:
  - sql
language: sql
variables:
---

Source: <https://stackoverflow.com/questions/20609203/deleting-3-million-data-takes-a-lot-of-time>

I modified the source a bit to include disabling indexes and performing a checkpoint after each pass


```sql
SET NOCOUNT ON

DECLARE @chunk_size bigint = 500000
DECLARE @RowCount bigint;
DECLARE @delay      DATETIME = '00:00:01'       --- 1 second by default, Used for delaying the updates inside the loop, can be 0


IF OBJECT_ID('tempdb..#temp_ChunkIDs') is not null
    DROP TABLE #temp_ChunkIDs;

CREATE TABLE #temp_ChunkIDs (
    [ID]            INT NOT NULL,
    -- This should match the type of your primary key. If composite,
    -- add more rows and modify index as needed.
    [SourcePKID]    BIGINT NOT NULL
);

CREATE NONCLUSTERED INDEX [IX_#temp_ChunkIDsID] on #temp_ChunkIDs ([ID])
CREATE NONCLUSTERED INDEX [IX_#temp_ChunkIDsSourcePKID] on #temp_ChunkIDs ([SourcePKID])


IF OBJECT_ID('tempdb..#temp_OldDataIDs') is not null
    DROP TABLE #temp_OldDataIDs;

CREATE TABLE #temp_OldDataIDs (
    [ID]            INT NOT NULL IDENTITY(1,1) PRIMARY KEY CLUSTERED,
    [SourcePKID]    BIGINT NOT NULL,  -- again, the type of your primary key
    [UpdatedStatus] BIT NOT NULL DEFAULT 0);


INSERT INTO #temp_OldDataIDs ([SourcePKID])
-- Fill with table name and PK column
SELECT [PRIMARY_KEY_COLUMN]
FROM [dbo].[large_data_table] ldt
-- Modify WHERE clause to select the IDs of all of the records that need to be updated
WHERE ldt.DATE_COLUMN < '2020-01-01'


SET @RowCount = @@ROWCOUNT;
PRINT 'To Update: ' + CAST(@RowCount as varchar(30)) + ' ' + CONVERT(varchar(30), GETDATE(),121)

CREATE NONCLUSTERED INDEX IX_#temp_OldDataIDs on #temp_OldDataIDs ([UpdatedStatus]) include([ID],SourcePKID)

-- Delete any indexes on the source table here. Or just remove this line
ALTER INDEX [ix_large_data_table_product_key] ON [dbo].[large_data_table] DISABLE


WHILE (@RowCount <> 0)
BEGIN

	ALTER INDEX [IX_#temp_ChunkIDsID] ON #temp_ChunkIDs DISABLE
	ALTER INDEX [IX_#temp_ChunkIDsSourcePKID] ON #temp_ChunkIDs DISABLE

    TRUNCATE TABLE #temp_ChunkIDs;

    INSERT INTO #temp_ChunkIDs ([ID], [SourcePKID])
    SELECT TOP (@chunk_size)
        [ID], [SourcePKID]
    FROM #temp_OldDataIDs
    WHERE [UpdatedStatus] = 0
    ORDER BY [ID];

    SET @RowCount = @@ROWCOUNT;
    IF @RowCount = 0 
	BEGIN
		PRINT 'No Records, exiting...'
		BREAK;
	END

	ALTER INDEX [IX_#temp_ChunkIDsID] ON #temp_ChunkIDs REBUILD
	ALTER INDEX [IX_#temp_ChunkIDsSourcePKID] ON #temp_ChunkIDs REBUILD

	BEGIN TRANSACTION;

    -- Replace this
	UPDATE ldt
		SET ldt.[PRODUCT_TITLE] = prod.[TITLE]
	  FROM [dbo].[large_data_table] ldt
	  INNER JOIN #temp_ChunkIDs ChunkIDs
	  ON ldt.[PRIMARY_KEY_COLUMN] = ChunkIDs.[SourcePKID]
	  JOIN [dbo].[PRODUCT] prod
	  ON ldt.PRODUCT_KEY = PROD.PRODUCT_KEY

	COMMIT TRANSACTION;

	CHECKPOINT;  -- for SIMPLE recovery type

	  
    UPDATE OldIDs
        SET [UpdatedStatus] = 1
    FROM #temp_OldDataIDs OldIDs
        INNER JOIN #temp_ChunkIDs ChunkIDs ON OldIDs.[ID] = ChunkIDs.[ID];

-- debug
 PRINT CAST(@RowCount as varchar(30)) + ' ' + CONVERT(varchar(30), GETDATE(),121)

    -- The requested delay will hold the loop here as requested.
    WAITFOR DELAY  @delay
END


ALTER INDEX [ix_large_data_table_product_key] ON [dbo].[large_data_table] REBUILD

IF OBJECT_ID('tempdb..#temp_OldDataIDs') is not null
    DROP TABLE #temp_OldDataIDs;

IF OBJECT_ID('tempdb..#temp_ChunkIDs') is not null
    DROP TABLE #temp_ChunkIDs;

GO
```
