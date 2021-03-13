---
layout: snippet
title: SQL Server Analysis Services show last cube processed date
description: Display the last processed date for all cubes in SSAS
tags:
  - ssas
  - analysis-services
language: dmx
variables:
---

```plaintext
SELECT [CATALOG_NAME], CUBE_NAME, LAST_DATA_UPDATE
FROM $System.MDSCHEMA_CUBES
--WHERE LEFT([CUBE_NAME],1) <>'$'
ORDER BY last_data_update DESC
```
