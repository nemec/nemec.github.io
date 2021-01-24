---
layout: snippet
title: Creating a Systemd startup for a service
description: Some description
tags:
  - linux
  - systemd
language: ini
variables:
---

Source: <https://www.howtogeek.com/687970/how-to-run-a-linux-program-at-startup-with-systemd/>

Create unit file:

```bash
sudo nano /etc/systemd/system/myapp.service
```

Paste the following into the unit file:

```ini
[Unit]
Description=My App

Wants=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/myapp.sh
#ExecStart=node src/www
Restart=on-failure
RestartSec=10
KillMode=process

[Install]
WantedBy=multi-user.target
```

```bash
sudo chmod 640 /etc/systemd/system/myapp.service
```
Test the unit file:

```bash
systemctl status myapp.service
```

Enable unit file and service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable myapp
sudo systemctl start myapp
```

Verify service status:

```bash
sudo systemctl status myapp.service
```