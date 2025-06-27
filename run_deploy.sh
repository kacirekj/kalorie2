#!/bin/bash

project_name="kalorie"
remote_server="app@ssh.rosti.cz"
target_folder="/srv/app"
port=12339

rsync -arv -v -e "ssh -p $port" --exclude .git --exclude .idea --exclude .next --exclude node_modules ../$project_name $remote_server:$target_folder