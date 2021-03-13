---
layout: snippet
title: List the Column Sizes of Each Table in a SQL Server Database
description:
tags:
  - sql
  - sql-server
language: sql
variables:
---

Source: <https://stackoverflow.com/questions/2729126/how-to-find-column-names-for-all-tables-in-all-databases-in-sql-server/28505568>

```sql
SELECT
     s.name as ColumnName
    ,sh.name+'.'+o.name AS ObjectName
    ,o.type_desc AS ObjectType
    ,CASE
          WHEN t.name IN ('char','varchar') THEN t.name+'('+CASE WHEN s.max_length<0 then 'MAX' ELSE CONVERT(varchar(10),s.max_length) END+')'
          WHEN t.name IN ('nvarchar','nchar') THEN t.name+'('+CASE WHEN s.max_length<0 then 'MAX' ELSE CONVERT(varchar(10),s.max_length/2) END+')'
        WHEN t.name IN ('numeric') THEN t.name+'('+CONVERT(varchar(10),s.precision)+','+CONVERT(varchar(10),s.scale)+')'
          ELSE t.name
      END AS DataType
      ,s.[max_length]

    ,CASE
          WHEN s.is_nullable=1 THEN 'NULL'
        ELSE 'NOT NULL'
    END AS Nullable
    ,CASE
          WHEN ic.column_id IS NULL THEN ''
          ELSE ' identity('+ISNULL(CONVERT(varchar(10),ic.seed_value),'')+','+ISNULL(CONVERT(varchar(10),ic.increment_value),'')+')='+ISNULL(CONVERT(varchar(10),ic.last_value),'null')
      END
    +CASE
          WHEN sc.column_id IS NULL THEN ''
          ELSE ' computed('+ISNULL(sc.definition,'')+')'
      END
    +CASE
          WHEN cc.object_id IS NULL THEN ''
          ELSE ' check('+ISNULL(cc.definition,'')+')'
      END
        AS MiscInfo
FROM sys.columns                           s
    INNER JOIN sys.types                   t ON s.system_type_id=t.user_type_id and t.is_user_defined=0
    INNER JOIN sys.objects                 o ON s.object_id=o.object_id
    INNER JOIN sys.schemas                sh on o.schema_id=sh.schema_id
    LEFT OUTER JOIN sys.identity_columns  ic ON s.object_id=ic.object_id AND s.column_id=ic.column_id
    LEFT OUTER JOIN sys.computed_columns  sc ON s.object_id=sc.object_id AND s.column_id=sc.column_id
    LEFT OUTER JOIN sys.check_constraints cc ON s.object_id=cc.parent_object_id AND s.column_id=cc.parent_column_id
WHERE o.type_desc IN ('USER_TABLE', 'view')
ORDER BY CASE WHEN s.max_length<0 THEN 0 ELSE 1 END, s.max_length desc
```
