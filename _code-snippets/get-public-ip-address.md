---
layout: snippet
title: Get public IP address from the terminal
tags:
  - bash
  - linux
language: bash
variables:
---

icanhazip is a simple website that does nothing but display your IP
address. The below command restricts to the IPv4 address.

```bash
curl -4 -s -X GET "https://icanhazip.com"
```