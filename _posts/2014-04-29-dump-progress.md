---
layout: post
title: Logging IEnumerable Progress
description: A LINQ extension method that executes every N (or N%) records, which is useful for displaying progress and other things.
category: programming
tags:
  - dotnet
  - csharp
  - linqpad
---

I often need to process large collections of objects and one of the most
frustrating things while I'm sitting and waiting is not knowing how many objects
have been processed. Maybe it takes a second to process an object, maybe a
minute, but without writing code to display progress (could interrupt the
flow of the code, especially in the middle of a LINQ chain) I'm stuck wondering.

Enter `DumpProgress`. I'm writing this as a LINQPad extension method, so I'm
using the "Dump" convention because the method writes to the results pane. The
method also uses `DumpContainer`, a LINQPad exclusive, so that subsequent
progress updates replace the old one on the screen&mdash;dumping progress ten
items at a time on a 1000-count list won't fill the screen with 100 print
statements.

This first method prints a progress counter every `N` items and can be easily
inserted right in the middle of a query (although unfortunately, it won't
work in Entity Framework or LinqToSQL unless the data is already pulled
into memory).

    products
      .Select(p => Identify(p.PRODUCT_OID))
      .DumpProgress(1000)
      .Where(p => p != null)
      .GroupBy(g => g.IdentifiedLevel)
      .Select(g => new {g.Key, count = g.Count()})

      
The code:

```csharp
public static IEnumerable<T> DumpProgress<T>(
  this IEnumerable<T> ths,
  long items, 
  Action<long> trigger = null,
  DumpContainer container = null)
{
  if(trigger == null)
  {
    if(container == null)
    {
      container = new DumpContainer().Dump();
    }
    trigger = i => 
    {
      container.Content = String.Format("Progress: {0} items processed.", i);
      container.Refresh();
    };
  }
  var progress = 0;
  
  foreach(var item in ths)
  {
    yield return item;
    progress++;
    if(progress % items == 0)
    {
      trigger(progress);
    }
  }
  
  if(progress % items != 0)
  {
    trigger(progress);
  }
}
```

This second method is just about the same as the first, except instead of
printing after a given number of items, it prints based on a fraction of the
total items in the collection. The fraction is a float from zero to one
representing a percent of the total number of items. Since IEnumerables are
lazily evaluated, the total number of items must be explicitly provided.

```csharp
public static IEnumerable<T> DumpProgress<T>(
  this IEnumerable<T> ths, 
  float frac, 
  long totalItems, 
  Action<long, long> trigger = null, 
  DumpContainer container = null)
{
  if(trigger == null)
  {
    if(container == null)
    {
      container = new DumpContainer().Dump();
    }
    trigger = (i, t) => 
    {
      container.Content = String.Format("Progress: {0} / {1}.", i, t);
      container.Refresh();
    };
  }
  var progress = 0L;
  var progressTrigger = (long)Math.Ceiling(frac * totalItems);
  
  foreach(var item in ths)
  {
    yield return item;
    progress++;
    if(progress % progressTrigger == 0)
    {
      trigger(progress, totalItems);
    }
  }
  
  if(progress % progressTrigger != 0)
  {
    trigger(progress, totalItems);
  }
}
```
