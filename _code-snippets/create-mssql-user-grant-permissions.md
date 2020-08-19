---
layout: snippet
title: Create an MS SQL user and grant permissions
tags:
  - sql
  - mssql
language: sql
variables:
---

```sql
CREATE LOGIN MyLogin WITH PASSWORD = '123'; 
CREATE USER Guru99 FOR LOGIN MyLogin
GRANT SELECT ON SCHEMA :: [dbo] TO myspecialrole
GRANT SELECT ON [dbo].[myarchivetable] TO myspecialrole
```