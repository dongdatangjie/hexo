---
title: 通过Git上传我们的代码到GitHub平台
date: 2017-03-22 21:27:59


tags: Git
---
***
### 1.首先确认自己已经安装了git，打开git bash，输入ssh-keygen -t rsa -C "自己的邮箱地址@XXX.com" ，生成自己的公钥与私钥
```
Administrator@AGOBW-706280946 MINGW64 /d/Git Repository (master)
$ ssh-keygen -t rsa -C "dongdatangjie@gmail.com"
Generating public/private rsa key pair.
Enter file in which to save the key (/c/Users/Administrator/.ssh/id_rsa):
/c/Users/Administrator/.ssh/id_rsa already exists.
Overwrite (y/n)?

```
<!--more-->
### 2.一路默认回车，会生成公钥、私钥到以下文件夹下id_rsa是私钥，id_rsa.pub是公钥，打开公钥等下要用到
![](http://ofhbt8uhx.bkt.clouddn.com/pc1.PNG)
### 3.浏览器进入自己的github，打开设置，进入ssh and GPG keys,点击NEW ssh key，自己填个标题，下面内容复制前面打开的公钥，最后添加.
![](http://ofhbt8uhx.bkt.clouddn.com/pc2.PNG)
### 4.可以用ssh -T git@github.com测试自己是否可以连接成功了，中间有个输入需要输入yes，后面可以看到Hi XXXX..... access 表示成功。
```
Administrator@AGOBW-706280946 MINGW64 /d/Git Repository (master)
$ ssh -T git@github.com
The authenticity of host 'github.com (192.30.253.113)' can't be established.
RSA key fingerprint is SHA256:nThbg6kXUpJWGl7E1IGOCspRomTxdCARLviKw6E5SY8.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added 'github.com,192.30.253.113' (RSA) to the list of known hosts.
Hi dongdatangjie! You've successfully authenticated, but GitHub does not provide shell access.

```
### 5.连接成功后，需要设置用户信息
```
$ git config --global user.name "你的用户名"

$ git config --global user.email "你的邮箱"

```
### 6.到浏览器github上创建个项目，记好创建成功后的https，下面要用
![](http://ofhbt8uhx.bkt.clouddn.com/pic3.PNG)
### 7.按次序输入下列命令
```
$ git init

$ git add 文件路径

$ git cmmmit -m "给本次提交备注一下"

$ git remote add origin https:.........你的仓库地址地址

$ git push -u origin master

```