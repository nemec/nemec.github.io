---
layout: snippet
title: Create a quick progress counter to monitor the performance of tight loops
description: Count the number of seconds between N iterations of a long loop
tags:
  - python
language: python
variables:
  num_iterations:
    replace: 1000000
---

```python
from datetime import time
import time

last_ts = time.time()
iterations_threshold = 1000000
num_iterations = 0
for item in ...:
    num_iterations += 1
    if num_iterations % iterations_threshold == 0:
        curr_ts = time.time()
        print(f'{datetime.now():%Y-%m-%d %H:%M:%S} '
              f'({int(curr_ts-last_ts)}) {num_iterations}')
        last_ts = curr_ts
```