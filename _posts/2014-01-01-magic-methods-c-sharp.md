---
layout: post
title: Magic Methods in C#
tags:
  - dotnet
  - csharp
---

Although C# as a language has evolved tremendously since its 1.1 incarnation,
the CLR bytecode that applications are compiled to has stayed relatively
the same. New features like the `yield` keyword, lambdas, and `async` are
simply transformed into the "old" way of coding the feature (for example,
`yield` is rewritten to a switch-based state machine). Even default parameters
are implemented internally by Attributes (which is why default values are
limited to compile time constants).

A number of these new features are triggered off of what I call Magic Methods:
syntactic sugar that, in the end, is transformed into a call to a specific
method defined on the class. Since there are built in types integrated with
most of the features, a developer might never have to implement any of the
methods herself, but they're still an interesting look into the depths of C#.

Foreach Loop
------------

What's so special about the `foreach` loop, anyway? Isn't it just a thing you
call with an `IEnumerable`? Close, but not quite. The compiler actually takes
the concept "object oriented" and throws it out the window. To be the target of
a `foreach` loop, the object must follow two rules:

* Define a public method called `GetEnumerator` with no parameters.
* The return type is any type that defines a public `Current` property and
	a public method `MoveNext` that returns a boolean.

Of course, these are exactly (no more, no less) what the interfaces for 
`IEnumerable` and `IEnumerator` look like, but the interesting part is that
there is no *requirement* to use either of those interfaces. For example, this
code prints a pyramid of `.` with no interfaces in sight!

```csharp
static void Main()
{
    foreach(var i in new SomeLoop())
    {
        Console.WriteLine(i);
    }
}

public class SomeLoop
{
    public Iterator GetEnumerator()
    {
        return new Iterator();
    }
}

public class Iterator
{
    public string Current { get; set; }
    
    public Iterator()
    {
        Current = "";
    }
    
    public bool MoveNext()
    {
        if(Current.Length == 10) return false;
        
        Current += ":";
        return true;
    }
}
```

Collection Initializers
-----------------------

You've probably already seen these in action on existing collections, but
there is nothing stopping you from implementing this feature on your own
classes! I'm referring to this handy bit of syntax for initializing Lists,
arrays, Dictionaries, and various other collections:

    var c = new List<string> { "hello", "world" };

The compiler translates this into three statements, so long as the object
(`List<T>` in this case) defines an `Add` method and implements `IEnumerable`:

    var c = new List<string>();
	c.Add("hello");
	c.Add("world");

Pretty simple stuff, but there is one interesting thing you can do with it:
make `Add` a generic method. The example below "transforms" the collection
initializer inputs into a list of types:

```csharp
static void Main()
{
    var c = new Stuff
    {
        1, "hello"
    };
    foreach(var type in c)
    {
        Console.WriteLine(type);
    }
}

public class Stuff : IEnumerable
{
    private List<Type> Types = new List<Type>();
    
    public void Add<T>(T value)
    {
        Types.Add(typeof(T));
    }
    
    public IEnumerator GetEnumerator()
    {
        return Types.GetEnumerator();
    }
}
```

Prints:

    System.Int32
	System.String

Also worth noting is that the `Add` method can take multiple parameters (even
default parameters!), commonly seen when initializing Dictionaries
(`new Dictionary<string, string>{"key", "value"}`).

[Further Reading](http://msdn.microsoft.com/en-us/library/vstudio/bb384062.aspx)

LINQ Query Expressions
----------------------

That SQL-like syntax that debuted alongside LINQ works exactly like you'd
expect: it's transformed into the method syntax (`.Where().Select()` etc.)
before being compiled. I can't imagine many cases when this knowledge could
be useful, but there may be some potential when designing a "fluent interface"
to redefine the traditional LINQ operators. The following sample redefines 
`Where` to be completely random, ignoring the comparison provided.

```csharp
static void Main()
{
    var c = (from x in new[]{1, 2, 3, 4, 5}
    where x > 2
    select x);
	foreach(var m in c)
	{
		Console.WriteLine(m);
	}
}

public static class MyExtensions
{
    private static System.Random rand = new System.Random();

    public static IEnumerable<TSource> Where<TSource>( 
        this IEnumerable<TSource> source, 
        Func<TSource, bool> predicate)
    {
        foreach (TSource item in source) 
        { 
            if (rand.Next(0, 2) == 0) 
            { 
                yield return item; 
            }
        }
    }
}
```

[Further Reading](http://msmvps.com/blogs/jon_skeet/archive/2010/09/03/reimplementing-linq-to-objects-part-2-quot-where-quot.aspx)

await Anything
--------------

`await` support is triggered by a method on an object (or an extension method)
called `GetAwaiter`. That returned object needs to implement
`System.Runtime.CompilerServices.INotifyCompletion` as well as define a boolean
`IsCompleted` property plus a `GetResult` method that determines the "awaited"
return type.

In the interest of alternative approaches, here's a simple (read overly
complicated) way to turn an integer into a string, the `async` way!

```csharp
static void Main()
{
    IntToString(300);
}

// Unfortunately, the return value from an async function is strictly
// limited to void, Task, or Task<T> as far as I know, there's no way to
// magic yourself a custom type to return.
public async void IntToString(int intVal)
{
    var myNewString = await intVal;
    Console.WriteLine(myNewString);
}

public static class AwaiterExtensions
{
    public static Awaiter<int> GetAwaiter(this int val)
    {
        return new Awaiter<int>(val);
    }
}

public class Awaiter<T> : INotifyCompletion
{
    private string value;
    public Awaiter(T val)
    {
        value = val.ToString();
    }

    public bool IsCompleted { get { return true; } }
    public void OnCompleted(Action func)
    {
    }
    public string GetResult()
    {
        return value;
    }
}
```

[Further Reading](http://blogs.msdn.com/b/pfxteam/archive/2011/01/13/10115642.aspx)