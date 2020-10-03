---
layout: snippet
title: Creating a Headless Service from a .NET Core Console App
description: Some description
tags:
  - csharp
  - dotnet
language: csharp
variables:
---

Run a console app as a headless, async service.

Sources:

* <https://garywoodfine.com/ihost-net-core-console-applications/>

```bash
dotnet add package Microsoft.Extensions.Hosting
```

```csharp
public static async Task Main(string[] args)
{
    var host = new HostBuilder()
        .Build();
 
    await host.RunAsync();
}
```