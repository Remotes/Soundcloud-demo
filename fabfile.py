from fabric.api import *
import os

DROPBOX_DESTINATION_FOLDER = "~/Dropbox/Public/www/"


def build():
	print "Building the project ..."

	local("node ./scripts/build/r.js -o ./scripts/build/Application.build.js")
	
def deploy():
	exclude_list = [".git", ".gitignore", "fabfile.py", "fabfile.pyc", ".DS_Store"] 
	exclude_string = "--exclude '%s'" % "' --exclude '".join(exclude_list)
	
	build()

	print "Deploying to %s" % DROPBOX_DESTINATION_FOLDER

	local("rsync -av %s %s %s" % (exclude_string, os.getcwd(), DROPBOX_DESTINATION_FOLDER))