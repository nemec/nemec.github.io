---
layout: post
title: Build 2014
tags:
  - dotnet
  - csharp
  - roslyn
  - azure
  - build2014
---

\* Note: these are my personal thoughts on the conference. Statements may be
  paraphrased and do not necessarily represent the opinions of Microsoft or
  my employer.

There were three main focuses of the conference this year. The first, which
probably had the furthest reach of any of the topics, is Windows Azure. Between
a new facelift and multiple new libraries developed to use the platform, it
seems to be a core focus for Microsoft in the new world of "cloud this" and
"mobile that". Paired with this is a new set of project templates: [Mobile
Services for Windows Phone](http://azure.microsoft.com/en-us/documentation/articles/mobile-services-windows-phone-get-started/).
These make it easier to build Azure services that interface with Windows Phone
apps in .Net or Javascript (Node.js). Further, Microsoft announced a consolidated
platform for building applications for the Windows store: Universal Windows
Store Apps. With these, you can write one application and build it simultaneously
for Desktop, Phone, and Xbox. You'll likely want to customize the UI for each
individual platform, but everything else (logic, utilities, etc.) can be referenced
from a common project. I don't do any mobile development, so I'm not sure why
this wasn't possible before, but even if it's just some tooling support it's
a great step in the right direction.

The Story of A Driver
---------------------

One of the most entertaining stories came during the first day's keynote. 
David Treadwell spun a tale about the file origin of afd.sys: the Ancillary
Function Driver. When he began writing the Windows socket framework his boss
pleaded with him to write it without introducing one more driver into the system.
I guess that's because driver bugs are far more dangerous and damaging than most
because they're run in kernel-mode rather than user-mode.

Anyway, he went about writing the framework and after much deliberation, there
was no way to make sockets behave as system handles without a driver. After he
delivered the bad news, his boss slammed his fist on the table and yelled
out, "*another freaking driver?*" The name stuck with David, although he
was forced to officially rename the driver before it could be published with
Windows...

[Internet of Things](http://channel9.msdn.com/Events/Build/2014/2-511)
==================

.Net Micro Framework
--------------------

The [.Net Micro Framework](http://www.netmf.com/) is a version of .Net optimized
for small devices (typically 32-bit processor and very little RAM). It
contains a subset of the normal framework classes although I can't find any
definitive reference stating that that subset includes all Portable Class
Libraries.

Netduino
--------

The Netduino is an Arduino-compatible board that runs the .Net framework. As
far as I can tell it runs on Windows Compact Embedded, which isn't the most
up-to-date OS, but you can run *some* version of .Net on it.

In all respects, though, it's compatible with a normal, Linux-based Arduino which
means you can connect all sorts of shields to it and interact with the pins
using C# code.

One cool demo that the speaker showed was a traffic light connected to a
Netduino. He wrote a phone app that connected to the Netduino via Bluetooth and
turned each light on/off through a relay.

Galileo and Quark System-on-Chip
--------------------------------

Quark is an attempt to bring a fuller Windows experience to embedded devices.
It's a tiny 32-bit processor that's attached to Galileo's development board.
[The board itself](http://www.intel.com/content/www/us/en/do-it-yourself/galileo-maker-quark-board.html)
is compatible with Arduino shields but seems to rival the Raspberry Pi more
than the Arduino itself.

In addition to the Open Source efforts revealed here at Build, Microsoft is
releasing the Windows operating system for *FREE* use on embedded devices (like
Galileo) and handhelds < 9" in screen size.

Azure
=================

New Portal
----------

Azure has a new, beautiful web portal in preview. I cannot find any screenshots
online, but it contains a customizable dashboard with the ability to drill down
into more detail. In true modern Windows fashion, drilling down opens up a
vertical pane containing the requested information off to the right of the
dashboard, requiring you to scroll horizontally to inspect the details and
potentially drill down even further.

[Azure Service Bus](http://channel9.msdn.com/Events/Build/2014/3-635)
-----------------

Azure Service Bus is an infrastructure atop Azure that provides a way to
connect your applications to devices and push notifications between them.

Because Azure servers sit in between your applications and client devices, many 
issues in other setups (like P2P networks) are avoided:
  * Client devices behind firewalls and NAT routers connect via
    polling/long polling/websockets and thus don't need any inbound connections.
  * Since it uses the HTTP protocol, any device that can talk HTTP can interact
    with the ASB.
  * Azure servers can be scaled up or down depending on how many clients are
    connected.

In the ASB, each device has a unique Inbox and Outbox of messages. Messages are
tagged with specific topics to aid with routing and devices can subscribe to
those topics to filter out unimportant messages.

In order to deal with asynchronous requests and replies in an HTTP world,
messages are tagged with a "relates-to" property linking one message to the ID
of another. 

[Project Orleans](http://channel9.msdn.com/Events/Build/2014/3-641)
---------------

Project Orleans is a product that came out of the Research Arm of Microsoft as
a way to scale enormous object graphs for things like Social Networks and Gaming.
Among other things, I was impressed with how easy it seemed to use. The grains,
or actors, are plain C# classes and represent the data model of your graph.
When a grain with a specific ID is requested, it's either returned from an existing
pool or created automatically (and seeded via database, I assume) and then
used for all further requests for that ID. Since Orleans handles the activation
of grains automatically, the client application can ask for any grain whether
or not it's activated and sitting on a server.

To simplify things, thread safety is maintained by forcing a grain to be accessed
by only one thread at a time. Hoop (the speaker) explained away questions of
performance by saying that grain access is async-enabled, but I'm not entirely
sure that async automatically solves the problem. Sure it makes the code
handler rather simple, but as far as performance goes you'll still have to wait
for all pending grain requests to finish before the next one is run. Still,
I'm playing around with Unity game development in my spare time and the model
projected by Orleans seems like just the thing to use when building a multiplayer
online game. I'm looking forward to investigating this project further in the
future.

[The Future of C#](http://channel9.msdn.com/Events/Build/2014/2-577)
================

Dustin Campbell and Mads Torgersen revealed some
of the features in the pipeline for the next version of C#. Actually, since the
next version of VS and C# will be powered by Roslyn you can install the
[End User Preview](http://roslyn.codeplex.com/) and start compiling
code with those features now! Not recommended for production code, but it's
great that we can get a taste of what's coming.

- Static Imports
- Primary Constructor
- Autoproperty constructor
- get-only Autoproperty
- Accessibility on primary constructor
- dict initializer
- dict access $x
- declaration expressions
- await in catch/finally
- exception filters

-> distribute a VSIX containing code style requirements for entire team

Not Yet Implemented
--------

- Method expressions


[Future of .Net in a World of Devices and Services](http://channel9.msdn.com/Events/Build/2014/2-588)
=================================================

- [RyuJit](http://blogs.msdn.com/b/dotnet/archive/2013/09/30/ryujit-the-next-generation-jit-compiler.aspx)
  - RyuJit is .Net's next-generation JIT compiler to pair with their new C#/VB compiler, Roslyn.
    Once your code is compiled to .Net bytecode (CIL), the JIT compiler performs some further
    optimizations at runtime to speed up startup time and efficiency. Since everything
    is done at runtime, it can make platform-specific choices that the more cross platform
    CLR cannot.
  - This is especially helpful for less powerful devices like phones since you
    can write code to span every phone's processor while performing extra
    optimizations for specific processors when needed.
- SIMD: Single Instruction, Multiple Data
  - A form of parallelism that uses a single CPU instruction to perform the
    same work on multiple sets of data at the same time.
  - At a high level, think of it like a method that takes a list of objects and
    performs the same processing on each object in parallel. You can't customize
    *how* each object is processed, but you only need to call the method once.
- Roslyn
  - The official .Net compiler is now written *in* .Net, so you're almost
    guaranteed that Microsoft will focus its future development efforts on
    improving the framework and its languages.
- .Net Foundation
  - Many great .Net libraries are now open sourced, which could mean a lot more
    third-party development effort into improving the community, in addition to
    the Microsoft and Xamarin employees paid to improve the code.
- Orleans
  - A highly scalable .Net based framework for working with large object graphs.
    Used in many high profile XBox games.
- .Net Native
  - Must choose architecture to compile on, since it produces native code. This
    forces you to give up the "AnyCPU" architecture, but you could still package
    one dll for each architecture into an installer if necessary.
  - Gives compiled C++ performance when possible, but still allows you to use
    managed magic like reflection (although I doubt that bit of the code will
    actually be running natively).