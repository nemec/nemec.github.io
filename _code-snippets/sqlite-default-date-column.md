---
layout: snippet
title: SQLite date column with default value
description: How to create a date column with a default value in a SQLite database
tags:
  - sqlite
  - sql
language: sqlite
variables:
---

<https://sqlite.org/lang_datefunc.html>

Note: there is no "datetime" type, but as [documented in the type affinities page](https://sqlite.org/datatype3.html),
SQLite accepts it and converts the input to a numeric type internally.

```sql
CREATE TABLE "SAMPLE_TABLE" (
    "title" TEXT NOT NULL,
    "inserted_date" DATETIME DEFAULT CURRENT_TIMESTAMP
)
```