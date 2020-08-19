---
layout: snippet
title: Create a primary key on multiple columns
tags:
  - sql
  - mssql
language: sql
variables:
---

```sql
CREATE TABLE Persons ( 
    ID int NOT NULL, 
    LastName varchar(255) NOT NULL, 
    FirstName varchar(255), 
    Age int, 
    CONSTRAINT PK_Person PRIMARY KEY (ID,LastName) 
);
```