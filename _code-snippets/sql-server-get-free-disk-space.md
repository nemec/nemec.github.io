---
layout: snippet
title: List Free Disk Space in a SQL Server Database
description: Some description
tags:
  - sql
  - sql-server
language: sql
variables:
---

This script will list all of the databases on a server, the disk drive
where that database resides, and the amount of free space in MB, GB, and TB
on each disk.

Source: <https://blog.sqlauthority.com/2013/08/02/sql-server-disk-space-monitoring-detecting-low-disk-space-on-server/>

```sql
SELECT DISTINCT
  DB_NAME(dovs.database_id) AS DBName,
  mf.physical_name PhysicalFileLocation,
  dovs.logical_volume_name AS LogicalName,
  dovs.volume_mount_point AS Drive,
  CONVERT(INT,dovs.available_bytes/1048576.0) AS FreeSpaceInMB,
  CONVERT(INT,dovs.available_bytes/1073741824.0) AS FreeSpaceInGB,
  CONVERT(NUMERIC(8, 2),dovs.available_bytes/1099511627776.0) AS FreeSpaceInTB
FROM sys.master_files mf
CROSS APPLY sys.dm_os_volume_stats(mf.database_id, mf.FILE_ID) dovs
ORDER BY FreeSpaceInMB ASC
```
