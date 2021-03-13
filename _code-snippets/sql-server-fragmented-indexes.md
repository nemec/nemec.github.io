---
layout: snippet
title: Find and rebuild fragmented indexes in SQL Server
description: 
tags:
  - sql
  - sql-server
language: sql
variables:
---

This script will list all indexes on a server, sorted by most to least fragmented.

```sql
SELECT 
    DB_NAME([ddips].[database_id]) AS [DatabaseName],
    OBJECT_NAME([ddips].[object_id]) AS [TableName],
      ind.[name] AS [IndexName],
    * 
FROM [sys].[dm_db_index_physical_stats](DB_ID(), NULL, NULL, NULL, DEFAULT) AS ddips
INNER JOIN sys.indexes ind
ON ind.object_id = ddips.object_id 
    AND ind.index_id = ddips.index_id
WHERE 
    ind.[Name] IS NOT NULL  -- hide heap indexes
ORDER BY avg_fragmentation_in_percent DESC
```

This second query will output ALTER scripts to rebuild all indexes with > 30% fragmentation.

```sql
SELECT 
    CONCAT('ALTER INDEX [', ind.[name], '] ON [', DB_NAME([ddips].[database_id]), '].[', sch.[name], '].[', OBJECT_NAME([ddips].[object_id]), '] REBUILD') AS [REBUILD_QUERY],
    DB_NAME([ddips].[database_id]) AS [DatabaseName],
    sch.[name] AS [SchemaName],
    OBJECT_NAME([ddips].[object_id]) AS [TableName],
    ind.[name] AS [IndexName],
    ddips.avg_fragmentation_in_percent
FROM [sys].[dm_db_index_physical_stats](DB_ID(), NULL, NULL, NULL, DEFAULT) AS ddips
INNER JOIN sys.indexes ind
ON ind.object_id = ddips.object_id 
    AND ind.index_id = ddips.index_id
INNER JOIN sys.objects objects
ON ind.[object_id] = objects.[object_id]
INNER JOIN sys.schemas sch
ON objects.schema_id = sch.schema_id
WHERE 
    ind.[Name] IS NOT NULL  -- hide heap indexes
    AND ddips.avg_fragmentation_in_percent > 30.0
ORDER BY avg_fragmentation_in_percent DESC
```