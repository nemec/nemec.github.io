---
layout: snippet
title: Find duplicate records in a table
tags:
  - sql
  - mssql
language: sql
variables:
---

The below query finds duplicate 'partnumber' values in the table 'MYTABLE'.

```sql
select m.*
from (
    select partnumber
    from MYTABLE
    group by partnumber
    having count(*) > 1
    ) a
join MYTABLE m
on a.partnumber = m.partnumber
```