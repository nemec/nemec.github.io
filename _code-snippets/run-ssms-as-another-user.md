---
layout: snippet
title: Run SQL Server Management Studio (SSMS) as another user
description: Some description
tags:
  - cmd
  - windows
  - ssms
language: cmd
variables:
  User ID:
    replace: domain\$userid

---

```bash
runas /profile /user:domain\$userid "C:\Program Files (x86)\Microsoft SQL Server\140\Tools\Binn\ManagementStudio\Ssms.exe"
```