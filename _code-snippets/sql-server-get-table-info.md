---
layout: snippet
title: Get Table Information (Schema, Table, Size) for a Database on SQL Server
description:
tags:
  - sql
  - sql-server
language: sql
variables:
---

```sql
SELECT 
    ISNULL(s.name, '--Total--') as SchemaName,							    
    ISNULL(t.NAME, '--Total--') AS TableName,
    p.rows AS RowCounts,
    SUM(a.total_pages) * 8 AS TotalSpaceKB,
    (SUM(a.total_pages) * 8) /1000 AS TotalSpaceMB, 
    (SUM(a.total_pages) * 8) /1000000 AS TotalSpaceGB, 
    SUM(a.used_pages) * 8 AS UsedSpaceKB, 
    (SUM(a.total_pages) - SUM(a.used_pages)) * 8 AS UnusedSpaceKB
FROM 
    sys.tables t
INNER JOIN      
    sys.indexes i ON t.OBJECT_ID = i.object_id
INNER JOIN 
    sys.partitions p ON i.object_id = p.OBJECT_ID AND i.index_id = p.index_id
INNER JOIN 
    sys.allocation_units a ON p.partition_id = a.container_id
INNER JOIN																  
    sys.schemas s
    on t.schema_id = s.schema_id
WHERE 
    t.NAME NOT LIKE 'dt%' 
    AND t.is_ms_shipped = 0
    AND i.OBJECT_ID > 255
GROUP BY CUBE
    ((s.name, t.Name, p.Rows))
ORDER BY 
    TotalSpaceKB DESC, t.name
```