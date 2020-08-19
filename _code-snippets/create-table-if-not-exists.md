---
layout: snippet
title: Create a table in a database if it doesn't already exist
tags:
  - sql
  - mssql
language: sql
variables:
---

```sql
IF OBJECT_ID('dbo.[TABLE]', 'U') IS NULL 
  CREATE TABLE dbo.[TABLE]( 
    […]
  )
```