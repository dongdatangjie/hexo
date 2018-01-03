---
title: SQL Server 2008 R2如何开启数据库的远程连接
date: 2017-02-13 15:24:55


tags: 数据库
---
***
**SQL Server 2008默认是不允许远程连接的，如果想要在本地用SSMS连接远程服务器上的SQL Server 2008，远程连接数据库。需要做两个部分的配置：**

* 1，SQL Server Management Studio Express（简写SSMS）

* 2，SQL Server 配置管理器/SQL Server Configuration Manager（简写SSCM）**
<!--more-->
### 步骤
#### 1.打开sql2008，使用windows身份登录
![](http://ofhbt8uhx.bkt.clouddn.com/IYLY%7DT24%7BURR7_C6NBO%5DR%28C.png)
#### 2.登录后，右键选择“属性”。左侧选择“安全性”，选中右侧的“SQL Server 和 Windows 身份验证模式”以启用混合登录模式
![](http://ofhbt8uhx.bkt.clouddn.com/%5BI2E3%25%5DY1%7B%7BR%291EJ8O@OENN.png)
![](http://ofhbt8uhx.bkt.clouddn.com/1RD4TPVZC%60BN%5DGF%60S%601%25%7B9Q.png)
#### 3.选择“连接”，勾选“允许远程连接此服务器”，然后点“确定”
![](http://ofhbt8uhx.bkt.clouddn.com/EOPG7JPBWW76AVUG%7B%5BRMGQO.png)
#### 4.展开“安全性”，“登录名”;“sa”，右键选择“属性”,点击进入后左侧选择“常规”，右侧选择“SQL Server 身份验证”，并设置密码
![](http://ofhbt8uhx.bkt.clouddn.com/2OSFHPVQ86RI9OUCU5W4WVM.png)
#### 5.右击数据库选择“方面”
![](http://ofhbt8uhx.bkt.clouddn.com/7~TU2%5B%28VJ0R_~@AC78XI11O.png)
#### 6.在右侧的方面下拉框中选择“服务器配置”；将“RemoteAccessEnabled”属性设为“True”，点“确定”
![](http://ofhbt8uhx.bkt.clouddn.com/7N4~TVT_J%7BSM%7D%606~1K$TVEG.png)
#### 7.打开sql server配置管理器,下面开始配置SSCM，选中左侧的“SQL Server服务”，确保右侧的“SQL Server”以及“SQL Server Browser”正在运行
![](http://ofhbt8uhx.bkt.clouddn.com/UZ6TX%5D4C%5BSREISYJJGVXNX8.png)
#### 8.在左则选择sql server网络配置节点下的sqlexpress的协议，在右侧的TCP/IP默认是“否”，右键启用或者双击打开设置面板将其修改为“是”
![](http://ofhbt8uhx.bkt.clouddn.com/~%28~Z@%5DD%7B$%60WUZFSPKXJI5PN.png)
![](http://ofhbt8uhx.bkt.clouddn.com/PDAECU_766V@3N4FCVSU%29%253.png)
#### 9.选择“IP 地址”选项卡，设置TCP的端口为“1433”
![](http://ofhbt8uhx.bkt.clouddn.com/2SFDN_KWCLULOX3UL%60MMU4O.png)
#### 10.将"客户端协议"的"TCP/IP"也修改为“Enabled”
配置完成，重新启动SQL Server 2008。此时应该可以使用了，但是还是要确认一下防火墙。打开防火墙设置。将SQLServr.exe（C:\Program Files\Microsoft SQL Server\MSSQL10.SQLEXPRESS\MSSQL\Binn\sqlservr.exe）添加到允许的列表中。
![](http://ofhbt8uhx.bkt.clouddn.com/ZS3%29D3QM_WMH34PQTBGXY%5DQ.png)
#### 11.如何直接执行大sql文件？
**客户的数据库数据被篡改，利用Log Explorer工具根据日志生成的回滚脚本有200多M，不可能一下子扔到查询分析器里去执行，于是想是否SQL Server是否可以像Oracle那样直接执行.sql文件。讲过查资料，测试，发现可以在cmd窗口中执行如下命令执行Sql文件：**

    osql -S 127.0.0.1 -U sa -P sa -i D:\create.sql
**简单说明：osql为SQL Server的命令，要在cmd中执行该命令，一般安装完SQL Server后该命令对应的路径会自动添加到系统环境变量中。 -S 表示要连接的数据库服务器 -U表示登录的用户ID，-P表示登录密码 -i表示要执行的脚本文件路径。**