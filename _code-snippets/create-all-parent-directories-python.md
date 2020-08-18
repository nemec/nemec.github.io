---
layout: snippet
title: Create all parent directories in a file path
tags:
  - python
  - pathlib
language: python
variables:
  $FILE_PATH:
    replace: /home/user/first/second/third
---
via <https://stackoverflow.com/a/41146954/564755>

```python
from pathlib import Path
path = Path('/home/user/first/second/third')
path.mkdir(parents=True)
```