---
title: ArrayList数组实现
date: 2016-10-23 22:38:40
tags: 数据结构
---

***
**我们使用集合的好处在于集合的他的优势是可以扩展的长度变化，无需我们开始设定数组的长度，但实际上的集合本质上也是有数组的数据结构所组成的。**
>下面我们就是用数组来来实现ArrayLIst的功能：
### 流程图
```flow
st=>start: 初始化集合
e=>end: 添加完成
op1=>operation: 添加元素
op2=>operation: 创建新数组
op3=>operation: 复制老数组元素到新数组
op4=>operation: 添加元素
cond=>condition: 内部数组长度是否足够长


st->op1->cond
cond(yes)->op4->e
cond(no)->op2->op3->op4
```
<!--more-->
***
### 实现代码
```java
import java.util.Arrays;

/**
 * 
 * @author Administrator
 * ArrayList的数组实现方式
 */  
public class ArrayList {
	//默认初始化数组的长度
	private static final int DEFAULT_SIZE=10;
	//可变数组的长度
	private int size=0;
	private int[] array;
	//默认初始化
	public ArrayList(){
		array=new int[DEFAULT_SIZE];
	}
	//自定义初始化
	public ArrayList(int Init){
		if(Init<=0){
			Init=DEFAULT_SIZE;
		}
		array=new int[Init]; 
	} 
	/**
	 * 添加元素
	 * @param num
	 */
	public void add(int num){
		if(size==array.length){
			array=Arrays.copyOf(array, size*2);
		}
		array[size++]=num;
	}
	/**
	 * 获取指定位置元素
	 * @param num
	 * @return 
	 * @throws Exception 
	 */
	public int get(int index){
		if(index>=size){
			throw new IndexOutOfBoundsException("下标超出了数组的最大下标！");
		}
		
		return array[index];
	}
	/**
	 * 设定指定位置的值
	 * @param index
	 * @return
	 */
	public int set(int index,int num){
		int oldnum=get(index);
		array[index]=num;
		return oldnum;
		
	}
	/**
	 * 获取变成数组的长度
	 * @return
	 */
	public int size(){
		return size;
	}
}
```
***
### 测试代码
```java
public class ArrayListTest {
	public static void main(String[] args) {
		//TODO Auto-generated method stub
		ArrayList arrayList=new ArrayList(1);
		arrayList.add(1);
		arrayList.add(2);
		arrayList.add(3);
		arrayList.add(4);
		arrayList.add(5);
		System.out.println(arrayList.get(3));
		arrayList.set(3, 9);
		System.out.println(arrayList.get(3));
		System.out.println(arrayList.size());
	}
}
```
***
### 测试结果
```java
4
9
5
```