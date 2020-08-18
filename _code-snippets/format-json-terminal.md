---
layout: snippet
title: Format JSON in the terminal
description: Some description
tags:
  - bash
  - linux
  - jq
language: bash
variables:
  $CMD:
---

$CMD is any command that outputs JSON. Requires the jq command to be installed
(on Ubuntu the install command is 'sudo apt install jq').

```bash
$CMD | jq .
```