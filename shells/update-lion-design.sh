
cd ../lion-design
pwd
git checkout master
git pull origin master
pm2 delete lion-design
sh deploy.sh
