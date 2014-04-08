---
layout: post
title: Benchmarking C# Code
tags:
  - dotnet
  - csharp
  - benchmark
---

When designing a file upload service, it's usually a good idea to reject content
larger than some maximum file size to reduce abuse of your server resources.
With ASP.Net WebAPI, that's harder than it looks. By default, the entire file is
buffered to memory (or disk, if > 250kb) before passing on to the rest of
your controller which, if someone attempts to submit a large file, could
potentially fill up the available space before being canceled. Clearly we
need to intercept the stream at its source and kill the connection as soon as
we read more than **X** bytes.

Per the HTTP spec, file uploads are handled via the "multipart" content type.
In WebAPI, you have three [options](http://msdn.microsoft.com/en-us/library/system.net.http.multipartstreamprovider(v=vs.118).aspx):
MultipartFileStreamProvider, MultipartmemoryStreamProvider, and 
MultipartRelatedStreamProvider. *Related* is for cases when you're uploading
multiple different types of files at once (such as html and jpg) and TBH I'm
not entirely sure how it's related to the other two which specify storage
mediums: *File* and *Memory*.

Since my max file size will be 256kb and I'm uploading from a WebClient (rather
than an HTML form), I'll be sticking with the MemoryProvider as a base. So what
is this 