---
title: Android Studio NDK及so文件开发
date: 2016-10-30 14:27:46
tags: Android
---

### 1.NDK是个啥
>NDK全称是Native Development Kit，NDK提供了一系列的工具，帮助开发者快速开发C(或C++)的动态库，并能自动将so和java应用一起打包成apk。NDK集成了交叉编译器(交叉编译器需要UNIX或LINUX系统环境)，并提供了相应的mk文件隔离CPU、平台、ABI等差异，开发人员只需要简单修改mk文件(指出“哪些文件需要编译”、“编译特性要求”等)，就可以创建出so。
<!--more-->
### 2.为啥要用NDK
* 代码的保护。由于apk的java层代码很容易被反编译，而C/C++库反汇难度较大。
* 可以方便地使用现存的开源库。大部分现存的开源库都是用C/C++代码编写的。
* 提高程序的执行效率。将要求高性能的应用逻辑使用C开发，从而提高应用程序的执行效率。
* 便于移植。用C/C++写得库可以方便在其他的嵌入式平台上再次使用。

### 3.JNI是个啥
**JNI的全称是Java Native Interface，它提供了若干的API实现了Java和其他语言的通信(主要是C和C++)。那为什么使用JNI呢？JNI的目的是使java方法能够调用c实现的一些函数。那么so又是啥呢？android中用到的so文件是一个c++的函数库。在android的JNI中，要先将相应的C语言打包成so库，然后导入到lib文件夹中供java调用。**

### 下面我们开始NDK开发
#### 1.NDK的环境配置
**去网上下载NDK，我用的是android-ndk-r10b**
![](http://ofhbt8uhx.bkt.clouddn.com/android-ndk.png)
**配置NDK的环境变量**
![](http://ofhbt8uhx.bkt.clouddn.com/path.png)
**Android Studio的NDK环境配置**
![](http://ofhbt8uhx.bkt.clouddn.com/an-.png)
**环境搭建成功**
![](http://ofhbt8uhx.bkt.clouddn.com/an_1.png)
#### 2.NDK的开发
##### 2.1 创建Android Studio项目,工程名位NdkStudy
##### 2.2 创建MathKit类
```java
package com.tangjie.ndkstudy.util;

/**
 * Created by Administrator on 2016/10/29.
 */
public class MathKit {
    public static native int square(int number);
    static {
        System.loadLibrary("JniDemo");
    }
}
```
##### 2.3 准备.h文件
进入`java`目录，进行javah操作
![](http://ofhbt8uhx.bkt.clouddn.com/an_2.png)
在	`java`下生成.h文件
![](http://ofhbt8uhx.bkt.clouddn.com/an_3.png)
##### 2.4 在java目录下新建jni文件夹，新建cpp文件，用来实现.h头文件的函数
**com_tangjie_ndkstudy_util_MathKit.cpp类**
```java
#include "MathKit.h"
JNIEXPORT jint JNICALL Java_com_tangjie_ndkstudy_util_MathKit_square
        (JNIEnv *env, jclass cls, jint num){
    return num*num;
}
```
##### 2.5 设置 APP 项目 build.gradle
![](http://ofhbt8uhx.bkt.clouddn.com/an_4.png)
##### 2.6 在MathKit.java中引用
```java
package com.tangjie.ndkstudy.util;

/**
 * Created by Administrator on 2016/10/29.
 */
public class MathKit {
    public static native int square(int number);
    static {
        System.loadLibrary("JniDemo");
    }
}

```
#### 3. .so文件生成
##### 3.1 编写Android.mk文件
**在jni目录下新建Android.mk(必须是这个名称Android.mk)文件，如下图所示：**
![](http://ofhbt8uhx.bkt.clouddn.com/an_5.png)
##### 3.2 编写Application.mk文件
**在根目录下新建Android.mk(必须是这个名称Android.mk)文件，如下图所示：**
![](http://ofhbt8uhx.bkt.clouddn.com/an_6.png)
##### 3.3 生成so文件
**在控制台中，进入到工程的jni目录下，然后输入ndk-build(如下所示)，不出问题即可编译成功。**
![](http://ofhbt8uhx.bkt.clouddn.com/an_7.png)
##### 3.4 在app的build.gradle的android节点下设置：
```java
sourceSets{
        main{
            jniLibs.srcDirs=['libs']
        }
    }
```
##### 3.5 使用so文件
```java
package com.tangjie.ndkstudy.util;

/**
 * Created by Administrator on 2016/10/29.
 */
public class MathKit {
    public static native int square(int number);
    static {
        System.loadLibrary("MathKit");
    }
}
```