#!/bin/bash

yarn install
pm2 start npm --name="git-notify" -- start