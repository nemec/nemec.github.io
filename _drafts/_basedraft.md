---
layout: post
title: Tips for bulk inserts in Entity Framework
description: Some description
# categories can be found in _data/categories.yml
category: infosec
tags:
  - dotnet
  - csharp
  - entityframework
headerImage: 2020/05/port-scan-header.png
headerImageAttrib: image credit - bitninja.io
#editNotes:
#  - Edited 2021-01-01 for clarity
---


* Not recommended, but possible.
* Save in batches
* Refresh the context
* AutoDetectChangesEnabled = false

![alt text](/images/2020/05/some-image.png)