---
layout: snippet
title: Show SSL/TLS/x509 certificate information for a remote host
description: Some description
tags:
  - bash
  - linux
  - openssl
language: bash
variables:
  Host:
    replace: google.com
---

```bash
openssl s_client -host google.com -port 443 -prexit -showcerts </dev/null
```