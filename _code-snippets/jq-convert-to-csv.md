---
layout: snippet
title: Convert JSON to CSV with jq
tags:
  - bash
  - jq
language: bash
variables:
---

The first section, `["POST URL", "METHOD"]`, defines the header row. The rest
of the query from the JSON data (in this case, a HAR file) is appended after
the header row.

The deconstruction into a row of data happens at this section: `[.url, .method]`  
This should match the order and size of the header row to get a proper CSV file.

The final selection, `@csv` is a special jq command that converts the list of
arrays into a CSV format. The results are output to the terminal, but can
be redirected to a file via stdout redirection.

```bash
jq -r '["POST URL", "METHOD"], (.log.entries[].request |
  select( .method == "GET" ) | [.url, .method]) | @csv' website.har
```