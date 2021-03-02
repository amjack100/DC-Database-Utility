import os
from os.path import exists
from flask import render_template, request, Response
import flask
import time
import subprocess
import requests
import logging
import traceback
import sys

from jinja2 import (
    Template,
    Environment,
    PackageLoader,
    select_autoescape,
    FileSystemLoader,
)

os.chdir(os.path.split(__file__)[0])


loader = FileSystemLoader("../server-side/application/templates/")

env = Environment(loader=loader, autoescape=select_autoescape(["html", "xml"]))

_basic_list_item = env.get_template("_basic_list_item.html")
_empty_button = env.get_template("_empty_button.html")
_empty_list_item = env.get_template("_empty_list_item.html")
_top_level_dir_button = env.get_template("_top_level_dir_button.html")
_top_level_dir = env.get_template("_top_level_dir.html")
_top_level_file = env.get_template("_top_level_file.html")
_top_level_items_wrap_open = Template('<ul class="m-4 collapse" id="{{ name }}">')

directory = r"C:\Users\Andrew\Dropbox\Dump"
prnumber = 20200091
prname = "Test project"


def traverse():
    def inner(dir, depth=0):

        top_level = False

        # Additional data to return to server via html

        if depth == 0:

            yield f'<div id="embedded-data" directory="{directory}" name="{prname}" number="{prnumber}" style="display:hidden;"></div>'

            for x in os.scandir(dir):

                if x.is_dir():
                    if len(list(os.scandir(x.path))) == 0:  # directory is empty
                        yield _empty_button.render(path=x.path, name=x.name)
                    else:
                        yield _top_level_dir_button.render(path=x.path, name=x.name)

                    top_level = True

        if depth == 1:
            yield _top_level_items_wrap_open.render(
                name=os.path.basename(os.path.normpath(dir))
            )

        elif depth > 1:
            yield "<ul>"

        if os.path.isdir(dir) and not os.path.islink(dir):

            for x in os.scandir(dir):

                if x.is_file() or x.is_symlink():
                    continue
                if "Newforma" in x.name:
                    continue

                if len(list(os.scandir(x.path))) == 0:
                    yield _empty_list_item.render(path=x.path, name=x.name)

                elif depth != 0:
                    yield _basic_list_item.render(path=x.path, name=x.name)

                yield from inner(x.path, depth + 1)

            yield "</ul>"

    return inner(dir=directory)


html = traverse()

with open("test-traverse.html", "w") as f:

    f.writelines(html)
