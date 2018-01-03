---
title: ' Scikit-learn之旅（2）'
date: 2017-06-21 20:36:01
tags: 机器学习
---
***
### 支持向量机(SVM)
**SVM是一个由分类超平面定义的判别分类器。也就是说给定一组带标签的训练样本，算法将会输出一个最优超平面对新样本(测试样本)进行分类。在SVM中，我们的优化目标是最大化间隔(margin)。间隔定义为两个分隔超平面(决策界)的距离，那些最靠近超平面的训练样本也被称为支持向量(suppor vectors)**
![](http://ofhbt8uhx.bkt.clouddn.com/svm1.PNG)
>在介绍如何推到之前，了解一个定义：
> - **分隔超平面：**上述将数据集分割开来的直线叫做分隔超平面。
> - **超平面：**如果数据集是N维的，那么就需要N-1维的某对象来对数据进行分割。该对象叫做超平面，也就是分类的决策边界。
> - **间隔：**一个点到分割面的距离，称为点相对于分割面的距离。数据集中所有的点到分割面的最小间隔的2倍，称为分类器或数据集的间隔。
> - **最大间隔：**SVM分类器是要找最大的数据集间隔。
> - **支持向量：**离分割超平面最近的那些点。
<!--more-->
### 最大间隔
**最大化决策界的间隔，这么做的原因是间隔大的决策界趋向于含有更小的泛化误差，而间隔小的决策界更容易过拟合。为了更好地理解间隔最大化，我们先认识一下那些和决策界平行的正超平面和负超平面，他们可以表示为：**
$$\omega_0+ \omega^{T}x_p=1 \qquad (1)$$
$$\omega_0+ \omega^{T}x_n=-1 \qquad(2)$$

**用(1)减去(2)，得到：**
$$\Rightarrow \omega^{T}(x_p-x_n)=2$$

**对上式进行归一化，**
$$\frac{\omega^{T}(x_p-x_n)}{\parallel\omega\parallel}=\frac{2}{\parallel\omega\parallel}$$

**其中，$\parallel\omega\parallel=\sqrt{\sum_{j=1}^{m}\omega_j^{2}}$**
**上式等号左边可以解释为正超平面和负超平面之间的距离，也就是所谓的间隔。**
**现在SVM的目标函数变成了最大化间隔 ,限制条件是样本被正确分类，可以写成：**
$$\omega_0+\omega^{T}x^{(i)}\ge1\qquad y^{(i)}=1$$
$$\omega_0+\omega^{T}x^{(i)}<-1\qquad y^{(i)}=-1$$
**上面两个限制条件说的是所有负样本要落在负超平面那一侧，所有正样本要落在正超平面那侧。我们用更简洁的写法代替：**
$$y^{(i)}(\omega_0+\omega^{T}x^{(i)})\ge1\qquad \forall_i$$
### 使用松弛变量解决非线性可分的情况
**引入松弛变量的动机是原来的线性限制条件在面对非线性可分数据时需要松弛，这样才能保证算法收敛。**
**松弛变量值为正，添加到线性限制条件即可:**
$$\omega^{T}x^{(i)}\ge1\qquad y^{(i)}=1-\zeta^{(i)}$$
$$\omega^{T}x^{(i)}<-1\qquad y^{(i)}=1+\zeta^{(i)}$$
**新的目标函数变成了:**
$$\frac{1}{2}\parallel\omega\parallel^{2}+C(\sum_{i}\zeta^{(i)})$$
**使用变量C，我们可以控制错分类的惩罚量。和逻辑斯蒂回归不同，这里C越大，对于错分类的惩罚越大。可以通过C控制间隔的宽度，在bias-variance之间找到某种平衡：**
![](http://ofhbt8uhx.bkt.clouddn.com/svm2.PNG)
**这个概念和正则化相关，如果增大C的值会增加bias而减小模型的方差。**
**代码如下：**
```python
#coding:utf-8
'''
Created on 2017年6月16日
SVM
@author: 唐杰
'''
from sklearn.svm import SVC
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
    svm=SVC(kernel='linear',C=1.0,random_state=0)
    svm.fit(X_train_std,y_train)
    Util.plot_decision_region(X_combined_std, y_combined, classifier=svm)
    plt.xlabel('petal length [standardized]')
    plt.ylabel('sepal length [standardized]')
    plt.legend(loc='upper left')
    plt.show()
```
**运行结果如下：**
![](http://ofhbt8uhx.bkt.clouddn.com/svm3.png)
### 使用核SVM解决非线性
>**SVM之所以受欢迎度这么高，另一个重要的原因是它很容易核化(kernelized)，能够解决非线性分类问题**

**使用下面的代码，我们将创造一个简单的数据集，其中100个样本是正类，100个样本是负类。**
```python
	np.random.seed(0)#保证每次生成的随机数相同
    X_xor=np.random.randn(200,2)
    y_xor=np.logical_xor(X_xor[:,0]>0,X_xor[:,1]>0)#异或函数 符号不同为true
    y_xor=np.where(y_xor,1,-1)
    plt.scatter(X_xor[y_xor==1,0],X_xor[y_xor==1,1],c='b',marker='x',label='1') 
    plt.scatter(X_xor[y_xor==-1,0],X_xor[y_xor==-1,1],c='r',marker='s',label='-1')
    plt.ylim(-3.0)
    plt.legend()
    plt.show()
```
**实现效果：**
![](http://ofhbt8uhx.bkt.clouddn.com/kernel1.png)
**核方法的idea是为了解决线性不可分数据，在原来特征基础上创造出非线性的组合，然后利用映射函数 将现有特征维度映射到更高维的特征空间，并且这个高维度特征空间能够使得原来线性不可分数据变成了线性可分的**
**常用的一个核函数是Radial Basis Function kernel(RBF核)，也称为高斯核:**
$$k(x^{(i)},x^{(j)})=exp(-\frac{\parallel x^{(i)}-x^{(j)}\parallel^{2}}{2\sigma^{2}})$$
**通俗地讲，核(kernel)可以被解释为两个样本之间的相似形函数。高斯核中e的指数范围<=0,当两个样本完全一样时，值为1，两个样本完全不同时，值为0**
```python
	svm=SVC(kernel='rbf',C=10.0,gamma=1.0,random_state=0)
    svm.fit(X_xor,y_xor)
    Util.plot_decision_region(X_xor, y_xor, classifier=svm)
    plt.legend(loc='upper left')
    plt.show()
```
![](http://ofhbt8uhx.bkt.clouddn.com/kernel2.png)
### 决策树
```python
#coding:utf-8
'''
Created on 2017年6月16日
决策树分类算法
@author: 唐杰
'''
from sklearn.tree import DecisionTreeClassifier
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
    tree=DecisionTreeClassifier(criterion='entropy',max_depth=3,random_state=0)
    tree.fit(X_train_std,y_train)
    Util.plot_decision_region(X_combined_std, y_combined, classifier=tree)
    plt.xlabel('petal length [standardized]')
    plt.ylabel('sepal length [standardized]')
    plt.legend(loc='upper left')
    plt.show()
```
![](http://ofhbt8uhx.bkt.clouddn.com/tree1.png)
### 随机森林
### K邻近

