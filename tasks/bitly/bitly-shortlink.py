#/usr/bin/env python

# TODO create new commit
# TODO require commit before edit

from __future__ import unicode_literals

from collections import OrderedDict
from shutil import copyfile
import subprocess
import bitly_api
import os.path
import logging
import jekyll
import sys
import os
import re


def git(args):
    args = ['git'] + args
    git = subprocess.Popen(args, stdout = subprocess.PIPE)
    details = git.stdout.read()
    details = details.decode("utf-8").strip()
    return details

def _git_config():
    raw_config = git(['config', '-l', '-z'])
    items = raw_config.split("\0")
    # remove empty items
    items = filter(lambda i: len(i) > 0, items)
    # split into key/value based on FIRST \n; allow embedded \n in values
    items = [item.partition("\n")[0:3:2] for item in items]
    return OrderedDict(items)

GIT_CONFIG = _git_config()

VERBOSE=False

def to_bool(val):
    return val is not None and val.lower() == "true"

def get_config(key, default=None, convert=None):
    val =  GIT_CONFIG.get(key, default)
    if val is not default and convert is not None:
        try:
            return convert(val)
        except Exception as e:
            if VERBOSE:
                print e
    return val
    
def get_permalink(post):
    pass

VERBOSE = get_config("shortlink.verbose", False, convert=to_bool)
SHORTLINK_NAME = get_config('shortlink.tag', "shortlink")
REQUIRE_EMPTY_TAG = get_config('shortlink.requiretag', True, convert=to_bool)
VERIFY_EXISTS = get_config('shortlink.verifyexists', True, convert=to_bool)
EXT_WHITELIST = get_config(
    'shortlink.extensionwhitelist',
    [".md", ".html", ".textile"],
    convert=lambda v: v.split(','))

BACKUP_EXT = get_config('shortlink.backupext', ".bak")
BACKUP_DIR = get_config('shortlink.backupdir', ".")

BITLY_OAUTH = get_config('shortlink.oauth')


def back_up_file(path):
    copyfile(path, path + ".bak")

def get_posts_without_link(blog):
    for post in blog.posts:
        tag_defined, link = blog.get_shortlink_defined(post)
        if (tag_defined or not REQUIRE_EMPTY_TAG) and link is None:
            yield post


if __name__ == "__main__":
    if BITLY_OAUTH is None:
        logging.error("'shortlink.oauth' git config value is not set. "
            "Cannot create shortlinks from bit.ly api without it.")
        sys.exit(1)

    root_dir = git(["rev-parse", "--show-toplevel"])

    blog = jekyll.Jekyll(SHORTLINK_NAME, root_dir, post_exts=EXT_WHITELIST)
    posts = list(get_posts_without_link(blog))
    if(not len(posts)):
        logging.debug("No posts without shortlink. Exiting.")
        sys.exit(0)
    
    permalinks = [blog.get_permalink(post) for post in posts]     
    print '\n'.join(permalinks)
    resp = raw_input("Shorten the above permalinks? [Y/n]: ")
    if resp.lower() == 'n':
        sys.exit(0)
    
    bitly = bitly_api.Connection(access_token=BITLY_OAUTH)
    for post, perma in zip(posts, permalinks):
        short_meta = bitly.shorten(perma)
        short = re.sub("^http://", "https://", short_meta['url'])
        back_up_file(blog.get_path_for_post(post))
        blog.set_shortlink(post, )
