---
layout: snippet
title: Look up a user on VirusTotal
description: A bash function to look up a user on VirusTotal and find the
  First Name, Last Name, Reputation, Status, and Registration Date of the
  user if the data is filled in.
tags:
  - bash
  - curl
  - osint
language: bash
variables:
  $USERNAME:
    replace: test
---

h/t to [this tweet](https://twitter.com/GONZOs_int/status/1334811159724253184)
from @GONZOs_int for the method.

(Note: working as of 2020/12/04. May stop working at any time.)

```bash
lookup_vt_user() {
    USERNAME="$1";
    CSRF=$(curl 'https://www.virustotal.com/gui/join-us' | \
            grep -Po '(?<=captchaSiteKey":")([^"]+)' | base64);
    curl "https://www.virustotal.com/ui/users/$USERNAME" \
        -H 'User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:83.0) Firefox' \
        -H 'X-Tool: vt-ui-main' \
        -H "X-VT-Anti-Abuse-Header: $CSRF" \
        -H 'Accept-Ianguage: en-US,en;q=0.9,es;q=0.8';
}
```

### Usage:

```bash
lookup_vt_user test
```