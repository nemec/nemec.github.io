---
layout: snippet
title: Update a table with a join
tags:
  - sql
  - mssql
language: sql
variables:
---

```sql
UPDATE u  -- u is the table to be updated
SET u.assid = s.assid 
FROM ud u 
INNER JOIN sale s
ON u.id = s.udid
```