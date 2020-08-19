---
layout: snippet
title: Copy data from one table into another
description: Some description
tags:
  - sql
  - mssql
language: sql
variables:
---

When destination table exists - INSERT INTO SELECT

```sql
----Create testable 
CREATE TABLE TestTable (FirstName VARCHAR(100), LastName VARCHAR(100)) 
----INSERT INTO TestTable using SELECT 
INSERT INTO TestTable (FirstName, LastName) 
SELECT FirstName, LastName 
FROM Person.Contact 
WHERE EmailPromotion = 2 
----Verify that Data in TestTable 
SELECT FirstName, LastName 
FROM TestTable 
----Clean Up Database 
DROP TABLE TestTable
```

When destination table does not exist - SELECT INTO

```sql
----Create a new table and insert into table using SELECT INSERT 
SELECT FirstName, LastName 
INTO TestTable 
FROM Person.Contact 
WHERE EmailPromotion = 2 
----Verify that Data in TestTable 
SELECT FirstName, LastName 
FROM TestTable 
----Clean Up Database 
DROP TABLE TestTable
```

via <https://stackoverflow.com/questions/4101739/sql-server-select-into-existing-table>