---
layout: post
title: Exclude parameter from Parameter Binding in WebAPI
description: How to prevent a parameter in a WebAPI action from being bound from the body or query string.
category: programming
tags:
  - dotnet
  - csharp
  - webapi
---

Lately I've been working on some WebAPI code with ActionFilters that inject parameters into the WebAPI action. For example, we authenticate via a JSON Web Token passed in a cookie, so one ActionFilter decodes and verifies the token. Since we need access to the properties in that token from our action, the ActionFilter injects the token into the method if a parameter of that interface type is available.

```csharp
	[AuthenticateFromToken]  // This filter creates an instance of IAuthToken
							 // and stores it in the `token` parameter
    public string GetSomeRequest(string param1, string param2, IAuthToken token)
	{
		return token.Username;
	}
```
	
Is this approach better than storing it in a property on the class? Or is it better to use an HttpRequestHandler instead of an ActionFilter? Maybe not, you have a lot of options in WebAPI. However, it works perfectly for our needs.

On the way, we ran into one big issue: since these parameters are complex types, WebAPI attempts to perform parameter binding on them! We didn't even notice at first. By default, complex types are bound from the Body of the request rather than the query string, but because we use GET requests, there's obviously no body to bind. We only saw an error once we introduced two of these injected parameters to a single action:

    Can't bind multiple parameters ('authClaims' and 'metricsBuilder') to the request's content.

Well, we don't really care whether or not binding happens because we supply our own value, so what happens if we make them optional parameters and force WebAPI to bind from the Uri? If no one sends `token=blah` in the query string, nothing will even *attempt* to bind.

```csharp
    [AuthenticateFromToken]
    public string GetSomeRequest(string param1, 
	    [FromUri]IAuthToken token = null, 
		[FromUri]MetricsBuilder metricsBuilder = null)
	{
		return token.Username;
	}
```

Except that doesn't work either:

    Cannot create an instance of an interface.
	
That could be solved by making the `IAuthToken` interface into a class, but really we don't want binding to happen *at all*. The solution is to create your own ParameterBindingAttribute that does absolutely nothing. WebAPI will call it to bind your parameter and despite doing nothing, WebAPI will mark the parameter as "bound" and continue on its merry way.

```csharp
   [AttributeUsage(AttributeTargets.Parameter, AllowMultiple = false)]
	public class ExcludeFromBindingAttribute : ParameterBindingAttribute
	{
		public override HttpParameterBinding GetBinding(HttpParameterDescriptor parameter)
		{
			return new NullParameterBinding(parameter);
		}
		
		public class NullParameterBinding : HttpParameterBinding
		{
			public NullParameterBinding(HttpParameterDescriptor parameter)
				: base(parameter)
			{
			}

			public override Task ExecuteBindingAsync(ModelMetadataProvider metadataProvider, 
			    HttpActionContext actionContext, CancellationToken cancellationToken)
			{
				return Task.Delay(0, cancellationToken);
			}
		}
	}
```

This can be used in a similar way to `FromUriAttribute` above. `Task.Delay(0)` is defined to return an already-completed task (I checked) so it does the same as `Task.FromResult` with a dummy value but works on older versions of the .Net framework.

```csharp
    [AuthenticateFromToken]
    public string GetSomeRequest(string param1, 
	    [ExcludeFromBinding]IAuthToken token, 
		[ExcludeFromBinding]MetricsBuilder metricsBuilder)
	{
		return token.Username;
	}
```
