---
layout: snippet
title: List all schemas, tables, and columns in a database
tags:
  - sql
  - mssql
language: sql
variables:
---

## Schemas 

```sql
SELECT
  CATALOG_NAME AS [DatabaseName],
  [SCHEMA_NAME] AS [SchemaName]
FROM
  INFORMATION_SCHEMA.SCHEMATA
WHERE [SCHEMA_NAME] not like 'db[_]%' and [SCHEMA_NAME] not in ('sys', 'guest', 'INFORMATION_SCHEMA')
```

## Tables 

```sql
SELECT
  TABLE_CATALOG AS [DatabaseName],
  TABLE_SCHEMA AS [Schema],
  TABLE_NAME AS [TableName],
  TABLE_TYPE AS [TableOrView]
FROM
  INFORMATION_SCHEMA.TABLES 
``` 

## Columns 

```sql
SELECT
  TABLE_CATALOG AS [DatabaseName], 
  TABLE_SCHEMA AS [Schema], 
  TABLE_NAME AS [TableName], 
  COLUMN_NAME AS [ColumnName],  
  IS_NULLABLE AS [Nullable],  
  DATA_TYPE AS [Type],  
  ISNULL(CAST(CHARACTER_MAXIMUM_LENGTH AS VARCHAR(5)), '') as [FieldLength]  
FROM
  INFORMATION_SCHEMA.COLUMNS
```