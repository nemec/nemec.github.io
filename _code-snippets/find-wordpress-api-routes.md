---
layout: snippet
published: true
title: Find Wordpress API routes for a site
description: Quick script to print out all the routes without 
tags:
  - bash
  - linux
language: bash
variables:
  $BASE_URL:
    #type: date # https://www.w3schools.com/html/html_form_input_types.asp
    replace: $BASE_URL
    placeholder: https://example.com
    #attrs:
    #  min: '2020-08-01'
---

```bash
curl '$BASE_URL/wp-json/' | jq -r '.routes | keys[]'
```

{:.ignore}
```plaintext
Ignore this when copying scripts
```