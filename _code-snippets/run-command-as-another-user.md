---
layout: snippet
title: Run command as another user
description: Some description
tags:
  - cmd
  - windows
language: cmd
variables:
  User ID:
    replace: $userid
  Command:
    replace: cmd

---

```powershell
runas /user:$userid cmd
```