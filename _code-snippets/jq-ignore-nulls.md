---
layout: snippet
title: Ignore null values in jq output
description: Select a value from a JSON object and don't print the results that are null
tags:
  - bash
  - jq
language: bash
variables:
---


```bash
jq -r '.firstName | select( . != null )' file.json
```