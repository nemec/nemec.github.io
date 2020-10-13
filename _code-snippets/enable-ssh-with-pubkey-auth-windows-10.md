---
layout: snippet
title: Install SSH on Windows 10 and enable key-based authentication
tags:
  - windows
  - ssh
language: powershell
variables:
---

## Setup SSH

Source: <https://winscp.net/eng/docs/guide_windows_openssh_server>

* In Settings app, go to Apps > Apps & features > Manage optional features.
* Locate "OpenSSH server" feature, expand it, and select Install.
* Run:

```powershell
New-NetFirewallRule -Name sshd -DisplayName 'OpenSSH SSH Server' `
    -Enabled True -Direction Inbound -Protocol TCP -Action Allow `
    -LocalPort 22 -Program "C:\System32\OpenSSH\sshd.exe"
```

* Go to Control Panel > System and Security > Administrative Tools and open Services. Locate OpenSSH SSH Server service.
* If you want the server to start automatically when your machine is started: Go to Action > Properties. In the Properties dialog, change Startup type to Automatic and confirm.
* Start the OpenSSH SSH Server service by clicking the Start the service.

## Enable Key Authentication

Source: <https://github.com/PowerShell/Win32-OpenSSH/wiki/Security-protection-of-various-files-in-Win32-OpenSSH>

For administrator user:

```powershell
cd C:\ProgramData\ssh\
New-Item administrators_authorized_keys
# Copy-paste public key (e.g. ~/.ssh/id_rsa.pub) entry into this file
icacls administrators_authorized_keys /inheritance:r
icacls administrators_authorized_keys /grant SYSTEM:`(F`)
icacls administrators_authorized_keys /grant BUILTIN\Administrators:`(F`)
```