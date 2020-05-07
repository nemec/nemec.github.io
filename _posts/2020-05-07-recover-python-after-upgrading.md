---
layout: post
title: Recover Python Virtualenvs After Upgrading
description: How to move your Python environment to a new version of the
             language if you forgot to keep a requirements file up to date
category: programming
tags:
  - python
headerImage: 2020/05/pylogo.png
headerImageAttrib: www.python.org
---

*Note: If you're pretty familiar with this issue, skip straight to [the solution](#the-juicy-details)*

# Intro

This will be a quick post about how to solve an issue that's been bugging me
the past couple of weeks since I upgraded to Ubuntu 20.04, which replaced my old
Python version with 3.8.

On my PC I have a folder full of Python projects I've created, going back years.
I try to keep dependencies isolated with virtualenvs, however one thing I
consistently forget to do is "freeze" the dependencies I use for each project
into a `requirements.txt` file.

I won't go into a lot of detail on how virtualenvs work (see
[this post](https://chriswarrick.com/blog/2018/09/04/python-virtual-environments/)
which covers how to use them), but essentially, the requirements file is a portable
list of your Python package dependencies and includes the version numbers used
in your project. When saved to a file, this is often checked in to source control
instead of the environment itself since the environment directory often contains
platform-specific binaries and things that may not work properly on someone else's
PC (like links to the directory where *you* have installed Python).

In any case, when you've upgraded your Python version and "source" the environment,
you might not notice any issues at first. You get the right prefix in your shell
and your `python` command links to the environment Python, as expected:

    (env) user@PC:~/prg/py/elasticslurp$ which python
    /home/user/prg/py/elasticslurp/env/bin/python

However, when you try to run a program that uses those packages, it doesn't work :(

```
(env) user@PC:~/prg/py/elasticslurp$ python main.py --help
Traceback (most recent call last):
  File "main.py", line 2, in <module>
    from shodan import Shodan, APIError
ModuleNotFoundError: No module named 'shodan'
```

Oops. The problem is that each virtualenv is set up for a specific major and minor
version of Python (e.g. 3.6) and will not necessarily support the latest version
(e.g. 3.8). If you run into this issue, you won't even be able to freeze the
dependencies because some critical files are missing:

```
(env) user@PC:~/prg/py/elasticslurp$ pip freeze
Traceback (most recent call last):
  File "/home/user/prg/py/elasticslurp/env/bin/pip", line 7, in <module>
    from pip import main
ModuleNotFoundError: No module named 'pip'
```

Let's look at the make up of our environment directory and see if we can spot an
issue:

```
$ tree -L 2 env/
env/
├── bin
│   ├── activate
│   ├── activate.csh
│   ├── activate.fish
│   ├── bitmath
│   ├── chardetect
│   ├── easy_install
│   ├── easy_install-3.6
│   ├── f2py
│   ├── f2py3
│   ├── f2py3.6
│   ├── pip
│   ├── pip3
│   ├── pip3.6
│   ├── __pycache__
│   ├── python -> python3
│   ├── python3 -> /usr/bin/python3
│   ├── shodan
│   ├── vba_extract.py
│   └── wheel
├── include
├── lib
│   └── python3.6  # <-- suspicious
├── lib64 -> lib
├── pyvenv.cfg
└── share
    └── python-wheels
```

There are certainly a lot of files labeled after the old version of Python. I've
called out one folder in particular, which is the environment's `site-packages`
directory, containing a copy of all libraries you've installed. This is what
we need to change.

# The Juicy Details

So fixing this issue enough to recover your installed libraries is pretty simple:
rename the old lib folder to match your own Python version, e.g.:

    $ mv env/lib/python3.6/ env/lib/python3.8

Now freeze your dependencies to a file:

    $ pip freeze > requirements.txt

Quickly check your requirements file and ensure it looks correct - I have not yet
run into problems with this, but I haven't thoroughly tested edge cases. Next,
throw away the old environment and create a new one with your current Python version:

    $ deactivate  # this closes all shell references to the Python virtualenv
    $ rm -r env/
    $ python3 -m venv env

And finally, load your libraries:

    $ source env/bin/activate
    $ pip install -r requirements.txt

After this, your programs should work again.