---
layout: snippet
title: Parse JSON with jq and ignore lines with errors
tags:
  - bash
  - jq
language: bash
variables:
---

The `-R` causes jq to read each line without parsing it. Then the `fromjson?`
filter attempts to parse each line and the `?` appended to the end causes jq to
skip further parsing if the line is invalid JSON. Nothing will be printed to the
terminal for lines with invalid JSON.

```bash
jq -R 'fromjson? | .' file.json
```


Removing the `?` will cause each line that isn't valid JSON to produce an error,
which can be redirected to a file to collect the filename and line number of
all invalid JSON.

{:.ignore}
```bash
$ cat file.json
{"a": 1}
[1, 2, 3]
heello
{"else": "for"}
$ jq -R 'fromjson | .' file.json 2>errors.txt
$ cat errors.txt
jq: error (at file.json:3): Invalid numeric literal at EOF at line 1, column 6 (while parsing 'heello')
```
