#! /bin/bash

if [ "$(uname -s)" = "Darwin" ]; then
    open -n -a /Applications/Google\ Chrome.app --args --disable-web-security --user-data-dir="/tmp/google-chrome"
else
    echo "Right now this script works only on MacOS" 
fi