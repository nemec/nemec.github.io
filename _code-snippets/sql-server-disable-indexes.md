---
layout: snippet
title: Disable all indexes on a table in SQL Server
description:
tags:
  - sql
  - sql-server
language: sql
variables:
  TABLE_NAME:
    replace: '[dbo].[TABLE_NAME]'
---

```bash
DECLARE @sql AS VARCHAR(MAX)='';

SELECT @sql = @sql + 
'ALTER INDEX ' + sys.indexes.name + ' ON  ' + sys.objects.name + ' DISABLE;' +CHAR(13)+CHAR(10)
FROM 
    sys.indexes
JOIN 
    sys.objects 
    ON sys.indexes.object_id = sys.objects.object_id
WHERE sys.indexes.type_desc = 'NONCLUSTERED'
  AND sys.objects.type_desc = 'USER_TABLE'
  AND sys.objects.object_id = object_id('[dbo].[TABLE_NAME]');


PRINT(@sql);
--EXEC(@sql);
```
