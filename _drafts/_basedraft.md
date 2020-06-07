---
layout: post
title: Tips for bulk inserts in Entity Framework
description: Some description
category: infosec
tags:
  - dotnet
  - csharp
  - entityframework
headerImage: 2020/05/port-scan-header.png
headerImageAttrib: image credit - bitninja.io
---


* Not recommended, but possible.
* Save in batches
* Refresh the context
* AutoDetectChangesEnabled = false