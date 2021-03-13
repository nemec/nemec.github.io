---
layout: snippet
title: SQL Server Analysis Services show last session to a cube
description: Display the most recent sessions to a cube in SSAS
tags:
  - ssas
  - analysis-services
language: dmx
variables:
---

This script is useful for checking how recently people have been using a cube

```plaintext
SELECT
   session_spid
  ,session_user_name
  ,session_last_command
  ,session_current_database
  ,session_cpu_time_ms
  ,session_elapsed_time_ms
  ,session_start_time
  ,session_last_command_start_time
  ,session_last_command_end_time
  ,session_status
FROM $system.discover_sessions
--WHERE session_status = 1
/*
0 means "Idle": No current activity is ongoing.
1 means "Active": The session is executing some requested task.
2 means is "Blocked": The session is waiting for some resource to continue executing the suspended task.
3 means "Cancelled": The session has been tagged as cancelled.
*/
ORDER BY session_start_time desc
```
