---
layout: snippet
title: Assign a default group to any files created in a directory on Linux
description: Some description
tags:
  - bash
  - linux
language: bash
variables:
  $DIR:
---

Source: <https://linuxconfig.org/how-to-use-special-permissions-the-setuid-setgid-and-sticky-bits>

### setgid

```bash
chmod 2775 $DIR
```

OR

```bash
chmod g+s $DIR
```

Note with the `2775` permission, the `2` is the setgid bit and the `755` are
regular permissions for user-rwx, group-rwx, all-rx