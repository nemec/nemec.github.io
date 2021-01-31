---
layout: snippet
title: Print the raw HTTP request from Python's requests library
tags:
  - python
  - requests
language: python
variables:
---

```python
import requests

def get_raw_http(resp: requests.Response):
    req = resp.request
    version = {10: '1.0', 11: '1.1', 2:'1.2'}.get(resp.raw.version, '1.1')
    result = f'{req.method} {req.url} HTTP/{version}\n'
    for k, v in req.headers.items():
        result += f'{k}: {v}\n'
    result += str(req.body or '')
    return result

resp = requests.post('https://example.com', headers={
  'X-Forwarded-For': '127.0.0.1'
}, json={
  'hello':'world'
})
print(get_raw_http(resp))
```