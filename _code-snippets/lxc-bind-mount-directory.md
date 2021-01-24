---
layout: snippet
title: LXC bind mount directory with read/write permissions
tags:
  - bash
  - linux
  - lxc
language: bash
variables:
---

Source: <https://www.reddit.com/r/homelab/comments/4h0erv/resolving_permissions_issues_with_host_bind/>

For my home server, I run the majority of my serices via LXC/LXD on Ubuntu. I started with LXC vms and have slowly begun migrating to LXD containers. One of the key issues with using unprivileged containers is overcoming permissions issues when sharing files between the container guests and the host. I thought I'd share how I do it to gain insight from others on this sub.

With LXC, if you use unprivileged containers as root, the container ends up taking the subuid and subgid ranges for root and mapping them to UIDs/GIDs inside the container. For a primer on this, see [this answer](https://unix.stackexchange.com/a/177031) at Unix SE and the [LXC Getting Started guide at Linuxcontainers.org](https://linuxcontainers.org/lxc/getting-started/). So for example, the subuid/subgid range on my system gets mapped to container UIDs/GIDs as follows:

```
200000 - 266535 -> 0 - 65535
```

LXD uses unprivileged containers by default and so UIDs/GIDs and mapped the same way as for LXC unprivileged containers as root.

Directories on the host can be bind mounted to LXC/LXD containers. However, a user inside the container has to have the correct permissions set up on the host directory in order to be able to read from or write to it. A straightforward way is to change the host directory permissions so that the container UID owns it. For example, permissions for a Movies directory for container UID 1000 could be set as follows on the host:

```bash
# root@host
chown -R 201000:201000 /mnt/Movies
```

This may work in cases where a only the container user needs access, and not any host users.

On the other hand, if users on the host and guest need read/write access, one methodology to set this up is with a combination of setgid and ACLs. Here's what I do for my containers:

Set the group ownership to a host group, and set group write and setgid permissions:

```bash
# root@host
chgrp -R homeusers /mnt/Movies
chmod -R 2775 /mnt/Movies
```

This way, any new files created inside the Movies directory will belong to the `homeusers` group on the host and have `rwx` group permissions, and directories will have `rws` permissions. Add host users to the `homeusers` group as needed.

```bash
# root@host
usermod -aG homeusers fideli_
```

Next, inside containers, create a `hostwrite` group, and (optionally) set the GID.

```bash
# root@guest
addgroup --gid 2000 hostwrite
```

Add container users to the hostwrite group as necessary.

```bash
# root@guest
usermod -aG hostwrite debian-transmission
```

On the host, set ACLs such that the mapped `hostwrite` GID on the host has write permissions.

```bash
# root@host
setfacl -Rm g:202000:rwx,d:g:202000:rwx /mnt/Movies
```

What this does is ensure that the Movies folder (and subfolders) get write permissions for GID 202000 (mapped to the hostwrite group on the guest), *and* that the default ACL for new files and folders is also allows GID 202000 access.

```bash
# root@host
getfacl /mnt/Movies
```
{:.ignore}
```plain
# file: /mnt/Movies
# owner: fideli_
# group: homeusers
# flags: -s-
user::rwx
group::rwx
group:202000:rwx
mask::rwx
other::r-x
default:user::rwx
default:group::rwx
default:group:202000:rwx
default:mask::rwx
default:other::r-x
```

Now, new files create in the container have the UID associated with the container user (i.e 200000 something) but they all belong to the `homeusers` group.

Hope this helps someone out there. I definitely didn't invent this, just synthesized it after reading a number of guides out there. The below references have some additional insight.

Looking forward to hearing if there's a more elegant way of doing this. Thanks!

References:

* [LXD Issue 714 - Mounting directories r/w](https://github.com/lxc/lxd/issues/714)
* [LXD Issue 872 - Implement a way to hot-plug mounts into container](https://github.com/lxc/lxd/issues/872)

Enable ACLs on ZFS pool:

Install ACL:

```bash
apt install acl
```

Get ZFS pool name and enable acls ([xattr=sa for performance](https://github.com/openzfs/zfs/issues/170#issuecomment-27348094)):

```bash
zfs list
zfs set acltype=posixacl rpool/share
zfs set xattr=sa rpool/share
```