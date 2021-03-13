---
layout: snippet
title: Track UPDATE progress for a SQL Server query
description: 
tags:
  - sql
  - sql-server
language: sql
variables:
  TABLE_NAME:
    replace: '[dbo].[TABLE_NAME]'
---

This is kind of an inexact science, but while an update is running, the
`rows` column will eventually start counting down to match `rowmodctr`.
When these two columns begin getting close to the same value, the update
is almost finished. Run the query multiple times to gauge progress.

```bash
select name, rows, rowmodctr
from sysindexes with (nolock)
where id = object_id('[dbo].[TABLE_NAME]')
```