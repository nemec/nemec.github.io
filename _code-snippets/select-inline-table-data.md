---
layout: snippet
title: Select an inline table of data
tags:
  - sql
  - mssql
language: sql
variables:
---

```sql
SELECT * FROM ( 
   VALUES(1, 'red'), 
         (2, 'orange'), 
         (5, 'yellow'), 
         (10, 'green'), 
         (11, 'blue'), 
         (12, 'indigo'), 
         (20, 'violet')) 
   AS Colors(Id, Value) 
``` 

Using an inline table in a join: 

```sql
SELECT v.valueId, m.name  
FROM (VALUES (1), (2), (3), (4), (5)) v(valueId) 
LEFT JOIN otherTable m 
ON m.id = v.valueId
```