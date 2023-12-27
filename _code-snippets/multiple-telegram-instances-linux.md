---
layout: snippet
title: How to run multiple Telegram Desktop instances at once on Linux
description: Run multiple Telegram Desktops with different accounts at the same time
tags:
  - telegram
  - linux
language: bash
variables:
---

You can use any install method for this, but for this use case I want Telegram
on a portable drive so I'm using the downloadable binaries.

1. Go to <https://desktop.telegram.org/> and click the link "Get Telegram for
Linux x64". This downloads a .tar.xz file containing the latest Telegram Desktop.

2. Extract the Telegram folder to the drive where you want to keep the files.

    ```bash
    tar xvf tsetup.4.13.1.tar.xz -C ~/bin/
    ```

3. Mark telegram binary as executable (note: you may need to repeat this when
Telegram updates itself automatically or you'll be unable to restart Telegram)

    ```bash
    chmod +x ~/bin/Telegram/Telegram
    ```

4. Create a shell file containing the following:

    ```bash
    #!/usr/bin/env sh
    ./Telegram -many -workdir "./tgdata1"
    ```

5. Make this file executable:

    ```bash
    chmod +x ~/bin/Telegram/tgdata1.sh
    ```

Now you can run it from the terminal or to run it from the file explorer,
open the Telegram folder and right click `tgdata1.sh`. Choose "Run as Program".
Create a new shell script for each instance you want to run and specify a
different workdir for each. You'll be able to sign in to a different Telegram
account in each instance.