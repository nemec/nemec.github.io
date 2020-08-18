---
layout: snippet
title: Create a quick SOCKS proxy to use with Chrome
description: Some description
tags:
  - bash
  - linux
  - ssh
language: bash
variables:
  remote-host.com:
---

via <https://www.digitalocean.com/community/tutorials/how-to-route-web-traffic-securely-without-a-vpn-using-a-socks-tunnel>

This command will create an SSH connection to a remote server (the "proxy")
that you can tunnel your browser traffic through. Your IP address will appear
to be that of the remote server's. This also works in other browsers and any other
application that allows a SOCKS proxy.

```bash
ssh -D 8123 -f -C -q -N root@remote-host.com
```

Stop the proxy by killing the new process that was created:

```bash
ps aux | grep 'ssh -D 8123'
```

To use the flag, configure Chrome/Chromium to use `localhost:8123` as a SOCKS5
proxy, or start it from the command line with the flag `--proxy-server="socks5://localhost:8123"`.