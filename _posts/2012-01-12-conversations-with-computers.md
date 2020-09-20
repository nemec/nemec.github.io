---
layout: post
title: Conversations With Computers
description: Using generators to make a simple state machine that accepts input and produces output on each state change.
category: programming
tags:
  - python
  - nlp
---

Conversations with Computers or: How I Learned to Stop Worrying and Love the Generator
======================================================================================


One of the features I'd put off developing for [Automaton](https://github.com/nemec/Automaton) is being able to hold
  "conversations" with a service. Because services were defined as functions
  they took in your input and returned output back to you. If you didn't
  provide enough information, the service terminated with an
  UnsuccessfulExecution exception and you had to try again. From the beginning.
  If the input given was `Give me directions to Canada` and the service could
  not determine your current location, it would respond with something like
  `Cannot determine your current location. Please try again.` To actually get
  directions, you would have to duplicate your request with the missing data
  added: `Give me directions from North Dakota to Canada`.

It would be 1000x better if instead the service said "I could not determine
  your location, where do you want to start from?", letting me reply with
  "North Dakota" to get my directions. Unfortunately, this is a networked
  application - the client I send my requests to talks to the server holding
  this conversation with me. How do I manage a conversation when the connection
  can drop at any moment? Further, the "entry point" that my client talks to
  is the *exact* same that another simultaneous client is using - one of the
  pitfalls of the non-threadsafe Thrift server I'm developing with.

For a moment, I considered using classes for the services instead of functions
  so I could take advantage of state, but the Plugin that hosts services is
  already a class and I didn't want tons of nested classes. Plus, classes 
  that conform to whatever conversation interface I'd cook up would add a
  *lot* of boilerplate for plugin developers, especially if they didn't want
  to take advantage of this new feature. Luckily, I stumbled upon
  [this](http://www.python.org/dev/peps/pep-0342/) beautiful piece of work in
  the Python PEPs. If you're not familiar, PEPs are very well-written proposals
  for new features to Python. Most, if not all of the new features Python gains
  are part of one of these specifications. If you're interested in finding new
  cool ways to use Python, I highly recommend you browse the
  [list](http://www.python.org/dev/peps/) for interesting titles. This PEP,
  in particular, proposes a syntax for turning Python functions (subroutines)
  into *co*routines, subroutines with multiple entry points (as opposed to
  regular functions always beginning execution at the "top" of the function).
  This isn't supposed to be an introduction to generators, so if you're
  unfamiliar with them I will instead point you toward
  [two](https://web.archive.org/web/20170423181122/http://www.prasannatech.net/2009/07/introduction-python-generators.html)
  [great](http://wiki.python.org/moin/Generators) tutorials on them if you need
  to brush up - go ahead, this page won't expire by the time you get back.

The key to conversations here is the ability to send values into generators
  through `generator.send(value)`. Here's an example:
  
```python
def generator():
  response = yield
  for count in range(5):
    response = yield "I got " + str(response)
  
gen = generator()
gen.next()  # This starts the generator, now we can send values in.
count = 0
try:
  while True:  # Keep sending things until the generator gets tired
    print gen.send("something new " + str(count))
    count = count + 1
except StopIteration:
pass # The Generator is finished.
```

Now that we can give our services extra input while they're in the middle of
  execution, let's have an actual conversation with our computer:

```python
def ask_about_weather():
  response = (yield "Hey! How is the weather today?")

  if "cold" in response:
    yield "You should get a jacket."
  elif "warm" in response:
    response = yield "Isn't this weather awesome?"
    yield "Lets go outside."
  elif "hot" in response:
    yield "You should go to the beach!"
  else:
    yield "Keep on topic!"

if __name__ == "__main__":
  try:
    gen = ask_about_weather()
    print gen.next()
    while True:
      inp = raw_input("> ")
      print gen.send(inp)
  except StopIteration:
    pass
```

Here we have a reversal of the intended conversation roles. When this script is
  run, the computer asks "How is the weather?". When you type something into
  raw_input, it gets sent into the generator and the computer has different
  responses depending on whether or not you typed the words "cold", "hot",
  or "warm". If you type "warm", the computer asks a second question and you're
  given a second chance to respond. Run through a conversation and you'll
  notice that after the conversation comes to an end, control will wrap around
  to the `raw_input` function one more time. You're forced to hit enter and
  then... the program ends. If the last `yield` statement in each branch was
  assigned to anything, that last raw_input value would be assigned, but
  control passes to the end of the function (and an implied `return`) and a
  StopIteration exception is raised. All generators and iterators will raise
  that exception when they finish but for loops silently catch them and exit
  the loop so you may never have run into them before. Try it:

```python
>>> i = iter(range(0))
>>> i.next()
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
StopIteration
```

I managed to find two solutions to this problem (though there are probably
  more - Pythonistas are a creative bunch). The first is kind of a hack.
  Generators are not allowed to pass anything to `return` because immediately
  after the StopIteration exception is thrown. Following that line of thought,
  I replaced all `return`s with manual throws of StopIteration, passing the
  final message as an argument.

```python
def ask_about_weather():
  response = (yield "Hey! How is the weather today?")
  response = yield "Isn't this weather awesome?"
  raise StopIteration("Lets go outside.")

if __name__ == "__main__":
  try:
    gen = ask_about_weather()
    print gen.next()
    while True:
      inp = raw_input("> ")
      print gen.send(inp)
  except StopIteration as err:
    print err
```

I'm not too keen on abusing `raise` to return a value instead of the normal
  process of automatically raising StopIteration when control leaves the
  function, but it _does_ work. My second solution takes advantage of the fact
  that the next input to the computer is going to be a _new_ conversation.
  That "final" raw_input then becomes the new first input to the next
  conversation. Below is an implementation similar to what I ended up using
  in my program:

```python
def directions(arg):
  arg = arg.split()
  to = None
  frm = None
  if "to" in arg:  # Populate "to" and "frm" if given
    to = arg[arg.find("to") + 1]
  if "from" in arg:
    frm = arg[arg.find("from") + 1]
  if to is None:  # Ask for more info if necessary
    to = yield "Where do you want to go to?"
  if frm is None:
    frm = yield "Where are you coming from?"
  # Present final output
  yield ("Why do you want to go to " + str(to) +
        " when you are already in " + str(frm) + "?")

def weather(arg):
  arg = arg.split()
  location = None
  if "in" in arg:
    location = arg[arg.find("in") + 1]
  if location is None:
    location = yield "Where do you want weather for?"
  yield "The weather for %s is terrible." % str(location)

if __name__ == "__main__":
  current_conversation = None
  while True:
    inp = raw_input("> ")
    if current_conversation is not None:
      try:
        print current_conversation.send(inp)
      except StopIteration:
        current_conversation = None
    # Note no elif - when StopIteration happens, we
    # fall through and start a new conversation with inp
    if current_conversation is None:
      if "directions" in inp:  # Choose which service to use
        current_conversation = directions(inp)
      elif "weather" in inp:
        current_conversation = weather(inp)
      else:
        break
      print current_conversation.next()  # Go to first "yield" statement
```

Both `directions` and `weather` are pretty much the same thing for differing
  numbers of "arguments". If there is missing information, one of the 
  conditional `yield` statements is executed, otherwise the final output is
  printed. After the final output is printed, the next input is used to start
  an entirely new conversation.

```
> I want the weather.
Where do you want weather for?
> Kansas
The weather for Kansas is terrible.
> Give me directions to Canada.
Where are you coming from?
> America
Why do you want to go to Canada when you are already in America?
```

Of course, you'll notice that you can only hold one conversation at a time.
  That's fine for this application, but what about in a networked environment
  with multiple connected users? Make each user either register or create their
  own ID, then send that along with every message, then change
  `current_conversation` to a dictionary with the ID as the key. And that's
  it, you can now talk to computers! Watch out for weird stares.
