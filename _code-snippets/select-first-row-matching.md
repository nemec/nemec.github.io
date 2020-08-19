---
layout: snippet
title: Select the first row in each group
tags:
  - sql
  - mssql
language: sql
variables:
---

This query selects the first row for each 'customer' with the highest 'total'.

```sql
WITH summary AS ( 
    SELECT p.id,  
           p.customer,  
           p.total,  
           ROW_NUMBER() OVER(PARTITION BY p.customer  
                                 ORDER BY p.total DESC) AS rk 
      FROM PURCHASES p) 
SELECT s.* 
  FROM summary s 
 WHERE s.rk = 1
```