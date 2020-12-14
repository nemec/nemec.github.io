---
layout: snippet
title: Create a clustered primary key in a SQLite table
description: Choose the column of a clustered index in a SQLite table instead of using the in-built rowid
tags:
  - sqlite
language: sqlite
variables:
---

<https://sqlite.org/withoutrowid.html>

```sql
CREATE TABLE "SAMPLE_TABLE" (
    "file_id" TEXT PRIMARY KEY,
    "inserted_date" DATETIME DEFAULT CURRENT_TIMESTAMP
) WITHOUT ROWID
```