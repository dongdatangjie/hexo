---
title: Python matplotlib 数据可视化
date: 2017-06-13 19:50:26
tags: 机器学习
---

***
## 图的基本结构
**通常，使用 numpy 组织数据, 使用 matplotlib API 进行数据图像绘制。 一幅数据图基本上包括如下结构：**

- Data: 数据区，包括数据点、描绘形状
- Axis: 坐标轴，包括 X 轴、 Y 轴及其标签、刻度尺及其标签
- Title: 标题，数据图的描述
- Legend: 图例，区分图中包含的多种曲线或不同分类的数据
- 其他的还有图形文本 (Text)、注解 (Annotate)等其他描述

**详细的结构图如下图所示：**
<div align="center">
![](http://ofhbt8uhx.bkt.clouddn.com/Python_Figure_Structure.png)
</div>
<!--more-->
## 绘图分类
**Matplotlib API 中提供了常见的绘图类型，常用的包括如下：**

- 常规图：regular plot
- 直方图：bar plot
- 散点图：scatter plot
- 饼状图：pie plot
- 轮廓图：contour plot
- 3D图：3D plot
- 多子图：subplot
- 显示图片：imshow
## 画法
**本篇以常规图为例，详细记录作图流程及技巧。按照绘图结构，可将数据图的绘制分为如下几个步骤：**

- 导入 matplotlib 包相关工具包
- 准备数据，numpy 数组存储
- 绘制原始曲线
- 配置标题、坐标轴、刻度、图例
- 添加文字说明、注解
- 显示、保存绘图结果
**先给出一个完整的图结构吧，这个图主要是绘制 cos、sin、sqrt 函数图像，如下：**
<div align="center">
![](http://ofhbt8uhx.bkt.clouddn.com/figure.png)
</div>
## 导包
**涉及到 matplotlib.pyplot、pylab 和 numpy，如：**
```python
'''
Created on 2017年6月13日

@author: 唐杰
'''
import numpy as np
import matplotlib.pyplot as plt
import matplotlib  
```
##准备数据
**numpy 常用来组织源数据:**
```python
#定义数据
x=np.arange(0,10,0.2)
y1=np.sin(x)
y2=np.cos(x)
y3=np.sqrt(x)
```
## 绘制基本曲线
**使用 plot 函数直接绘制上述函数曲线，可以通过配置 plot 函数参数调整曲线的样式、粗细、颜色、标记等：**
```python
#绘制图线
plt.plot(x,y1,color='red',linewidth=1.5,linestyle='-',marker='.',label=r'$y = sin(x)$')
plt.plot(x, y2, color='blue', linewidth=1.5, linestyle='-', marker='.', label=r'$y = cos{x}$')
plt.plot(x, y3, color='m', linewidth=1.5, linestyle='-', marker='x', label=r'$y = \sqrt{x}$')
```
## 设置坐标轴
**可通过如下代码，移动坐标轴 spines，解说详见注释：**
```python
#设置坐标轴
ax=plt.subplot(111)
ax.spines['right'].set_color('none')     # 去掉右边的边框线
ax.spines['top'].set_color('none')       # 去掉上边的边框线
# 移动下边边框线，相当于移动 X 轴
ax.xaxis.set_ticks_position('bottom')    
ax.spines['bottom'].set_position(('data', 0))
# 移动左边边框线，相当于移动 y 轴
ax.yaxis.set_ticks_position('left')
ax.spines['left'].set_position(('data', 0))
```
**可通过如下代码，设置刻度尺间隔 lim、刻度标签 ticks：**
```python
# 设置 x, y 轴的刻度标签值
plt.xticks([2, 4, 6, 8, 10], [r'2', r'4', r'6', r'8', r'10'])
plt.yticks([-1.0, 0.0, 1.0, 2.0, 3.0, 4.0],
    [r'-1.0', r'0.0', r'1.0', r'2.0', r'3.0', r'4.0'])
```
**可通过如下代码，设置 X、Y 坐标轴和标题：**
```python
# 设置标题、x轴、y轴
plt.title('cos(), sin() and sqrt() 的函数图像', fontproperties=myfont, fontsize=19)
plt.xlabel('输入x的值',fontproperties=myfont, fontsize=18, labelpad=60.5)
plt.ylabel(r'$y = f(x)$', fontsize=18, labelpad=6.5)
```
## 设置文字描述、注解

**可通过如下代码，在数据图中添加文字描述 text：**
```python
#在数据图中添加文字描述
plt.text(4, 1.68, r'$x \in [0.0, \ 10.0]$', color='k', fontsize=15)
plt.text(4, 1.38, r'$y \in [-1.0, \ 4.0]$', color='k', fontsize=15)
```
**可通过如下代码，在数据图中给特殊点添加注解 annotate：**
```python
# 特殊点添加注解
plt.scatter([8,],[np.sqrt(8),], 50, color ='m')  # 使用散点图放大当前点
plt.annotate(r'$2\sqrt{2}$', xy=(8, np.sqrt(8)), xytext=(8.5, 2.2), fontsize=16, color='#090909', arrowprops=dict(arrowstyle='->', connectionstyle='arc3, rad=0.1', color='#090909'))
```
## 设置图例
**可使用如下两种方式，给绘图设置图例：**
**1: 在 plt.plot 函数中添加 label 参数后，使用 plt.legend(loc=’up right’)**
**2: 不使用参数 label, 直接使用如下命令：**
**loc 参数表示图例的位置，常见的位置参数如下：**
<div align="center">
![](http://ofhbt8uhx.bkt.clouddn.com/legend.png)
</div>
## 网格线开关

**可使用如下代码，给绘图设置网格线：**
```python
plt.grid(True)
```
## 显示、保存
```python
plt.show()    # 显示
# savefig('../figures/plot3d_ex.png',dpi=48)    # 保存，前提目录存在
```
## 显示中文
```python
myfont = matplotlib.font_manager.FontProperties(fname=r'F:/Anaconda3/envs/tensorflow/Lib/site-packages/matplotlib/mpl-data/fonts/ttf/msyh.ttc')

plt.xlabel('输入x的值',fontproperties=myfont, fontsize=18, labelpad=60.5)
```
## 直方图
```python
#coding:utf-8
'''
Created on 2017年6月13日

@author: 唐杰
'''

import numpy as np
import matplotlib.pyplot as plt
from pylab import *
x_size = [1, 3, 5, 7, 9, 11, 13]
y_time_point = [0, 200, 415, 628, 714, 862, 0]
x_zhe = [3, 5, 7, 9, 11]
y_zhe = [200, 415, 628, 714, 862]
# 设置刻度标签
plt.xticks(x_zhe,("3", "5", "7", "9", "11"))
# 绘制柱状图
plt.bar(left = (x_size), height = (y_time_point), width = 1.0,
    align="center", facecolor = 'lightskyblue',edgecolor = 'white')
# 添加文本解释
for x, y in zip(x_zhe, y_zhe):
    plt.text(x, y+10, '%.0f' % y, ha='center', va= 'bottom')
#设置y轴范围
ylim(0, 1000)
# 画折线图
plt.plot(x_zhe, y_zhe, 'y.-')
plt.title('Time values change with Size')
plt.xlabel('Size')
plt.ylabel('Time (s)')
plt.grid(True)
plt.show()
```
**以上代码可以得到如下直方图：**
<div align="center">
![](http://ofhbt8uhx.bkt.clouddn.com/bar.png)
</div>
**常用数学符号LATex表示方法:**
[http://mohu.org/info/symbols/symbols.htm](http://mohu.org/info/symbols/symbols.htm)
