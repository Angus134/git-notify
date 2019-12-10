## git-notify

### 项目简介
- 将gitLab发送的消息经过预处理，转成自己需要的格式，再发送到指定的钉钉群里。

### 软件版本要求
- nodejs  8.11.1+

### 实际部署
机器监测：`sh deploy-hook.sh`
后台运行：
`nohup yarn start ./error.txt  2>&1 &`
// 后台运行程序并且把错误存储在当前目录下的error.txt文件中

查看端口占用情况：`sudo lsof -i:8887`
解除占用：`sudo kill -9 <pid>`
机器重启：`reboot`
文件位置：/git-notify
安装依赖：yarn
运行：yarn start
