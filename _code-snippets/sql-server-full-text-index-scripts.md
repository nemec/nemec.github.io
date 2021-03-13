---
layout: snippet
title: SQL Server Full-Text Indexing Scripts
description: 
tags:
  - sql-server
  - sql
language: sql
variables:
---

## List Full-Text Catalogs

{:.ignore}
```sql
SELECT t.name AS TableName,
       c.name AS FTCatalogName
FROM sys.tables t
    JOIN sys.fulltext_indexes i
        ON t.object_id = i.object_id
    JOIN sys.fulltext_catalogs c
        ON i.fulltext_catalog_id = c.fulltext_catalog_id;
```

## Show Full-Text Catalog Index Size and Status

{:.ignore}
```sql
SELECT cat.name,
       FORMAT(FULLTEXTCATALOGPROPERTY(cat.name, 'ItemCount'), '#,###') AS [RowCount],
       FULLTEXTCATALOGPROPERTY(cat.name, 'IndexSize') AS [IndexSize(MB)],
       FULLTEXTCATALOGPROPERTY(cat.name, 'MergeStatus') AS [MergeStatus],
       FULLTEXTCATALOGPROPERTY(cat.name, 'PopulateCompletionAge') AS [PopulateCompletionAge],
       FULLTEXTCATALOGPROPERTY(cat.name, 'PopulateStatus') AS [PopulateStatus],
       FULLTEXTCATALOGPROPERTY(cat.name, 'ImportStatus') AS [ImportStatus]
FROM sys.fulltext_catalogs AS cat
```

### PopulateStatus

0 = Idle  
1 = Full population in progress  
2 = Paused  
3 = Throttled  
4 = Recovering  
5 = Shutdown  
6 = Incremental population in progress  
7 = Building index  
8 = Disk is full. Paused.  
9 = Change tracking


## Display Index Size

{:.ignore}
```sql
SELECT t.name AS TableName,
       s.name AS SchemaName,
       FORMAT(p.rows, '#,###') AS RowCounts,
       SUM(a.total_pages) * 8 AS TotalSpaceKB,
       CAST(ROUND(((SUM(a.total_pages) * 8) / 1024.00), 2) AS NUMERIC(36, 2)) AS TotalSpaceMB,
       SUM(a.used_pages) * 8 AS UsedSpaceKB,
       CAST(ROUND(((SUM(a.used_pages) * 8) / 1024.00), 2) AS NUMERIC(36, 2)) AS UsedSpaceMB,
       (SUM(a.total_pages) - SUM(a.used_pages)) * 8 AS UnusedSpaceKB,
       CAST(ROUND(((SUM(a.total_pages) - SUM(a.used_pages)) * 8) / 1024.00, 2) AS NUMERIC(36, 2)) AS UnusedSpaceMB
FROM sys.tables t
    INNER JOIN sys.indexes i
        ON t.object_id = i.object_id
    INNER JOIN sys.partitions p
        ON i.object_id = p.object_id
           AND i.index_id = p.index_id
    INNER JOIN sys.allocation_units a
        ON p.partition_id = a.container_id
    LEFT OUTER JOIN sys.schemas s
        ON t.schema_id = s.schema_id
GROUP BY t.name,
         s.name,
         p.rows;
```