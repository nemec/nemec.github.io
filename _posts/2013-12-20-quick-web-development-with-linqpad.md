---
layout: post
title: Quick Development Web Server With LINQPad and WebApi Attribute Routing
tags:
  - dotnet
  - csharp
  - linqpad
---

When writing an HTTP client application, you often need to test unusual server 
responses that, while in a known format, require you to twist some knobs to 
force a strange response. Maybe it requires you to register an account on the 
server and submit various content requests, all of which may take some time if 
the server you're using requires explicit approval or is processed every X 
hours. Instead, let's serve up canned responses to the requests you'll be 
generating!

My first instinct would be to create a folder representing the path you want, drop some html/json/xml files in, and power up Python's [SimpleHTTPServer](http://www.linuxjournal.com/content/tech-tip-really-simple-http-server-python) then point your app to `http://localhost:8080` instead of your normal development server. While this works for simple cases, there are three major downsides to this approach:

* Static pages only. If you want to test a range of URLs that fit a pattern or debug/validate the query string sent by your application, it's not simple to do without creating tons of duplicate files or trawling through the console log for the request URL.
* Complex URLs are a pain. To check http://someserver.com/some/complex/path/20283 you need to create a nested directory structure and an index.html just for a single request.
* Only responds to GET requests. This complaint is specific to `SimpleHTTPServer`: other servers may respond to any HTTP verb, but it's rare that any API-consuming application is limited to just GET requests.
* To overcome these hurdles, we can turn to the fantastic .Net scratchpad [LINQPad](http://www.linqpad.net/). It's a free program that lets you execute C#/VB statements and make requests to SQL servers, LINQ-to-SQL style. In addition, we'll load up with self-hosted ASP.Net WebApi and Attribute Routing to give us almost infinite flexibility in how we define our responses.

Dependencies
------------

Once you have LINQPad installed and open, we need to set up our dependencies. I have the Premium version which comes with NuGet integration, but the required DLLs can be downloaded elsewhere and referenced explicitly if you're using the free version.

Now press F4 and add the following references:

* Microsoft.AspNet.WebApi.OwinSelfHost
* AttributeRouting.WebApi.Hosted
* System.Net.Http.dll
* System.Windows.Forms.dll (if you want a quick "stop server" button)

And the following namespace imports:

* AttributeRouting
* Microsoft.Owin.Hosting
* Owin
* System.Net.Http
* System.Web.Http
* System.Web.Http.Controllers
* System.Web.Http.Dispatcher
* System.Web.Http.SelfHost
* System.Windows.Forms
* System.Net
  
Setup
-----
  
Now change your snippet's Language to `C# Program`, which will allow us to define our own methods and classes to setup WebApi.

First bit of code you can straight copy-paste into the panel. Since LINQPad generates your defined classes nested within its own UserQuery class, WebApi's default ControllerTypeResolver cannot find our controller. This class will reset the resolver so that it can find our code. Major thanks to [StrathWeb](http://www.strathweb.com/2013/04/hosting-asp-net-web-api-in-linqpad/) for the tip.

```csharp
public class ControllerResolver : DefaultHttpControllerTypeResolver 
{
	public override ICollection<Type> GetControllerTypes(IAssembliesResolver assembliesResolver) 
	{
		var types = Assembly.GetExecutingAssembly().GetExportedTypes();
		return types.Where(i => typeof(IHttpController).IsAssignableFrom(i)).ToList();          
	}
}
```
	
Now, we can define a "startup" class responsible for configuring WebApi. Note that we replace the original controller resolver here and map our (future) attribute routes here.

```csharp
public class Startup
{
	public void Configuration(IAppBuilder appBuilder)
	{
		var config = new HttpConfiguration();

		// LINQPad generates nested classes, not
		// detectable by default resolver.
		config.Services.Replace(
			typeof(IHttpControllerTypeResolver), 
			new ControllerResolver());

		config.MapHttpAttributeRoutes();
		appBuilder.UseWebApi(config);
	}
}
```
	
Here's our `Main` function which will be responsible for starting and tearing down our self-hosted server. One really neat feature of LINQPad is that it doesn't necessarily tear down your process once the script is done. You can [inject UI controls](http://www.linqpad.net/customvisualizers.aspx) into the output panel to allow interactive execution of your scripts. We'll be using a Button to give us control over when our web server shuts down.

```csharp
void Main()
{
	var baseAddress = "http://localhost:8080";
	var app = WebApp.Start&lt;Startup&gt;(baseAddress);

	var button = new Button { Text = "Click to stop server." };
	var panel= PanelManager.DisplayControl(button, "Webserver");

	button.Click += (o, e) =&gt;
	{
		app.Dispose();
		panel.Close();
	};
}
```

The Fun
-------

Now for the meat of the script, our **ApiController!** Let's say, for example, that we are making two HTTP calls:

* One POST request to `/some/complex/path/123?cc=no` where `123` is variable and the `cc` value tells us that our country is Norway. It will return a basic static HTML file.
* A GET request to `/some/other/path` that will return a `500` error simulating catastrophic failure on the server.

Under normal WebApi, these nested paths would probably require some complex route configuration, but with the new Attribute Routing it's all handled automagically based on the route we define for our Action method. Here's what our controller will look like:

```csharp
public class MainController : ApiController
{
	[Route("some/complex/path/{id}")]
	// WebApi parameter binding will turn {id} in the path into an argument and
	// pull 'lc' and 'cc' from the query string (with default values) automatically.
	public HttpResponseMessage Post(string id, string lc = "en", string cc = "us")
	{
		// Print some debug data during the request.
		// Will appear in Results panel.
		(lc + "-" + cc).Dump();
		return StaticFile("c:/users/dan/somedoc.html");
	}

	[Route("some/other/path")]
	// Note that, using WebApi, defining the HTTP Verb used for a particular
	// action is based on the name of the method.
	public string Get()
	{
		throw new HttpResponseException(HttpStatusCode.InternalServerError);
	}
}
```

To finish things up here's the implementation of `StaticFile`, a method that reads a file from disk and returns it as HTML:

```csharp
private static HttpResponseMessage StaticFile(
	string localFilename, string contentType = "text/html")
{
	if(File.Exists(localFilename))
	{
		return new HttpResponseMessage(HttpStatusCode.OK)
		{
			Content = new StringContent(
					File.ReadAllText(localFilename),
				Encoding.UTF8, contentType)
		};
	}
	else
	{
		return new HttpResponseMessage(HttpStatusCode.NotFound)
		{
			Content = new StringContent("File " + localFilename + " does not exist.")
		};
	}
}
```

Now click the Run button and try it out! Take a look at the nice, big button that you can click when you're ready to turn off the web server:

![Stop Button](http://i.imgur.com/4iuTuVt.png)

You can save this whole snippet as a Query or a Sample and modify the Controller to return whatever data your heart desires next time you need it for testing.

Bonus: Iterator blocks
-----

Now, in the course of making requests, you might need to perform some "state change" between requests to a single route so that your first request returns one value and the second returns a different once (to reflect outside database updates or some similar situation). Instead of messing around with static fields (remember, `ApiController` instances are per-request) and state machines, let a couple of helper methods do it for you! Here's a sample method that will return three different values:

```csharp
private static IEnumerable<string> PrivMultipleRequests()
{
	yield return "first";
	yield return "second";
	yield return "third";
}
```

And the route? Here's where the magic comes in:

```csharp
[Route("multi/reqs")]
public string GetMultipleRequests()
{
	return Multiple<string>.Next(PrivMultipleRequests);
}
```

The static `Multiple` class caches your first call to `Next` from the `GetMultipleRequests` method and makes sure the Enumerator is advanced with each call. If you try to make a fourth GET request to `/multi/reqs` an exception will be thrown (although you could always add an infinite loop of some sort at the end of your iterator block if you want to return a default value instead). Here's how `Multiple` works:

```csharp
private static class Multiple<T>
{
    private static Dictionary<string, IEnumerator<T>> _iters = new Dictionary<string, IEnumerator<T>>();
    
    public static T Next(Func<IEnumerable<T>> init, string uniqueKey = null)
    {
        var callingMethod = new StackTrace().GetFrame(1).GetMethod();
        if(uniqueKey == null)
        {
            // Magic to uniquely identify a specific method called from a specific function.
            // This way, you can pass the same delegate in from different routes and get
            // a new enumerator each time.
            uniqueKey = callingMethod.DeclaringType.FullName + "." + 
                        callingMethod.Name;
        }
        var key = uniqueKey + ":" +
                  init.Method.DeclaringType + "." +
                  init.Method.Name;
        IEnumerator<T> enm;
        if(!_iters.TryGetValue(key, out enm))
        {
            _iters[key] = enm = init().GetEnumerator();
        }
        if(enm.MoveNext())
        {
            return enm.Current;
        }
        throw new InvalidOperationException(String.Format(
            "Too many calls to resource {0} from {1}", init.Method.Name, callingMethod.DeclaringType));
    }
}
```