---
layout: snippet
title: Hash a large file in Python
description: Hashes a large file in chunks, supports multiple hash algorithms
tags:
  - python
  - md5
  - sha1
language: python
variables:
  filename:
  blocksize:
    #type: date # https://www.w3schools.com/html/html_form_input_types.asp
    replace: 8192
    #attrs:
    #  min: '2020-08-01'
---

```python
import hashlib

# Can replace algorithm with hashlib.sha1, hashlib.sha256, etc.
def hash_file(f: BinaryIO, blocksize: int=8192, algorithm=hashlib.md5):
    file_hash = algorithm()
    for chunk in iter(lambda: f.read(blocksize), b""):
      file_hash.update(chunk)
    return file_hash.hexdigest()

with open(filename, 'b') as f:
    print(hash_file(f))
```