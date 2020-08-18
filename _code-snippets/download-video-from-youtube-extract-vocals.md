---
layout: snippet
title: Download a video from youtube and extract the vocals
description: Some description
tags:
  - bash
  - linux
language: bash
variables:
  $YOUTUBE_URL:
    replace: https://www.youtube.com/watch?v=e-ORhEE9VVg
---

This command requires Python 3, youtube-dl, and ffmpeg to be installed.

```bash
python3 -m venv env
source env/bin/activate
pip install wheel spleeter
VIDEO_URL='https://www.youtube.com/watch?v=e-ORhEE9VVg'
youtube-dl -f bestaudio --extract-audio "$VIDEO_URL" --exec "spleeter separate -i {} -p spleeter:2stems -o . && rm {} "
# wait for a couple of minutes
```