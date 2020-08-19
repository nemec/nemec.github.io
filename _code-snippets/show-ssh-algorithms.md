---
layout: snippet
title: Show SSH algorithms and ciphers supported by a host/IP
tags:
  - bash
  - linux
  - nmap
language: bash
variables:
  Host:
    replace: 10.0.0.102
---

```bash
nmap --script ssh2-enum-algos -sV -p 22 10.0.0.102
```