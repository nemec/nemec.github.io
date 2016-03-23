from __future__ import unicode_literals

import frontmatter
import datetime
import os.path
import yaml
import re

try:
    basestring  # attempt to evaluate basestring
    def isstr(s):
        return isinstance(s, basestring)
except NameError:
    def isstr(s):
        return isinstance(s, str)

class Jekyll(object):
    def __init__(self, shortlink_key, root_dir=".", post_exts=None):
        self.root_dir = root_dir
        self.shortlink_key = shortlink_key
        self.post_exts = post_exts
        
        with open(self.config_file, 'r') as f:
            self.config = yaml.load(f.read())
            

    def __join(self, fname):
        if self.root_dir == ".": return fname
        return os.path.join(self.root_dir, fname)


    @property
    def post_dir(self):
        return self.__join("_posts")


    @property
    def config_file(self):
        return self.__join("_config.yml")
    
    
    @property
    def posts(self):
        for root, dirs, files in os.walk(self.post_dir):
            for fname in files:
                base, ext = os.path.splitext(fname)
                if self.post_exts is not None and ext not in self.post_exts:
                    continue
                post = frontmatter.load(os.path.join(root, fname))
                post.filename = fname
                yield post


    def get_post(self, fname):
        post = frontmatter.load(os.path.join(self.post_dir, fname))
        post.filename = fname
        return post

    def get_path_for_post(self, post):
        return os.path.join(self.post_dir, post.filename)

    DEFAULT_PERMALINK_STYLES = {
        'date': "/:categories/:year/:month/:day/:title.html",
        'pretty': "/:categories/:year/:month/:day/:title/",
        'ordinal': "/:categories/:year/:y_day/:title.html",
        'none': "/:categories/:title.html"
    }
    
    def __sub_variables(self, post):
        # https://jekyllrb.com/docs/permalinks/#template-variables
        fname = re.match(r"""
            (?P<year>\d{4})-
            (?P<month>\d{2})-
            (?P<day>\d{2})-
            (?P<title>[^.]+)
            [.].+
        """, post.filename, re.X)

        date = post.get('date', None)
        if date is None:
            if fname is None:
                raise ValueError("Post filename must be in format 'YYYY-mm-dd-TITLE.ext'")
            date = datetime.datetime(
                int(fname.group("year")),
                int(fname.group("month")),
                int(fname.group("day")))
        if False:# date_str:
            # YYYY-MM-DD HH:MM:SS +/-TTTT
            # optional time and timezone offset
            date = re.match(r"""^
                (?P<year>\d{4})-
                (?P<month>\d{2})-
                (?P<day>\d{2})
                ([ ]
                    ((?P<hours>\d{2}:
                      ?P<minutes>\d{2}:
                      ?P<seconds>\d{2})
                        ([ ](?P<tzoffset>[+-]\d{4}))?
                    )?
                )?""", date_str, re.X)
            if not date:
                raise ValueError("Post date '{0} is incorrect format'".format(date_str))
            

        def inner(match):
            var = match.group(1)
            if var == "year":
                return str(date.year)
            elif var == "month":
                return str(date.month).rjust(2, bytes('0'))
            elif var == "i_month":
                return str(date.month)
            elif var == "day":
                return str(date.day)
            elif var == "i_day":
                return str(date.day).rjust(2, bytes('0'))
            elif var == "short_year":
                return str(date.year)[2:]
            elif var == "hour":
                return str(date.hour)
            elif var == "minute":
                return str(date.minute)
            elif var == "second":
                return str(date.second)
            elif var == "title":
                return post.get('slug', fname.group("title"))
            elif var == "slug":
                return post.get('slug', re.sub(r"\W", '-', fname.group("title")))
            elif var == "categories":
                category = post.get('category', None)
                if category is not None:
                    return category
                categories = post.get('categories', None)
                if isstr(categories):
                    categories = categories.split(',')
                return '/'.join(categories)
        
        return inner

    def get_permalink(self, post):
        p_link = self.config.get('permalink', "date")
        if 'permalink' in post.keys():
            p_link = post['permalink']
        if p_link in Jekyll.DEFAULT_PERMALINK_STYLES:
            p_link = Jekyll.DEFAULT_PERMALINK_STYLES[p_link]
        permalink = re.sub(r':(\w+)', self.__sub_variables(post), p_link)
        if not permalink.endswith('/'):
            permalink = permalink + '/'
            
        if 'baseurl' in self.config:
            base = self.config['baseurl']
            permalink = base.rstrip('/') + '/' + permalink.lstrip('/')
        if 'url' in self.config:
            url = self.config['url']
            permalink = url.rstrip('/') + '/' + permalink.lstrip('/')
        return permalink

    __no_shortlink_defined = object()
    def get_shortlink_defined(self, post):
        link = post.get(self.shortlink_key, self.__no_shortlink_defined)
        if link is self.__no_shortlink_defined:
            return (False, None)
        return (True, link)

    def set_shortlink(self, post, link):
        fname = getattr(post, 'filename', None)
        if not fname:
            return
        post[self.shortlink_key] = link
        with open(os.path.join(self.post_dir, fname), 'w') as f:
            frontmatter.dump(post, f)
