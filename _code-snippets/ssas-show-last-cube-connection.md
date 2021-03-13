---
layout: snippet
title: SQL Server Analysis Services show last connection to a cube
description: Display the most recent connections to a cube in SSAS
tags:
  - ssas
  - analysis-services
language: dmx
variables:
---

```plaintext
select connection_id, connection_user_name, connection_host_name, connection_host_application,
    connection_start_time, connection_elapsed_time_ms, 
    connection_last_command_start_time, connection_last_command_end_time,
    connection_last_command_elapsed_time_ms,
    connection_idle_time_ms
     from $system.discover_connections
order by connection_last_command_end_time desc
```
