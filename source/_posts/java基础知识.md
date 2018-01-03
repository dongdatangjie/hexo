---
title: java基础知识
date: 2016-10-18 22:11:50
tags:
 Java
---
***
### 1.数据存储位置
* 寄存器
* 堆栈：对象的句柄存储在堆栈中，但是java对象不在
* 堆：对象存储在堆中
* 静态存储：java的static变量存储
* 常数存储：java的常量存储
* 非RAM存储
### 2.java的基本数据类型
<!--more-->
|类型|大小|封装器类型|
| -------- |--------|--------|
| boolean  | 1 位 |Boolean|
| char|   16位 |  Character|
| byte|8位|Byte|     
| short|16位|Short      |
| int|32位|Integer|
| long |64位|Long|
| float |32位|Float|
| double|64位|Double|
### 3.static关键词
<<java编程思想》中：
>“static方法就是没有this的方法。在static方法内部不能调用非静态方法，反过来是可以的。而且可以在没有创建任何对象的前提下，仅仅通过类本身来调用static方法。这实际上正是static方法的主要用途。”

**static就是在类加载的过程中不需要创建对象引用它，只需要在类之后引用就可以。**
#### (1)static变量，方法
```java
Class M{
	private static int x;
	private int y;
	private void print(){
		System.out.println(x);
		System.out.println(y);
	}
	private static void print2(){
		System.out.println(x);
		//System.out.println(y);
	}
}
```
**上述代码中注释部分在编译时会发生错误，因为在非静态方法中可以调用静态变量，但是在静态方法中无法调用非静态变量。**
### (2)static代码块
```java
public class Test5 {    
	private static int a;    
	private int b;   
	static{    
		Test5.a=3;    
		System.out.println(a);    
		Test5 t=new Test5();    
		t.f();    
		t.b=1000;    
		System.out.println(t.b);    
	}    
	static{    
		Test5.a=4;    
		System.out.println(a);    
	}    
	public static void main(String[] args) {    
	// TODO 自动生成方法存根    
	}    
	static{    
		Test5.a=5;    
		System.out.println(a);    
	}    
	public void f(){    
		System.out.println("hhahhahah");    
	}    
}
```
**代码的输出结果**
```java
3 
hhahhahah 
1000 
4 
5
```