---
layout: snippet
title: Combine a list of videos together into one longer video
description: Some description
tags:
  - bash
  - linux
  - ffmpeg
language: bash
variables:
---

Info found here: <https://superuser.com/questions/692990/use-ffmpeg-copy-codec-to-combine-ts-files-into-a-single-mp4>

### Find all the .ts files in the dir and combine into a file

```bash
ls -v *.ts | sed -r "s/^(.+)/file '\1'/" > files.txt
```

### Process that list of videos in ffmpeg

```bash
ffmpeg -f concat -i files.txt -c copy out.mp4
```