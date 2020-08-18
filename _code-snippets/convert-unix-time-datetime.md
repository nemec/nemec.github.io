---
layout: snippet
title: Convert Unix time to datetime
tags:
  - python
language: python
variables:
  timestamp:
    type: number # https://www.w3schools.com/html/html_form_input_types.asp
    replace: 1579117901
    #attrs:
    #  min: '2020-08-01'
---

```python
# https://stackoverflow.com/a/59758661/564755
import datetime

timestamp = 1579117901
value = datetime.datetime.fromtimestamp(timestamp)
print(f"{value:%Y-%m-%d %H:%M:%S}")
```

via <https://superuser.com/a/1041818/91462>