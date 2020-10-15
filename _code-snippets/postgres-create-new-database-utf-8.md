---
layout: snippet
published: false # REMOVE ME
title: Create a Postgres database with UTF-8 support
tags:
  - sql
  - postgres
language: sql
variables:
---

```sql
CREATE DATABASE "subsonic"
    WITH OWNER "subsonic"
    ENCODING 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TEMPLATE template0;
```