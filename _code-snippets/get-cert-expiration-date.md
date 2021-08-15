---
layout: snippet
title: Get Certificate Expiration Date in a Shell Script
tags:
  - bash
  - openssl
  - linux
language: bash
variables:
  $SERVER:
---

```bash
openssl s_client -servername $SERVER -connect $SERVER:443 </dev/null 2>/dev/null | \
  openssl x509 -noout -enddate | \
  sed 's/notAfter=//' | \
  xargs -0 date +"%Y-%m-%d" -u -d | tr -d '\n'
```
