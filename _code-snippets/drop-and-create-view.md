---
layout: snippet
title: Drop a view (if it exists) and recreate it
tags:
  - sql
  - mssql
language: sql
variables:
---

```sql
IF OBJECT_ID('[dbo].[VIEW]', 'V') IS NOT NULL 
    drop view [dbo].[VIEW]
go 

create view [dbo].[VIEW] as […] 
go 
```