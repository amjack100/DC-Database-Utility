
import os

try:
    os.chdir(r'resources\app.asar.unpacked\dist\application')
except:
    # os.chdir(os.path.split(__file__)[0])
    pass

# This has to come before app = Flask(__name__)

from flask import Flask

app = Flask(__name__)

# try:
#     from sassutils.wsgi import SassMiddleware
#     app.wsgi_app = SassMiddleware(app.wsgi_app, {__name__: ("static")})
# except:
#     pass

from os.path import exists
from flask import render_template, request, Response
import flask
import time
import socket
import subprocess
import requests
import logging
import traceback
import sys
from os import scandir
from os.path import basename, normpath
from jinja2 import (
    Template,
    Environment,
    PackageLoader,
    select_autoescape,
    FileSystemLoader,
)

print("[OS.GETCWD()] %s" % os.getcwd())

TREE_TEMPLATE = "dir-tree-template.html"
   
log = logging.getLogger("werkzeug")
log.setLevel(logging.ERROR)

@app.route("/")
@app.route("/index")
def index():
    return render_template("index.html", working=True)



def stream_template(template_name, **context):
    app.update_template_context(context)
    t = app.jinja_env.get_template(template_name)
    # app.jinja_env.filters['isdir'] = os.DirEntry.is_dir()
    rv = t.stream(context)
    
    # rv.enable_buffering(5)
    return rv


@app.route("/update", methods=["GET", "POST"])
def traverse():

    request_data = request.get_json()
    print("[DIR RESPONSE STARTED] %s" % request_data)

    directory = request_data["directory"].strip()
    prnumber = request_data["number"].strip()
    prname = request_data["name"].strip()

    attempts = 0
    max_attempts = 2

    while True:
        if exists(directory):
            break

        else:
            directory = r"H:\Projects\{}".format(prnumber)
            attempts += 1

            if attempts > max_attempts:
                print("[!!FOLDER NOT LOCATED] %s" % directory)
                print("*[RUNNING AS ADMIN?]")
                raise FileNotFoundError
            else:
                print("[FOLDER LOCATED] %s" % directory)
    
    print('[STREAMING RESPONSE] %s' % TREE_TEMPLATE)
    response = Response(stream_template(TREE_TEMPLATE, scandir=scandir, basename=basename, normpath=normpath, path=directory, name=prname, number=prnumber))

    return response




@app.route("/<path:url>", methods=["GET", "POST"])
def proxy(url):
    requests_function = requests.post
    key = ""
    value = ""

    temp = flask.request.form.to_dict()

    try:
        key = list(temp.items())[0][0]
        value = list(temp.items())[0][1]
    except IndexError:
        pass

    if key == "":
        pass
    else:
        print(f"{key}={value}")

    try:
        request = requests_function(url, stream=True, params=f"{key}={value}")
        response = Response(flask.stream_with_context(request.iter_content()), content_type=request.headers["content-type"],status=request.status_code)
    except requests.exceptions.ConnectionError:
        response = Response("Connection failure", status=500)

    response.headers["Access-Control-Allow-Origin"] = "*"
    print(response)
    return response


@app.errorhandler(Exception)
def bad_database_post(error):
    


    if type(error) == requests.exceptions.ConnectionError:
        return ""
        
    if type(error) == requests.exceptions.MissingSchema:
        return ""

    print(error)
    print(type(error))

    err = f'''

    [NAME] {__name__}

    [ERROR] {error}

    [TYPE] {type(error)}

    [OS.GETCWD] {os.getcwd()}

    '''


    return Response(response=err)


a_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

location = ("127.0.0.1", 5000)
result_of_check = a_socket.connect_ex(location)

if result_of_check == 0:
    print("[!!PORT ALREADY OPEN!!]")
else:
    print("[PORT READY]")
    app.run(port=5000, host='0.0.0.0')

