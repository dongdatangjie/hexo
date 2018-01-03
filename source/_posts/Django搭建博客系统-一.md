---
title: Django搭建博客系统(一)
date: 2017-08-10 16:35:09
tags: [Django,python]
---

***
## 1 - 搭建开发环境
### 1.1 - 开发环境
- **win10 64位**
- **python3.6**
- **Django1.10.6**
### 1.2 - Pycharm创建工程（不详述）
**下面是生成的目录结构：**
![](http://ofhbt8uhx.bkt.clouddn.com/3.PNG)
**使用快捷键`Ctrl + Alt + /`运行runserver命令开启本地服务器，然后 输入命令`runserver 5000`开启5000端口，然后打开浏览器看到Django的欢迎界面！**
**Django默认的语言是英语，我们使用中文需要在`settings.py`中修改：**
```
LANGUAGE_CODE = 'zh-hans'
TIME_ZONE = 'Asia/Shanghai'
```
**再次运行开发服务器，并在浏览器打开 localhost:5000/，可以看到 Django 已经支持中文了。**
![](http://ofhbt8uhx.bkt.clouddn.com/4.PNG)
## 2 - 建立博客应用
**在pycharm的工具栏找到 Tools，点击之后会有“Run manage.py task”选项，点击它之后，在pycharm下面会出现一个输入界面，在里面输入“startapp appName(你的App名称)”，回车之后就可以在工程下面看到你新建的App了。**
![](http://ofhbt8uhx.bkt.clouddn.com/5.PNG)
**不同名称的文件用于存放特定功能的代码，这些将会在后面详细介绍。总之这个应用的文件夹结构 Django 已经为我们建立好了，但它还只是包含各种文件的一个文件夹而已，Django 目前还不知道这是一个应用。我们得告诉 Django 这是我们建立的应用，专业一点说就是在 Django 的配置文件中注册这个应用。**
**打开 HexoBlogDjango\ 目录下的 settings.py 文件，看名字就知道 settings.py 是一个设置文件（setting 意为设置），找到 INSTALLED_APPS 设置项，将 blog 应用添加进去。**
```
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'Hexo',#注册Hexo应用
]
```
<!--more-->
## 3 - 创建 Django 博客的数据库模型
### 3.1 - 设计博客的数据库表结构
#### Post表（文章表）
**Post表包括文章编号，标题，正文，创建时间，修改时间，摘要，类别，标签**
|id|title|body|created_time|modified_time|excerpt|category|tags|
| :--:      | :--:     | :--: |:--: |:--: |:--: |:--: |:--: |
| 1  | title1|  text1   |2017-08-09|2017-08-09|summary1|Django|Django学习|
| 2  | title2|  text2   |2017-08-09|2017-08-09|summary2|Django|Django学习|
| 3  | title3|  text3   |2017-08-09|2017-08-09|summary3|Django|Django学习|
#### Category表（分类表）
**Category表包括分类编号，分类名**
|id|name |
| :--:      | :--:     | 
| 1  | Django|  
| 2  | Hexo|  
#### Tag表（分类表）
**Tag表包括标签编号，标签名**
|id|name |
| :--:      | :--:     | 
| 1  | Django学习|  
| 2  | Hexo学习|  
**表之间的映射关系为：**
![](http://ofhbt8uhx.bkt.clouddn.com/%E6%9C%AA%E5%91%BD%E5%90%8D%E6%96%87%E4%BB%B6%20%284%29.png)
### 3.2 - 编写博客模型代码
**Django 为我们提供了一套 ORM（Object Relational Mapping）系统。**
```
Hexo/models.py

from django.db import models
from django.contrib.auth.models import User

class Category(models.Model):
    """
        Django 要求模型必须继承 models.Model 类。
        Category 只需要一个简单的分类名 name 就可以了。
        CharField 指定了分类名 name 的数据类型，CharField 是字符型，
        CharField 的 max_length 参数指定其最大长度，超过这个长度的分类名就不能被存入数据库。
        当然 Django 还为我们提供了多种其它的数据类型，如日期时间类型 DateTimeField、整数类型 IntegerField 等等。
        Django 内置的全部类型可查看文档：
        https://docs.djangoproject.com/en/1.10/ref/models/fields/#field-types
        """
    name = models.CharField(max_length=100)


class Tag(models.Model):
    """
    标签 Tag 也比较简单，和 Category 一样。
    再次强调一定要继承 models.Model 类！
    """
    name = models.CharField(max_length=100)


# Create your models here.
class Post(models.Model):
    """
    文章的数据库表稍微复杂一点，主要是涉及的字段更多。
    """

    # 文章标题
    title = models.CharField(max_length=70)

    # 文章正文，我们使用了 TextField。
    # 存储比较短的字符串可以使用 CharField，但对于文章的正文来说可能会是一大段文本，因此使用 TextField 来存储大段文本。
    body = models.TextField()

    # 这两个列分别表示文章的创建时间和最后一次修改时间，存储时间的字段用 DateTimeField 类型。
    created_time = models.DateTimeField()
    modified_time = models.DateTimeField()

    # 文章摘要，可以没有文章摘要，但默认情况下 CharField 要求我们必须存入数据，否则就会报错。
    # 指定 CharField 的 blank=True 参数值后就可以允许空值了。
    excerpt = models.TextField(max_length=500, blank=True)

    # 这是分类与标签，分类与标签的模型我们已经定义在上面。
    # 我们在这里把文章对应的数据库表和分类、标签对应的数据库表关联了起来，但是关联形式稍微有点不同。
    # 我们规定一篇文章只能对应一个分类，但是一个分类下可以有多篇文章，所以我们使用的是 ForeignKey，即一对多的关联关系。
    # 而对于标签来说，一篇文章可以有多个标签，同一个标签下也可能有多篇文章，所以我们使用 ManyToManyField，表明这是多对多的关联关系。
    # 同时我们规定文章可以没有标签，因此为标签 tags 指定了 blank=True。
    # 如果你对 ForeignKey、ManyToManyField 不了解，请看教程中的解释，亦可参考官方文档：
    # https://docs.djangoproject.com/en/1.10/topics/db/models/#relationships
    category = models.ForeignKey(Category)
    tags = models.ManyToManyField(Tag, blank=True)

    # 文章作者，这里 User 是从 django.contrib.auth.models 导入的。
    # django.contrib.auth 是 Django 内置的应用，专门用于处理网站用户的注册、登录等流程，User 是 Django 为我们已经写好的用户模型。
    # 这里我们通过 ForeignKey 把文章和 User 关联了起来。
    # 因为我们规定一篇文章只能有一个作者，而一个作者可能会写多篇文章，因此这是一对多的关联关系，和 Category 类似。
    author = models.ForeignKey(User)
```
## 4 - 让 Django 完成翻译：迁移数据库
### 4.1 - 迁移数据库
**打开pycharm的`Tool`工具栏，点击`Run maange.py Task`运行如下命令**
```
manage.py@HexoBlogDjango > makemigrations Hexo
"F:\PyCharm 2017.1.4\bin\runnerw.exe" F:\pythonflaskproject\Scripts\python.exe "F:\PyCharm 2017.1.4\helpers\pycharm\django_manage.py" makemigrations Hexo F:/HexoBlogDjango
Migrations for 'Hexo':
  Hexo\migrations\0001_initial.py
    - Create model Category
    - Create model Post
    - Create model Tag
    - Add field tags to post
Following files were affected 
 F:\HexoBlogDjango\Hexo\migrations\0001_initial.py
Process finished with exit code 0
manage.py@HexoBlogDjango > migrate Hexo
"F:\PyCharm 2017.1.4\bin\runnerw.exe" F:\pythonflaskproject\Scripts\python.exe "F:\PyCharm 2017.1.4\helpers\pycharm\django_manage.py" migrate Hexo F:/HexoBlogDjango
Operations to perform:
  Apply all migrations: Hexo
Running migrations:
  Applying contenttypes.0001_initial... OK
  Applying auth.0001_initial... OK
  Applying Hexo.0001_initial... OK
Following files were affected 
 F:\HexoBlogDjango\db.sqlite3
Process finished with exit code 0
```
**我们加入`_str_`方法用来获取对象时直接输出关键字段信息**
```
Hexo/models.py

from django.utils.six import python_2_unicode_compatible

# python_2_unicode_compatible 装饰器用于兼容 Python2
@python_2_unicode_compatible
class Category(models.Model):
    ...

    def __str__(self):
        return self.name

@python_2_unicode_compatible
class Tag(models.Model):
    ...

    def __str__(self):
        return self.name

@python_2_unicode_compatible
class Post(models.Model):
    ...

    def __str__(self):
        return self.title
```
**通过`python manage.py createsuperuser`创建后台管理员，管理数据库，本想通过pycharm自带的`Run manage.py Task`创建管理员但是出现`django.db.utils.IntegrityError: NOT NULL constraint failed: auth_user.last_login`的错误，所以建议还是使用`python manage.py createsuperuser`创建管理员**
## 5 - Django 博客首页视图
### 5.1 - route路由机制
**在Hexo应用目录下创建urls.py文件，在文件中写入**
```
Hexo/urls.py

from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
]
```
**我们首先从 django.conf.urls 导入了 url 函数，又从当前目录下导入了 views 模块。然后我们把网址和处理函数的关系写在了 urlpatterns 列表里。**
**绑定关系的写法是把网址和对应的处理函数作为参数传给 url 函数（第一个参数是网址，第二个参数是处理函数），另外我们还传递了另外一个参数 name，这个参数的值将作为处理函数 index 的别名，这在以后会用到。**
### 5.2 - 视图函数
```
Hexo/views.py

from django.http import HttpResponse
from .models import Post
from django.shortcuts import render


def index(request):
    post_list = Post.objects.all().order_by('-created_time')
    return render(request, 'Hexo/index.html', context={'post_list': post_list})
```
**我们曾经在前面的章节讲解过模型管理器 objects 的使用。这里我们使用 all() 方法从数据库里获取了全部的文章，存在了 post_list 变量里。all 方法返回的是一个 QuerySet（可以理解成一个类似于列表的数据结构），由于通常来说博客文章列表是按文章发表时间倒序排列的，即最新的文章排在最前面，所以我们紧接着调用了 order_by 方法对这个返回的 queryset 进行排序。排序依据的字段是 created_time，即文章的创建时间。- 号表示逆序，如果不加 - 则是正序。 接着如之前所做，我们渲染了 blog\index.html 模板文件，并且把包含文章列表数据的 post_list 变量传给了模板。**
### 5.3 - 使用 Django 模板系统
**首先在我们的项目根目录（即 manage.py 文件所在目录）下建立一个名为 templates 的文件夹，用来存放我们的模板。然后在 templates\ 目录下建立一个名为 blog 的文件夹，用来存放和 blog 应用相关的模板。**
**当然模板存放在哪里是无关紧要的，只要 Django 能够找到的就好。但是我们建立这样的文件夹结构的目的是把不同应用用到的模板隔离开来，这样方便以后维护。我们在 templates\Hexo 目录下建立一个名为 index.html 的文件，此时你的目录结构应该是这样的：**
```
HexoBlogDjango\
    manage.py
    HexoBlogDjango\
        __init__.py
        settings.py
        ...
    Hexo\
        __init__.py
        models.py
        ,,,
    templates\
        Hexo\
            index.html
```
### 5.4 - 处理静态文件
**我们的项目使用了从网上下载的一套博客模板[点击这里下载全套模板](https://github.com/zmrenwu/django-blog-tutorial-templates)。这里面除了 HTML 文档外，还包含了一些 CSS 文件和 JavaScript 文件以让网页呈现出我们现在看到的样式。同样我们需要对 Django 做一些必要的配置，才能让 Django 知道如何在开发服务器中引入这些 CSS 和 JavaScript 文件，这样才能让博客页面的 CSS 样式生效。**
**按照惯例，我们把 CSS 和 JavaScript 文件放在 Hexo应用的 static\ 目录下。因此，先在 Hexo应用下建立一个 static 文件夹。同时，为了避免和其它应用中的 CSS 和 JavaScript 文件命名冲突（别的应用下也可能有和 blog 应用下同名的 CSS 、JavaScript 文件），我们再在 static\ 目录下建立一个 Hexo文件夹，把下载的博客模板中的 css 和 js 文件夹连同里面的全部文件一同拷贝进这个目录。最终我们的 Hexo应用目录结构应该是这样的：**
### 5.5 - 配置函数
**将Hexo应用中的url配置到主程序的urls.py中**
```
- from django.conf.urls import url
+ from django.conf.urls import url, include
from django.contrib import admin

urlpatterns = [
    url(r'^admin/', admin.site.urls),
+   url(r'', include('Hexo.urls')),
]
```
### 5.6 - 运行结果
**运行`python manage.py runserver `打开开发服务器，在浏览器输入开发服务器的地址 http://127.0.0.1:8000/，可以看到 Django 返回的内容了。**
![](http://ofhbt8uhx.bkt.clouddn.com/6.PNG)
**如图所示，你会看到首页显示的样式非常混乱，原因是浏览器无法正确加载 CSS 等样式文件。需要以 Django 的方式来正确地处理 CSS 和 JavaScript 等静态文件的加载路径。CSS 样式文件通常在 HTML 文档的 head 标签里引入，打开 index.html 文件，在文件的开始处找到 head 标签包裹的内容，大概像这样：在头部添加load staticfiles,把所有引入的样式修改改成static 'Hexo/css/bootstrap.min.css'得到**
![](http://ofhbt8uhx.bkt.clouddn.com/7.PNG

### 5.7 - 修改模板
**将数据引入：**
```
{% for post in post_list %}
  <article class="post post-{{ post.pk }}">
    <header class="entry-header">
                       <h1 class="entry-title">
    <a href="single.html">{{ post.title }}</a>
</h1>
                        <div class="entry-meta">
                            <span class="post-category"><a href="#">Django 博客教程</a></span>
                            <span class="post-date"><a href="#"><time class="entry-date"
                                                                      datetime="2012-11-09T23:15:57+00:00">2017年5月11日</time></a></span>
                            <span class="post-author"><a href="#">追梦人物</a></span>
                            <span class="comments-link"><a href="#">4 评论</a></span>
                            <span class="views-count"><a href="#">588 阅读</a></span>
                        </div>
                    </header>
                    <div class="entry-content clearfix">
                        <p>免费、中文、零基础，完整的项目，基于最新版 Django 1.10 和 Python 3.5。带你从零开始一步步开发属于自己的博客网站，帮助你以最快的速度掌握 Django
                            开发的技巧...</p>
                        <div class="read-more cl-effect-14">
                            <a href="#" class="more-link">继续阅读 <span class="meta-nav">→</span></a>
                        </div>
                    </div>
  </article>
```
### 5.7 - 在 Admin 后台注册模型
**要在后台注册我们自己创建的几个模型，这样 Django Admin 才能知道它们的存在，注册非常简单，只需要在 blog\admin.py 中加入下面的代码：**
```
Hexo/admin.py

from django.contrib import admin
from .models import Post, Category, Tag

admin.site.register(Post)
admin.site.register(Category)
admin.site.register(Tag)
```
**我们重新浏览locahost:5000/，发现我们没有发布任何文章，于是我们登陆localhost:5000/admin进入Django的后台管理系统添加文章和分类标签**
![](http://ofhbt8uhx.bkt.clouddn.com/8.PNG)
```
HexoBlogDjango/settings.py

#'django.middleware.csrf.CsrfViewMiddleware',#注释此句，屏蔽CSRF
```
![](http://ofhbt8uhx.bkt.clouddn.com/9.PNG)
**此时可以看出post的信息已经显示在界面上了，但是我们发现格式有很大的问题，这个我们后面再做修改，添加上Markdown的支持。**

## 6 - Django 博客文章详情页
### 6.1 - 设计文章详情页的 URL
```
Hexo/urls.py

from django.conf.urls import url

from . import views

app_name = 'Hexo'
urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^post/(?P<pk>[0-9]+)/$', views.detail, name='detail'),
]
```
### 6.2 - 获取文章详情模板
```
Hexo/models.py

from django.db import models
from django.contrib.auth.models import User
from django.urls import reverse
from django.utils.six import python_2_unicode_compatible

@python_2_unicode_compatible
class Post(models.Model):
    ...

    def __str__(self):
        return self.title

    # 自定义 get_absolute_url 方法
    # 记得从 django.urls 中导入 reverse 函数
    def get_absolute_url(self):
        return reverse('Hexo:detail', kwargs={'pk': self.pk})
```
### 6.2 - 编写 detail 视图函数
```
blog/views.py

from django.shortcuts import render, get_object_or_404
from .models import Post

def index(request):
    # ...

def detail(request, pk):
    post = get_object_or_404(Post, pk=pk)
    return render(request, 'Hexo/detail.html', context={'post': post})
```
### 6.2 - 编写详情页模板(detail.html)
**修改之前的index界面**
```
templates/blog/index.html

<article class="post post-1">
  <header class="entry-header">
    <h1 class="entry-title">
      <a href="{{ post.get_absolute_url }}">{{ post.title }}</a>
    </h1>
    ...
  </header>
  <div class="entry-content clearfix">
    ...
    <div class="read-more cl-effect-14">
      <a href="{{ post.get_absolute_url }}" class="more-link">继续阅读 <span class="meta-nav">→</span></a>
    </div>
  </div>
</article>
```
**这个时候我们发现其实很多界面上的元素是重复的，我们使用类似于 jsp中的include方法将重复元素提取出来然后多次调用。**
**在templates目录下新建base.html文件**
```
HexoBlogDjango\
    manage.py
    HexoBlogDjango\
        __init__.py
        settings.py
        ...
    Hexo\
        __init__.py
        models.py
        ,,,
    templates\
        base.html
        Hexo\
            index.html
            detail.html
```
```
templates/base.html

...
<main class="col-md-8">
    {% block main %}
    {% endblock main %}
</main>
<aside class="col-md-4">
  {% block toc %}
  {% endblock toc %}
  ...
</aside>
...
```
```
templates/Hexo/index.html

{% extends 'base.html' %}

{% block main %}
    {% for post in post_list %}
        <article class="post post-1">
          ...
        </article>
    {% empty %}
        <div class="no-post">暂时还没有发布的文章！</div>
    {% endfor %}
    <!-- 简单分页效果
    <div class="pagination-simple">
        <a href="#">上一页</a>
        <span class="current">第 6 页 / 共 11 页</span>
        <a href="#">下一页</a>
    </div>
    -->
    <div class="pagination">
      ...
    </div>
{% endblock main %}
```
```
templates/Hexo/detail.html

{% extends 'base.html' %}

{% block main %}
    <article class="post post-{{ post.pk }}">
  <header class="entry-header">
    <h1 class="entry-title">{{ post.title }}</h1>
    <div class="entry-meta">
      <span class="post-category"><a href="#">{{ post.category.name }}</a></span>
      <span class="post-date"><a href="#"><time class="entry-date"
                                                datetime="{{ post.created_time }}">{{ post.created_time }}</time></a></span>
      <span class="post-author"><a href="#">{{ post.author }}</a></span>
      <span class="comments-link"><a href="#">4 评论</a></span>
      <span class="views-count"><a href="#">588 阅读</a></span>
    </div>
  </header>
  <div class="entry-content clearfix">
    {{ post.body }}
  </div>
</article>
    <section class="comment-area">
      ...
    </section>
{% endblock main %}
{% block toc %}
    <div class="widget widget-content">
        <h3 class="widget-title">文章目录</h3>
        <ul>
            <li>
                <a href="#">教程特点</a>
            </li>
            <li>
                <a href="#">谁适合这个教程</a>
            </li>
            <li>
                <a href="#">在线预览</a>
            </li>
            <li>
                <a href="#">资源列表</a>
            </li>
            <li>
                <a href="#">获取帮助</a>
            </li>
        </ul>
    </div>
{% endblock toc %}
```
![](http://ofhbt8uhx.bkt.clouddn.com/10.PNG)
## 7 - 支持 Markdown 语法和代码高亮
### 7.1 - 安装 Python Markdown
**将 Markdown 格式的文本渲染成标准的 HTML 文档是一个复杂的工作，好在已有好心人帮我们完成了这些工作，我们直接使用即可。首先安装 Markdown，这是一个 Python 第三方库，激活虚拟环境，然后使用命令 `pip install markdown `安装即可。**
### 7.2 - 在 detail 视图中渲染 Markdown
```
blog/views.py

import markdown
from django.shortcuts import render, get_object_or_404
from .models import Post

def detail(request, pk):
    post = get_object_or_404(Post, pk=pk)
    # 记得在顶部引入 markdown 模块
    post.body = markdown.markdown(post.body,
                                  extensions=[
                                     'markdown.extensions.extra',
                                     'markdown.extensions.codehilite',
                                     'markdown.extensions.toc',
                                  ])
    return render(request, 'Hexo/detail.html', context={'post': post})
```
**引入下面的样式同时安装pygments,`pip install Pygments`**
```
 <link rel="stylesheet" href="{% static 'blog/css/highlights/github.css' %}">
```



