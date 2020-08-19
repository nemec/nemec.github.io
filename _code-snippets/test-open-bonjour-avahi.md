---
layout: snippet
title: Test open ports for AFP/Bonjour/Avahi
description: The open ports for the zeroconf protocol may expose vulnerabilities
  to other machines on the network. If you aren't actively using zeroconf or its
  implementations (Bonjour/Avahi), you may want to disable the services listening
  on those ports.
tags:
  - bash
  - linux
  - bonjour
  - avahi
  - nmap
language: bash
variables:
  Host:
    replace: 10.0.0.102
---

```bash
nmap -sU -sS -T4 10.0.0.102
```

Check output for "5353/udp open zeroconf" and "548/tcp open afp"