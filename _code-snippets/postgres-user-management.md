---
layout: snippet
title: User management in Postgres databases
description: Some description
tags:
  - sql
  - postgres
language: sql
variables:
---

### Create a user

```sql
CREATE USER iguser WITH ENCRYPTED PASSWORD 'abcde';
```

### Grant privileges to user

```sql
GRANT ALL PRIVILEGES ON DATABASE instagram TO iguser;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO iguser;
```