---
layout: snippet
title: Create and Manage Users and Groups on Linux
description: Various ways of creating a new user or group on Linux
tags:
  - bash
  - linux
language: bash
variables:
  $USER:
  $GROUP:
---

Source: <https://superuser.com/questions/77617/how-can-i-create-a-non-login-user>

### Create new user

```bash
adduser --system --no-create-home --group --disabled-login $USER
```

* Create a user with a UID in the "system" range (not much different otherwise)
* No home directory
* Create a group for the user (same name)
* Prevent the user from logging in normally (can switch from root though)

### Create Group

```bash
addgroup --gid 2000 $GROUP
```

* Can manually set the group ID with `--gid`

### Add existing user to another group

```bash
usermod -aG $GROUP $USER
```

* `-a` ensures the group is appended to the user's list of groups instead of
  replacing it.