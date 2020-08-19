---
layout: snippet
title: Insert an inline list of values into a table
tags:
  - sql
  - mssql
language: sql
variables:
---

```bash
INSERT INTO [dbo].[Email_Category_Options]
([Category]) 
VALUES 
('APP PERFORMANCE'), 
('CPU UTILIZATION'), 
('DESIGN'), 
('DPI_MOUSE'), 
('FAN')
```