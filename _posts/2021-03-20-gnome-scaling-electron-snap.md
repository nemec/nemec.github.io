---
layout: post
title: HiDPI Scaling for Electron-based Snap apps like Spotify
description:
category: programming
tags:
  - gnome
  - hidpi
headerImage: 2021/03/snap.jpg
headerImageAttrib: 'Image credit: @jomer on Unsplash.com'
---

When using Gnome Shell with HiDPI monitors, even with display scaling some
apps do not scale with the rest of the UI. One app I had trouble with is the
Spotify desktop client, which I know is an Electron app wrapping the web UI.

While [searching for solutions](https://wiki.archlinux.org/index.php/HiDPI#Spotify)
I came across one option to add a CLI flag to the Electron launcher:

    $ spotify --force-device-scale-factor=1.5

On Gnome/Ubuntu, applications launched from the Activities panel (see below)
are all defined somewhere in a .desktop file.

![Spotify in the Gnome Activities panel](/images/2021/03/spotify-search.png)

I tried searching for Spotify in the usual places where .desktop files are
stored on Ubuntu, namely:

* `/usr/share/applications/`
* `~/.local/share/applications/`

However, none of those places contained a .desktop file with the word 'spotify'
in the filename. I decided to see where the Spotify application was installed,
so I ran the following command:

    $ which spotify
    /snap/bin/spotify

Aha! It's not a regular application, it was installed as a Snap. Reading
[the documentation](https://snapcraft.io/docs/desktop-menu-icon-support) for
Snap installs, it tells us that .desktop files will be copied to the directory
`/var/lib/snapd/desktop/applications/` on install. Let's try it:

    $ ls /var/lib/snapd/desktop/applications/ | grep -i spotify
    spotify_spotify.desktop

And we've found it! Edit the file `/var/lib/snapd/desktop/applications/spotify_spotify.desktop`
in your favorite text editor (using sudo/gksudo). In my case, I changed the following line:

```plain
Exec=env BAMF_DESKTOP_FILE_HINT=/var/lib/snapd/desktop/applications/spotify_spotify.desktop /snap/bin/spotify %U
```

to

```plain
Exec=env BAMF_DESKTOP_FILE_HINT=/var/lib/snapd/desktop/applications/spotify_spotify.desktop /snap/bin/spotify --force-device-scale-factor=2 %U
```

You may need to run the following command for the changes to be recognized:

```bash
sudo update-desktop-database
```

Restart Spotify and the UI is now scaled 200%, like the rest of my UI.