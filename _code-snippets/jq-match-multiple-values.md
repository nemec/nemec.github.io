---
layout: snippet
title: Filter JSON in jq with one of many values
description:
tags:
  - bash
  - linux
  - jq
language: bash
variables:
---

e.g. match when state is "austin", "houston", or "dallas".

```bash
head state_data.json | jq -n '["houston", "austin", "dallas"] as $whitelist
  | ($whitelist | map( {(.): true} ) | add) as $dictionary
  | inputs
  | select($dictionary[.state])'
```