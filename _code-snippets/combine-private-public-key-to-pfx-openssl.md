---
layout: snippet
title: Combine private key and public key into pfx certificate
tags:
  - bash
  - linux
  - openssl
language: bash
variables:
  $CERT_FILE:
    replace: cert.pfx
  $PRIVATE_KEY:
    replace: privkey.pem
  $PUBLIC_KEY:
    replace: fullchain.pem
---

```bash
openssl pkcs12 -export -out cert.pfx -inkey privkey.pem -in fullchain.pem
```