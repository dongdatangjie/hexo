---
title: Scikit-learn之旅（1）
date: 2017-06-21 14:33:58

tags: 机器学习
---


***
## sklearn 训练感知机
>**感知机对于不能够线性可分的数据，算法永远不会收敛**

**之前好像写过关于感知机类型的博客，正好最近看到思维导图很火，于是我也好用思维导图写博客吧！嘿嘿**

<div align="center">
![](http://ofhbt8uhx.bkt.clouddn.com/scikit-learn%E8%AE%AD%E7%BB%83%E6%84%9F%E7%9F%A5%E5%99%A8.png)
</div>

**代码运行结果：**

<div align="center">
![](http://ofhbt8uhx.bkt.clouddn.com/%E6%84%9F%E7%9F%A5%E5%99%A8.png)
</div>

**从图中可见三个类别无法被线性决策界完美分类**
<!--more-->
## 逻辑斯蒂回归对类别概率建模
### 逻辑斯蒂回归和条件概率
**数学上，正例类别表示y=1，于是我们定义对数几率函数$logit$**，对数几率函数的自变量$p$取值范围$[0,1]$，因变量值域为实数域，将上式中的$p$视为类后验概率估计$p(y=1| x)$,然后定义如下线性关系：
$$logit(p(y=1|x))=\omega_0x_0+\omega_1x_1+\omega_m x_m=\sum_{i=0}^{n}\omega_mx_m=\omega^{T}x$$
**实际上我们关心的是某个样本属于类别的概率，恰恰是对数几率函数的反函数，也被称为逻辑斯底函数(logistic function)，有时简写为sigmoid函数，函数图像是S型：**
$$\phi(z)=\frac{1}{1+e^{-z}}$$
**其中z是网络输入，即权重参数和特征的线性组合:**
$$z=\omega^{T}x=\omega_0x_0+\omega_1x_1+\omega_m x_m$$
**sigmoid(S曲线)函数很重要，我们不妨画图看一看：**
```python
#coding:utf-8
'''
Created on 2017年6月21日

@author: 唐杰
'''
import matplotlib.pyplot as plt
import numpy as np
def sigmod(z):
    return 1.0/(1.0+np.exp(-z))
z=np.arange(-7,7,0.1)
phi_z=sigmod(z)
plt.plot(z,phi_z)
plt.axvline(0.0,color='k')
plt.axhspan(0.0, 1.0,facecolor='1.0',alpha=1.0,ls='dotted')
plt.axhline(y=0.5,ls='dotted',color='k')
plt.axhline(y=0.0,ls='dotted',color='k')
plt.axhline(y=1.0,ls='dotted',color='k')
plt.yticks([0.0,0.5,1.0])
plt.ylim(-0.1,1.1)
plt.xlabel('z')
plt.ylabel('$\phi(z)$')
plt.show()
```

<div align="center">
![](http://ofhbt8uhx.bkt.clouddn.com/sigmod.png)
</div>

**为了直观上对逻辑回归有更好的理解，我们可以和Adaline模型联系起来，二者的唯一区别是：Adaline模型，激活函数 是线性函数，在逻辑回归中，激活函数变成了sigmoid函数。**

<div align="center">
![](http://ofhbt8uhx.bkt.clouddn.com/20170109132626537.png)
![](http://ofhbt8uhx.bkt.clouddn.com/logistic.PNG)
</div>

**有了样本的预测概率，再得到样本的类别值就很简单了,和Adaline一样，使用单位阶跃函数：**

<div align="center">
![](http://ofhbt8uhx.bkt.clouddn.com/gs.PNG)
</div>

**逻辑回归之所以应用广泛，一大优点就是它不但能预测类别，还能输出具体的概率值，概率值很很多场景往往比单纯的类别值重要的多。比如在天气预测中下雨的可能性，病人患病的可能性等等。**
### 学习逻辑斯底损失函数中的权重参数
**类似上一章感知器中的差平方损失函数**
$$J(\omega)=\sum_{i}{}\frac{1}{2}(\phi(z^{(i)})-y^{(i)})^{2}$$
**我们求解损失函数最小时的权重参数，同样，对于逻辑回归，我们也需要定义损失函数，在这之前，先定义似然(likelihood)L的概念，假设训练集中样本独立，似然定义：**

<div align="center">
![](http://ofhbt8uhx.bkt.clouddn.com/1207849-b39c695a3cce1613.png)
</div>

**与损失函数费尽全力找最小值相反，对于似然函数，我们要找的是最大值。实际上，对于似然的log值，是很容易找到最大值的，也就是最大化log-likelihood函数：**

<div align="center">
![](http://ofhbt8uhx.bkt.clouddn.com/1207849-87a59f428b2e5999.png)
</div>

**接下来，我们可以运用梯度下降等优化算法来求解最大化log-likelihood时的参数。最大化和最小化本质上没有区别，所以我们还是将log-likelihood写成求最小值的损失函数形式：**

<div align="center">
![](http://ofhbt8uhx.bkt.clouddn.com/1207849-922a62ce004e4924.png)
</div>

**为了更好地理解此损失函数，假设现在训练集只有一个样本：**

<div align="center">
![](http://ofhbt8uhx.bkt.clouddn.com/1207849-634361468feae857.png)
</div>

**在预测y=0和y=1的情况下，如下图公式所示:**

<div align="center">
![](http://ofhbt8uhx.bkt.clouddn.com/1207849-4c5a0ad538d9e329.png)
</div>

**对于蓝线，如果逻辑回归预测结果正确，类别为1，则损失为0；对于绿线，如果逻辑回归预测正确，类别为0，则损失为0。 如果预测错误，则损失趋向正无穷。**

<div align="center">
![](http://ofhbt8uhx.bkt.clouddn.com/1207849-a7d67c2410bd7e27.png)
</div>

### 调用scikit-learn训练逻辑回归模型
```python
#coding:utf-8
'''
Created on 2017年6月16日
逻辑回归模型
@author: 唐杰
'''
from sklearn.linear_model import LogisticRegression
from sklearn import datasets
from sklearn.cross_validation import train_test_split 
from sklearn.preprocessing import StandardScaler
import Util
import numpy as np
import matplotlib.pyplot as plt
if __name__ == '__main__':
    lris=datasets.load_iris()
    X=lris.data[:,[2,3]]
    y=lris.target
    #将数据集分为训练集和测试集，训练集占30%
    X_train,X_test,y_train,y_test=train_test_split(X,y,test_size=0.3,random_state=0) 
    #数据集标准化
    sc=StandardScaler()
    sc.fit(X_train)
    X_train_std=sc.transform(X_train)
    X_test_std=sc.transform(X_test)
    X_combined_std=np.vstack((X_train_std,X_test_std))
    y_combined=np.hstack((y_train,y_test))
    lr=LogisticRegression(C=1000.0,random_state=0)
    lr.fit(X_train_std,y_train)
    Util.plot_decision_region(X_combined_std, y_combined, classifier=lr)
    plt.xlabel('petal length [standardized]')
    plt.ylabel('sepal length [standardized]')
    plt.legend(loc='upper left')
    plt.show()
```
**训练模型后，我们画出决策界**

<div align="center">
![](http://ofhbt8uhx.bkt.clouddn.com/logisticMenu.png)
</div>
