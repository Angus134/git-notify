#!/bin/bash

yarn install
pm2 start npm --name="hook-center" -- start