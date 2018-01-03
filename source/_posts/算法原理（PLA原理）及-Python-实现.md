---
title: 算法原理（PLA原理）及 Python 实现
date: 2017-06-13 20:54:45

tags: 机器学习
---

***
>感知机是二类分类的线性分类模型，其输入为实例的特征向量，输出为实例的类别，取+1和-1。

<div align=center>
![](http://ofhbt8uhx.bkt.clouddn.com/20170312094333631.png)
</div>

## 感知机的数学表示
**首先，感知机的输入空间（特征空间）为 $x \subseteq R^{n}$，即 n 维向量空间，输出空间为 Y={+1,−1}，即 −1 代表反例，+1 代表正例。例如：输入 $x \in X$ 对应于输入空间 Rn 中的某个点，而输出 $y \in Y$ 表示该点所在的分类。需要注意的是，输入 x 是一个 n 维的向量，即 x=(x(1),x(2),...,x(n))。现在已经有了输入和输出的定义，我们就可以给出感知机 f(x) 的模型了： **
$$f(x) = \ sign(\omega \cdot x+b)$$
**其中，向量 ω=(ω(1),ω(2),...,ω(n)) 中的每个分量代表输入向量空间 $R^{n}$ 中每个分量 $x_i$的权重，或者说参数。$b \in R$称为偏置单元，ω⋅x 表示 ω 和 x的内积，sign 是一个符号函数，即： **
<div align="center">
![](http://ofhbt8uhx.bkt.clouddn.com/%E6%8D%95%E8%8E%B7.PNG)
</div>

**我们把上面这个函数 f(x) 称为感知机。**
<!--more-->
## PLA原理
**PLA 的原理很简单，开始时，我们令 ω=b=0，然后在训练数据 D 中任意选择一点，如果该点被错误分类了，那么我们就调整分类的直线或者超平面使该点能够被正确分类。**

**在说明 PLA 原理之前，我们先来回顾一下向量的内积（inner product）。例如有向量 a=(a(1),a(2),...,a(n)),b=(b(1),b(2),...,b(n))，则它们的内积为： **
$$a \cdot b=\sum_{i=1}^{n} a^{(i)}b^{i}=\Arrowvert a \Arrowvert \cdot \Arrowvert b \Arrowvert \cdot \cos \theta$$
**在纸上画画就明白，当内积为负数时，两个向量的夹角 θ 大于 90°；当内积为正数时，两个向量的夹角 θ 小于 90°；当内积为 0 时，两个向量垂直。**
**方程 ω⋅x+b=0 代表了一个平面。我们不妨将其改写为$\hat{\omega} \cdot \hat{x} =0$ ，其中： **
$$\hat{\omega}=(b,\omega)=(\omega^{0},\omega)=(\omega^{(0)},\omega^{(1)},\omega^{(2)},...,\omega^{(n)}) $$
$$\hat{x}=(1,x)=(1,x^{(1)},x^{(2)},...,x^{(n)}) $$
**我们的目的就是求得超平面的法向量 ω^， 使超平面能够完美地划分数据集。**

**具体怎么求呢，我们采用随机梯度下降法，即随意找一个点，如果分类错误，我们就更新 $\hat{\omega}$：**
- **输入数据 $D=(x_1,y_1),(x_2,y_2),...,(x_m,y_m)$，其中 $x_i\in X\subset R_n$，$y\in Y={+1,−1}，i=1,2,...,n$。**
- **选取初值 $\hat{\omega}_0= 0$，即设为零向量。**
- **遍历 $D$ 中的数据，如果遇到某个样本$ (x_i,y_i)$ 使得 $y_i(\hat{\omega}\cdot x)\leq 0$，即目前分类输出和真实分类不同，则**
$$\hat{\omega}\leftarrow \hat{\omega_0}+y_i\hat{x}_i$$
- $\hat{\omega}$ 更新后，回到第三步，重新开始遍历，如果遍历完整个数据集 $D$ 都未有更新操作（没有错误分类点），则转第五步。
- 输出当前超平面的法向量 $\hat{\omega}$。

**最后程序输出的 $\hat{\omega}$ 即为我们要找的能够完美划分数据集的超平面的法向量。**
## python 代码
```python
#coding:utf-8
'''
Created on 2017年6月13日
感知器算法
@author: 唐杰
'''
from numpy import *
import matplotlib.pyplot as plt
import matplotlib
myfont = matplotlib.font_manager.FontProperties(fname=r'F:/Anaconda3/envs/tensorflow/Lib/site-packages/matplotlib/mpl-data/fonts/ttf/msyh.ttc')

'''
weights [2,3] numLines 5为例
下面方法随机产生线性可分的数据集
'''
def makeLinearSeparableDeta(weights,numLines):#weights [2,3]
    w=array(weights)#用来产生分类直线的法向量[2,3]，列表转换为数组
    numFeatures=len(weights)#法向量的特征数，在几维空间
    dataSet=zeros((numLines,numFeatures+1))#创建5*3的数据集
    for i in range(numLines):
        x = random.rand(1, numFeatures) * 20 - 10#创建一个1*2的矩阵，元素范围在-10~10
        innerProduct = sum(w * x)#法向量与随机点进行内积判断正负，从而分类
        if innerProduct <= 0:
            dataSet[i] = append(x, -1)
        else:
            dataSet[i] = append(x, 1)
    return dataSet

'''
数据可视化
'''
def plotdata(dataSet):
    ax=plt.subplot(111)
    plt.title('线性可分数据集',fontproperties=myfont, fontsize=19)
    plt.xlabel('X')
    plt.ylabel('Y')
    labels = array(dataSet[:,2])#分类标签
    idx_1 = where(dataSet[:,2]==1)#找到正例行的下标
    p1 = ax.scatter(dataSet[idx_1,0], dataSet[idx_1,1], marker='o', color='g', label=1, s=20)
    idx_2 = where(dataSet[:,2]==-1)
    p2 = ax.scatter(dataSet[idx_2,0], dataSet[idx_2,1], marker='x', color='r', label=2, s=20)
    plt.legend(loc = 'upper right')
    plt.show()

'''
训练感知机
'''  
def train(dataSet,plot=False):
    numLines=dataSet.shape[0]#返回数组第一维的个数
    numFeatures = dataSet.shape[1]
    w = zeros((1, numFeatures - 1))         # initialize weights
    separated = False
    
    i = 0;
    #下面的方法是梯度下降法
    #判断y*(w*x) 如果<=0 w=w+y*x
    while not separated and i < numLines:
        if dataSet[i][-1] * sum(w * dataSet[i,0:-1]) <= 0:
            w = w + dataSet[i][-1] * dataSet[i,0:-1]
            separated = False
            i = 0;
        else:
            i += 1       
    if plot == True:
        import matplotlib.pyplot as plt
        from matplotlib.lines import Line2D
        fig = plt.figure()
        ax = fig.add_subplot(111)
        ax.set_title('Linear separable data set')
        plt.xlabel('X')
        plt.ylabel('Y')
        labels = array(dataSet[:,2])
        idx_1 = where(dataSet[:,2]==1)
        p1 = ax.scatter(dataSet[idx_1,0], dataSet[idx_1,1], 
            marker='o', color='g', label=1, s=20)
        idx_2 = where(dataSet[:,2]==-1)
        p2 = ax.scatter(dataSet[idx_2,0], dataSet[idx_2,1], 
            marker='x', color='r', label=2, s=20)
#        x = w[0][0] / abs(w[0][0]) * 10
#        y = w[0][1] / abs(w[0][0]) * 10
#        ann = ax.annotate("",xy=(x,y),xytext=(0,0),size=20, arrowprops=dict(arrowstyle="-|>"))
        ys = (-12 * (-w[0][0]) / w[0][1], 12 * (-w[0][0]) / w[0][1])
        ax.add_line(Line2D((-12, 12), ys, linewidth=1, color='blue'))
        plt.legend(loc = 'upper right')
        plt.show()
          
    return w     
    
if __name__ == '__main__':
    #x=makeLinearSeparableDeta([2,3],5)
    x=makeLinearSeparableDeta([2,3],80)
    print(x)
    plotdata(x)
    train(x,True)
```
**以上代码得到的结果为：**
<div align=center>
![](http://ofhbt8uhx.bkt.clouddn.com/Figure_1.png)
</div>
<div align=center>
![](http://ofhbt8uhx.bkt.clouddn.com/Figure_1-1.png)
</div>
## 利用lris数据集的python 代码
```python
#coding:utf-8
'''
Created on 2017年6月13日
感知器算法 实现2
@author: 唐杰
'''
import numpy as np
class Perceptron(object):
    #eta表示学习率0~0.1之间  n_iter迭代次数
    def __init__(self, eta=0.01, n_iter=10):
        self.eta = eta
        self.n_iter = n_iter
    #X训练数据集[samples,features] Y目标值[samples]   
    def fit(self, X, y):
        self.w_ = np.zeros(1 + X.shape[1]) # 权重
        self.errors_=[]
        for _ in range(self.n_iter):
            errors = 0
            for xi, target in zip(X, y):#zip函数接受任意多个（包括0个和1个）序列作为参数，返回一个tuple列表
                update = self.eta * (target - self.predict(xi))
                self.w_[1:] += update * xi
                self.w_[0] += update
                errors += int(update != 0.0)
            self.errors_.append(errors)
        return self
    def net_input(self,X):
        return np.dot(X,self.w_[1:])+self.w_[0]
    def predict(self,X):
        return np.where(self.net_input(X)>=0.0,1,-1)
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from numpy import *
from matplotlib.colors import ListedColormap
def plot_decision_region(X,y,classifier,resolution=0.02):
    markers=('s','x','o','^','v')
    colors=('red','blue','lightgreen','gray','cyan')
    cmap=ListedColormap(colors[:len(np.unique(y))])
    
    x1_min,x1_max=X[:,0].min()-1,X[:,0].max()+1
    x2_min,x2_max=X[:,1].min()-1,X[:,1].max()+1
    
    xx1,xx2=np.meshgrid(np.arange(x1_min,x1_max,resolution),
                        np.arange(x2_min,x2_max,resolution))
    Z=classifier.predict(np.array([xx1.ravel(),xx2.ravel()]).T)
    Z=Z.reshape(xx1.shape)
    
    plt.contourf(xx1,xx2,Z,alpha=0.4,cmap=cmap)
    plt.xlim(xx1.min(),xx1.max())
    plt.ylim(xx2.min(),xx2.max())
    
    for idx,cl in enumerate(np.unique(y)):
        plt.scatter(x=X[y==cl,0], y=X[y==cl,1], alpha=0.8, c=cmap(idx), marker=markers[idx], label=cl)
    

if __name__ == '__main__':  
    #pandas读取csv文件，header=none表示原始文件没有列索引需要自己加上  
    df=pd.read_csv('http://archive.ics.uci.edu/ml/machine-learning-databases/iris/iris.data',header=None)
    #print(df.tail())#显示后五条的记录
    y=df.iloc[0:100,4].values#类别标记
    y=np.where(y=='Iris-setosa',-1,1)
    X=df.iloc[0:100,[0,2]].values
    idx_1 = where(y[:]==-1)
    idx_2 = where(y[:]==1)
    plt.figure()
    plt.subplot(2,2,1)
    plt.scatter(X[idx_1,0], X[idx_1,1],color='r',marker='o',label='setosa')
    plt.scatter(X[idx_2,0], X[idx_2,1],color='b',marker='x',label='versicolor')
    plt.xlabel('petal length')
    plt.ylabel('sepal length')
    plt.legend(loc='upper left')
    #plt.show()
    plt.subplot(2,2,2)
    ppn=Perceptron(eta=0.1,n_iter=10)
    ppn.fit(X, y)
    print(ppn.errors_)
    plt.plot(range(1,len(ppn.errors_)+1),ppn.errors_,marker='o')
    plt.xlabel('Epoches')
    plt.ylabel('Number of misclassifications')
    #plt.show()
    plt.subplot(2,2,3)
    plot_decision_region(X,y,classifier=ppn)
    plt.xlabel('sepal length')
    plt.ylabel('petal length')
    plt.legend(loc='upper left')
    plt.show()
```
**以上代码得到的结果为：**
<div align=center>
![](http://ofhbt8uhx.bkt.clouddn.com/Figure_21.png)
</div>
