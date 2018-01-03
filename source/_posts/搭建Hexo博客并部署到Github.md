---
title: 搭建Hexo博客并部署到Githu
bdate: 2016-10-18 21:44:37
tags: Hexo
---

***
大家也搭建过博客，很多时候，按着教程来做就可以了，但是我当时为了搭建Hexo博客并部署到Github，走了不少弯路。现在终于搭建出来了，为了帮助大家，我决定写一篇“史上最详细“截图”搭建Hexo博客并部署到Github”。
![Hexo](http://upload-images.jianshu.io/upload_images/1060239-61093512a29e9578.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
<!--more-->***
### 工具/原料
* windows
* GIt
* Node.js
***
### 安装Hexo
```bash
$ npm install hexo-cli -g
```
### 初始化Hexo的目录
```bash
$ hexo init
```
### 在hexo目录下执行(安装依赖项)
```bash
$ npm install
```
### 输入下面命令后，浏览器输入localhost:4000/ 本地查看
```bash
$ hexo generate
$ hexo server
```
![](https://raw.githubusercontent.com/dongdatangjie/dongdatangjie.github.io/master/css/images/banner.jpg)
### 创建GitHub账号
不做讲解
### 创建Repository
登陆Github账号后，点击右上角的“+”号按钮，选择“New repository”
![dongdatangjie](http://upload-images.jianshu.io/upload_images/1060239-6c0530dba11443fe.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
在Create a new repository界面填写格式如下图所示: 用户名.github.io
填写完成点Create repository创建完成
![](http://upload-images.jianshu.io/upload_images/1060239-f223b2c844606bc5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

先点击HTTPS，然后复制里面的地址。然后编辑_config.yml文件（在d:\Hexo下）。
![](http://h.hiphotos.baidu.com/exp/w=480/sign=4f13cb0357e736d158138d00ab514ffc/9d82d158ccbf6c817717a937bf3eb13532fa40c9.jpg)

修改文件里面的deploy。其中的repository就改成你刚刚复制的地址。保存这个文件.
![](http://g.hiphotos.baidu.com/exp/w=480/sign=b93880a1261f95caa6f593bef9167fc5/0824ab18972bd4071bc8562278899e510eb309e5.jpg)

### 生成SSH Keys
使用ssh-keygen命令生成密钥对

ssh-keygen -t rsa -C"这里是你申请Github账号时的邮箱"

然后系统会要你输入密码：（我们输入的密码会在你提交项目的时候使用）

Enter passphrase (emptyforno passphrase):<输入加密串>Enter same passphrase again:<再次输入加密串>

（终端提示生成的文件路径）找到你生成的密钥找到id_rsa.pub用终端进入编辑，复制密钥。

![](http://upload-images.jianshu.io/upload_images/1060239-29b6bf4ce3326e7c.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 添加SSH Key
通过命令复制SSH Key内容到系统剪贴板

pbcopy < ~/.ssh/id_rsa.pub

登陆Github,点击右侧用户按钮，选择Settings

![](http://upload-images.jianshu.io/upload_images/1060239-455bfc8e1484c71a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

点击 Add SSH key 按钮，将复制的密钥粘贴到 Key 栏

![](http://upload-images.jianshu.io/upload_images/1060239-798aed85b58215a3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 测试
ssh-T git@github.com

执行结果

Permanently addedtheRSA host keyforIP address '192.30.252.130'tothelistofknown hosts.Are you sure you wanttocontinueconnecting (yes/no)?<输入yes>Hi username! You've successfully authenticated,butGitHubdoesnot

现在你已经可以通过SSH链接到Github了

如果有问题，请再配置。参考网站

生成SSH Keys

Generating SSH Keys

Error: Permission denied (publickey)错误

Error: Permission denied (publickey)

设置你的用户名和密码：

Git会根据用户的名字和邮箱来记录提交，GitHub也是用这些信息来做权限的处理。

git config --global user.name"这里是你申请Github账号时的name"git config --global user.email"这里是你申请Github账号时的邮箱"

###部署
```bash
$ hexo generate
$ hexo deploy
```
可能出现错误：
>搭建 hexo，在执行 hexo deploy 后,出现 error deployer not found:github 的错误

解决方法：
>npm install hexo-deployer-git --save 改了之后执行，然后再部署试试

解决完成之后出现部署完成我们的博客啦！[博客地址](https://dongdatangjie.github.io/)
