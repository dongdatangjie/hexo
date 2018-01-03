---
title: python机器学习之旅
date: 2017-06-22 22:35:37tags:机器学习
---


***
![](http://ofhbt8uhx.bkt.clouddn.com/python%E6%9C%BA%E5%99%A8%E5%AD%A6%E4%B9%A0%E4%B9%8B%E6%97%85.png)
<!--more-->
## 数据集分割为训练集和测试集
```python
#使用新数据集Wine    
df_wine=pd.read_csv('http://archive.ics.uci.edu/ml/machine-learning-databases/wine/wine.data',header=None)
df_wine.columns = ['Class label', 'Alcohol', 'Malic acid', 'Ash', 'Alcalinity of ash', 'Magnesium', 'Total phenols', 'Flavanoids', 'Nonflavanoid phenols', 'Proanthocyanins', 'Color intensity', 'Hue', 'OD280/OD315 of diluted wines', 'Proline']
#特征矩阵赋值给X，将类别向量赋值给y
X,y=df_wine.iloc[:,1:].values,df_wine.iloc[:,0].values	
#调用train_test_split方法随机分割X和y。通过设置test_size=0.3,使得训练集占Wine样本数的70%，测试集占30%
X_train,X_test,y_train,y_test=train_test_split(X,y,test_size=0.3,random_state=0)	  											
```
## 统一特征取值范围 
### 归一化
- **介绍：将特征范围缩放到[0,1]，是最小-最大缩放(min-max scaling)的特例  **
- **计算公式：**
$$x^{(i)}_n=\frac{x^{(i)}-x_i}{x_a-x_i}$$

```python
	#归一化处理
    from sklearn.preprocessing import MinMaxScaler
    #sklearn中实现了最小-最大缩放，调用MinMaxScaler类即可：
    mms=MinMaxScaler()
    X_train_norm=mms.fit_transform(X_train)
    X_test_norm=mms.fit_transform(X_test)
```
### 标准化
- **介绍：实用标准化，我们能将特征值缩放到以0为中心，标准差为1，换句话说，标准化后的特征形式服从正态分布，这样学习权重参数更容易。此外，标准化后的数据保持了异常值中的有用信息，使得算法对异常值不太敏感，这一点归一化就无法保证。**
- **计算公式：**
$$x^{(i)}_{std}=\frac{x^{(i)}-\mu_x}{\sigma_x}$$
```python
	 #标准化处理
     from sklearn.preprocessing import StandardScaler
     stdsc=StandardScaler()
     X_train_std=stdsc.fit_transform(X_train)
     X_test_std=stdsc.fit_transform(X_test)
```
## 选择有意义的特征
### 模型过拟合的解决方法
- **收集更多的训练集数据**
- **正则化，即引入模型复杂度的惩罚项**
- **选择一个简单点的模型，参数少一点的**
- **降低数据的维度**
### 正则化
- **L1正则：**
![](http://ofhbt8uhx.bkt.clouddn.com/%E8%BF%99.PNG)
- **L2正则：**
![](http://ofhbt8uhx.bkt.clouddn.com/z1.PNG)
```python
#正则化的使用
    #将L1正则逻辑斯蒂回归应用到标准化后的Wine数据集：
    from sklearn.linear_model import LogisticRegression
    #支持l1正则模型
    lr=LogisticRegression(penalty='l1',C=0.1)
    lr.fit(X_train_std, y_train)
    print('Training accuracy: %s' % lr.score(X_train_std, y_train))
    print('Testing accuracy: %s' % lr.score(X_test_std, y_test))
    print(lr.intercept_)#权重参数
    print(lr.coef_)#权重数组
    #Training accuracy: 0.983870967742
    #Testing accuracy: 0.981481481481
```
```python
#画出正则路径，即不同正则威力下的不同特征的权重参数：
    import matplotlib.pyplot as plt
    import numpy as np
    fig=plt.figure()
    #fig.set_size_inches(18.5, 10.5)
    ax=plt.subplot(111)
    colors=['blue','green','red','cyan','magenta','yellow','black','pink','lightgreen','lightblue','gray','indigo','orange']
    weigths,params=[],[]#权重参数和C
    for c in np.arange(-4,6):
        lr=LogisticRegression(penalty='l1',C=10**float(c),random_state=0)
        lr.fit(X_train_std, y_train)
        weigths.append(lr.coef_[1])
        params.append(10**float(c))
    weigths=np.array(weigths)
    for column,color in zip(range(weigths.shape[1]),colors):
        plt.plot(params,weigths[:,column],label=df_wine.columns[column+1],color=color)
    plt.axhline(0, color='black',linestyle='--',linewidth=3)
    plt.xlim([10**(-5),10**5])
    plt.ylabel('weight corfficient')
    plt.xlabel('C')
    plt.xscale('log')
    plt.legend(loc='upper left')
    plt.legend(loc='upper center',bbox_to_anchor=(1.38,1.03),ncol=1,fancybox=True)    
    plt.show()
```
**我们画出正则路径，即不同正则威力下的不同特征的权重参数：**
![](http://ofhbt8uhx.bkt.clouddn.com/zhengze.png)
### 特征选取
#### 序列后向选择 （SBS）
**步骤：**
- **1 初始化k=d，其中d是原始特征维度。**  
- **2 确定那个评价函数最大的特征  **
- **3 从 中移除特征 , k=k-1。 **
- **4 如果k等于事先确定的阈值则终止；否则回到步骤2。   **
#### 随机森林评估特征重要性  
### 特征抽取
#### 主成分分析（principal component analysis, PCA), 用于无监督数据压缩 
**步骤：**
- **1 将d维度原始数据标准化。**
- **2 构建协方差矩阵。**
- **3 求解协方差矩阵的特征向量和特征值。**
- **4 选择值最大的k个特征值对应的特征向量，k就是新特征空间的维度，k<<d。**
- **5 利用k特征向量构建映射矩阵 。**
- **6 将原始d维度的数据集X，通过映射矩阵W转换到k维度的特征子空间。  **
#### 线性判别分析(linear discriminant analysis, LDA), 用于监督降维作为一种监督降维  
**步骤：**
- **1. 将d维度原始数据进行标准化.**
- **2. 对每一个类，计算d维度的平均向量.**
- **3. 构建类间(between-class)散点矩阵 和类内(within-class)散点矩阵 .**
- **4. 计算矩阵 的特征向量和特征值.**
- **5. 选择值最大的前k个特征值对应的特征向量，构建d*d维度的转换矩阵 ,每一个特征向量是 的一列.**
- **6. 使用矩阵 将原始数据集映射到新的特征子空间  **
#### PCA  
**步骤：**
- **1 计算核(相似)矩阵k，也就是计算任意两个训练样本：  **
- **2 对核矩阵K进行中心化处理：  **
- **3 计算特征值，取最大的k个特征值对应的特征向量。不同于标准PCA，这里的特征向量并不是主成分轴。  **
## 模型评估和调参
### 通过管道创建工作流
** 通过管道将StandardScaler,PCA和LogisticRegression连接起来**
```python
pipe_lr=Pipeline([('scl',StandardScaler()),('pca',PCA(n_componebts=2)),('clf',LogisticRegression(random_state=1))])
```
### k折交叉验证  
**步骤：**
- **第一步我们使用不重复抽样将原始数据随机分为k份  **
- **第二步 k-1份数据用于模型训练，剩下那一份数据用于测试模型  **
- **然后重复第二步k次，我们就得到了k个模型和他的评估结果  **
- **然后我们计算k折交叉验证结果的平均值作为参数/模型的性能评估  **
### 使用学习曲线判别偏差和方差问题
- **问题：模型偏差很大，表现为训练集和验证集的准确率低，有可能是欠拟合**
- **解决：增加模型参数，比如，构建更多的特征，减小正则项。  **
- **问题：模型方差很高，表现为训练集和验证集准确率相差太多，可能是过拟合问题 **
- **解决：增大训练集或者降低模型复杂度，比如增大正则项或者通过特征选择减少特征数**
### 用验证曲线解决过拟合和欠拟合
### 通过网格搜索调参   
**我们事先为每个参数设定一组值，然后穷举各种参数组合，找到最好的那一组  **
### 嵌套交叉验证  
## 集成多个分类器学习