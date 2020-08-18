---
layout: snippet
title: Search for a regular expression in multiple files
tags:
  - bash
  - linux
  - grep
language: bash
variables:
  $REGEX:
  $DIRECTORY:
---

```bash
grep -irnw -e "$REGEX" "$DIRECTORY"
```

* -i for case insensitive matching
* -r searches through all files in the directory and all subdirectories
* -n prints the line number within the matching file
* -w matches whole words (starting or ending with punctuation/lines)  
  For example, searching for 'red' on the lines _'redwings'_ or _'subreddit'_ will
  not match, but it will match the line _'the color (red)'_. This can be removed
  to match anywhere within the line.
* -e defines the basic regular expression matching pattern. 