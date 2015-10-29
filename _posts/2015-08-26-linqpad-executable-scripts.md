---
layout: post
title: "LINQPad Tip: Make LINQPad scripts executable"
description: Use a custom extension to make scripts execute with lprun.exe when double clicked
tags:
  - linqpad
  - csharp
---

As a long time Linux user, I'm very comfortable at the command prompt. While
the Windows experience has benefitted greatly from the debut of Powershell,
when I need to write tools I usually turn to a language I'm comfortable in
-- on Windows, that's C#. And there's nothing better for quickly churning out
effective C# scripts than [LINQPad](http://www.linqpad.net/).

LINQPad now provides a way to execute scripts directly from the terminal,
called [lprun](https://www.linqpad.net/lprun.aspx), but it's a bit difficult
to call because 1) it's not in your [PATH](http://www.howtogeek.com/118594/how-to-edit-your-system-path-for-easy-command-line-access/)
by default and 2) the default program for executing .linq files is the
interactive LINQPad editor (and rightly so). So what does it take to enable
that sweet `$ myscript.linq with args` magic? I'm glad you asked...

## Adding a file extension association

Here's the first bit of bad news: we need a new extension. Yes, you can reset
the .linq association to call lprun instead, but more than likely you want to
keep its old behavior and open those files in the editor by default. So in this
tutorial we're going to create a new extension, .linq**r**, for LINQ Runner.

The first step is to create a script to test on. Mine is rather simple (don't
forget to set the language to `C# Program`):

```C#
void Main(string[] args)
{
	Console.WriteLine("Arguments: " + String.Join(", ", args));
}
```

Save that somewhere and give it the extension `.linqr`. You may need to rename
the file in explorer as LINQPad doesn't give you any option other than `.linq`
when saving from its UI. The easiest way to set up the association is simply to
go into the file properties and update the "Default Program", but that's only
the first step. When you set up a file association in explorer, it ignores any
additional arguments sent to it. While this *will* execute the script above,
`args` will always be an empty array.

```
$ myscript.linqr hello world
Arguments: 
```

We have to dig into the registry to fix
it. Open the application called 'regedit' and navigate to the folder
`HKEY_CLASSES_ROOT\.linqr`. Inside, you'll see an entry with the name
`(Default)`. Take the contents of the `Data` value and find the registry
key `HKEY_CLASSES_ROOT\<data>` -- in my case, `HKEY_CLASSES_ROOT\linqr_auto_file`.
Dig all the way down into the `command` folder and you'll see the Default data
contains the path to your `lprun.exe` followed by `"%1"`. That percent indicator
refers to the first argument, your script name, with quotes around it in case
your file has spaces in it. In order to add the remaining arguments, double
click the `(Default)` area and add the following to the end of the line
(including the leading space): ` %*`. Make sure *not* to put double quotes
around this one because otherwise every additional argument would be rolled
up into a single one. Now, when you execute the script with arguments they'll
be included:

```
$ myscript.linqr hello world
Arguments: hello, world
```

If you're comfortable with .reg scripts, this one will do the above automatically.
Make sure to modify the extension or path to lprun if you want to configure them.

```
Windows Registry Editor Version 5.00

[HKEY_CLASSES_ROOT\linqr_auto_file]
@=""

[HKEY_CLASSES_ROOT\linqr_auto_file\shell]

[HKEY_CLASSES_ROOT\linqr_auto_file\shell\open]

[HKEY_CLASSES_ROOT\linqr_auto_file\shell\open\command]
@="\"C:\\Program Files (x86)\\LINQPad5\\lprun.exe\" \"%1\" %*"

[HKEY_CLASSES_ROOT\.linqr]
@="linqr_auto_file"
```

## I'm a real executable!

It would be nice, in the interest of saving keystrokes, if we didn't have to type
the extension every time. EXEs get that treatment, why not our executable scripts?
All it takes is modifying the `PATHEXT` environment variable to include our extension.
These instructions are for Windows 7, but other versions will have similar steps (if 
not the exact same):

1. Right click "Computer" in the Start Menu and select "Properties"
2. Open the Advanced System Settings dialog
3. Click on the "Environment Variables" button.
4. There are two sections: one for user variables, one for system. Do *not* add a user
	variable for `PATHEXT`, otherwise it will replace your existing extensions (including
	taking away your ability to execute .EXE files, which you don't want). 	
5. Add to the `PATHEXT` system environment variable the extension `.LINQR` (separated by a
	semicolon if need be).
6. Restart your terminal and run `echo %PATHEXT%`, it should display the list of extensions
	including linqr.
7. Try it out!

```
$ myscript hello world
Arguments: hello, world
```