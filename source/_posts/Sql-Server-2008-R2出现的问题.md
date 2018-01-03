---
title: Sql Server 2008 R2出现的问题
date: 2017-02-19 14:36:59
tags: 数据库
---
***
### 1.Sql server2008如何导入数据到远程文件中
* **应用场景：在与东泽的项目中，我们需要将本地的数据库导入到东泽远程的服务器中。**
#### 1.1 登陆本地数据库，选择你所要导出的数据库，然后右键任务=>导入数据
![](http://ofhbt8uhx.bkt.clouddn.com/sql_1.png)
#### 1.2 选择要从中复制的数据源
![](http://ofhbt8uhx.bkt.clouddn.com/sql_2.png)
#### 1.3 制定要将数据复制到何处
![](http://ofhbt8uhx.bkt.clouddn.com/sql_3.png)
#### 1.4 选择表和原视图
![](http://ofhbt8uhx.bkt.clouddn.com/sql_4.png)
#### 1.5 最后完成即可
<!--more-->
### 2.SQL2008配置管理工具服务显示远程过程调用失败
>打开控制面板=>卸载程序，卸载了一个叫"Microsoft SQL Server 2012LocalDB"，重新打开SQL配置管理器
[解决方法链接](http://www.cnblogs.com/cool-fire/archive/2012/09/15/2686131.html)
### 3.ASP.NET MVC 应用，站点发布到本地IIS出现的问题
* **问题：错误 ERROR_APPPOOL_VERSION_MISMATCH: Web 部署任务失败。 (你尝试使用的应用程序池已将“managedRuntimeVersion”属性设置为“v2.0”。**
* **解决：需要修改 应用程序池中默认程序池.net framework 版本**
![](http://ofhbt8uhx.bkt.clouddn.com/sql_5.png)
* **问题：HTTP 错误 500.21 - Internal Server Error处理程序“PageHandlerFactory-Integrated”在其模块列表中有一个错误模块“ManagedPipelineHandler”**
* **原因：在安装Framework v4.0之后，再启用IIS，导致Framework没有完全安装**
* **解决：**![](http://ofhbt8uhx.bkt.clouddn.com/e21e67902e7964a33154c2f3fad5bf24.jpg)