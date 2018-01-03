---
title: Hexo解决多说服务器关闭的问题
date: 2017-08-09 15:39:11
tags: Hexo
---

***

## 1 为什么多说关闭了？
![](http://ofhbt8uhx.bkt.clouddn.com/1.PNG)
**据此我们了解到多说评论系统已经关闭了，那么该怎么解决这个问题呢！现在有几个选择在我们面前:**
- **Disqus:国外网站的首选，但是很可惜国内没法加载**
- **畅言：专业的社会化评论系统，搜狐出品，不过不备案只能使用15天，坑爹**
- **友言：专业网站社会化评论系统，相对小众，但是体验很好**

**由此可见，给我们的选择也只有`友言`了** 
<!--more-->
## 2 友言评论系统使用
### 2.1 注册友言账户得到友言的用户id
**在yillia主题的目录下找到_config.yml文件，在文件中添加**
```
#是否开启分享
share_jia: true
share_addthis: false

#是否开启友言评论
youyan:
  on: true
  id: 2117332
  # 是否开启友言评论，http://www.uyan.cc/index.php
  # id 中填写你的友言用户数字ID，注册后进入后台管理即可查看
  # 友言服务在 Web 环境下运行，普通本地环境无法查看，请部署后在线上测试。
```
### 2.2 修改article.ejs
```
<% if (!index && post.comments && theme.youyan.on){ %>
<section id="comments">
  <% if (!index && post.comments) { %>
    <!-- UY BEGIN -->
    <section id="comments">
        <div id="uyan_frame"></div>
        <script type="text/javascript" src="http://v2.uyan.cc/code/uyan.js?uid=2117332"></script>
    </section>
    <!-- UY END -->
<% } %>
</section>
<% } %>
```
### 2.3 在comments文件夹中添加youyan.ejs文件
```
<section class="youyan" id="comments">
  <div id="uyan_frame"></div>
  <script src="http://v2.uyan.cc/code/uyan.js?uid=<%= theme.youyan.id%>"></script>
</section>

```
### 2.4 配置完成，可以自由使用评论系统了！效果如下：
![](http://ofhbt8uhx.bkt.clouddn.com/2.PNG)