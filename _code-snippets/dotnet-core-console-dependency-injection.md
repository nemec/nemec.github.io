---
layout: snippet
title: Using Dependency Injection in .NET Core Console Apps
description: Some description
tags:
  - csharp
  - dotnet
  - dependency-injection
language: csharp
variables:
---

Use the following code to add dependency injection to a .NET Core
console app without bringing in all of ASP.NET.

Sources:

* <https://www.reddit.com/r/dotnetcore/comments/j3geeg/dependency_injection_wo_aspnet_core/>
* <https://andrewlock.net/using-dependency-injection-in-a-net-core-console-application/>

```bash
dotnet add package Microsoft.Extensions.DependencyInjection
dotnet add package Microsoft.Extensions.Logging
dotnet add package Microsoft.Extensions.Logging.Console
```

```csharp
var services =
    new ServiceCollection()
        .AddLogging(builder =>
        {
            builder.AddConsole();
        })
        .AddSingleton<IMyPreciousService, MyPreciousService>()
        .AddSingleton<SomeDependency>()
        .BuildServiceProvider();

var preciousService = services.GetService<IMyPreciousService>();

preciousService.DoStuff();
```