---
title: java集合框架
date: 2016-12-04 19:51:48
tags: [Java,数据结构]
---
***
**java之前并没有集合框架的概念，只有java数据结构，包含枚举，位集合，向量，栈，字典，哈希表和属性。之后形成了java的集合框架主要用来存放数据，被称为容器。**
## 1.java集合框架图
![java集合框图](http://ofhbt8uhx.bkt.clouddn.com/20160918105654_491.gif)
**Java集合框架主要包括两种类型的容器，一种是集合（Collection），存储一个元素集合，另一种是图（Map），存储键/值对映射。Collection接口又有3种子类型，List、Set和Queue，再下面是一些抽象类，最后是具体实现类，常用的有ArrayList、LinkedList、HashSet、LinkedHashSet、HashMap、LinkedHashMap等等。**
>在介绍集合之前先复习一下栈，队列和链表<!--more-->

### 1.1 栈
**栈是一种特殊的数据结构，最大的特点是后进先出（LIFO），主要有两个操作入栈（push）和出栈(pop)**
#### 1.1.1 数组实现栈的存储方式
```java
import java.util.Arrays;

/**
 * 栈的数组实现类
 * @author Administrator
 *
 */
public class Stack {
	private int size=0;//初始化栈的大小
	
	private int[] array;//初始化模拟栈的数组
	
	/*
	 * 默认构造函数
	 */
	public Stack(){
		this(10);
	}
	/*
	 * 初始化数组大小为10
	 */
	public Stack(int init){
		if(init<=0){
			init=10;
		}
		array=new int[init];
	}
	
	/*
	 *入栈操作 
	 */
	public void push(int item){
		if(size==array.length){
			array=Arrays.copyOf(array, size*2);//拷贝数组，扩大长度
		}
		array[size++]=item;
	}
	/*
	 * 获取栈顶元素
	 */
	public int peek(){
		if(size==0){
			throw new IndexOutOfBoundsException("栈中已无元素");
		}
		return array[size-1];
	}
	
	/*
	 * 出栈
	 */
	public int pop(){
		int item=peek();
		size--;
		return item;
	}
}

```
####  1.1.2 栈的适用范围
* 逆序输出
* 语法检查
**逆序输出应该很简单，我们来试试语法检查吧！**
>曾经我参加远景能源的电话面试时，面试官给我出了一道面试题来考察我的临场思维能力，然后我很惨的撞到在了这个枪口上。题目是这样的，我现在有一段由字母组成的字符串，我想找到所有以abc组合的字符串所在的位置。

```java
import java.util.ArrayList;
import java.util.List;

public class StrMatch {
	//字母的字符数组
	public static char c[]=new char[]{'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'};
	/*
	 * 通过字符数组随机20位的字符串
	 */
	public static String StrRandom(){
		StringBuffer sb=new StringBuffer();
		for(int i=0;i<100;i++){
			int Index=(int) Math.floor(Math.random()*26);
			sb.append(c[Index]);
		}
		return sb.toString();
	}
	//static String str=StrRandom();
	static String str="muexkkabcciqarhvqbpibhxacbyiqdhurxggyojbmglcnwmcunmzjtqprijwdjyzizgbtexydvczxfcnyzvkhsraydgidabjrhqji";
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		System.out.println(str);

		List<Integer> item=new ArrayList<Integer>();
		while(true){
			int i=-1;
			if(i==-1){
				i=str.indexOf("abc");
			}
			if(i==-1){
				i=str.indexOf("acb");
			}
			if(i==-1){
				i=str.indexOf("bca");
			}
			if(i==-1){
				i=str.indexOf("bac");
			}
			if(i==-1){
				i=str.indexOf("cab");
			}
			if(i==-1){
				i=str.indexOf("cba");
			}
			System.out.println(i);
			if(i!=-1){
				System.out.println(str.substring(i,i+3));
			}
			if(i==-1||(i+3)>str.length()){
				break;
			}
			str=str.substring(i+3, str.length());
			item.add(i);
		}
		for (Integer integer : item) {
			System.out.println("位置");
			System.out.println(integer);
		}
		
	}

}


```
>输出结果

```java
muexkkabcciqarhvqbpibhxacbyiqdhurxggyojbmglcnwmcunmzjtqprijwdjyzizgbtexydvczxfcnyzvkhsraydgidabjrhqji
6
abc
14
acb
-1
位置
6
位置
14
```
### 1.2 队列
**队列其实很容易理解呀，就像排队买鸡蛋一样，买完就滚蛋呗，队列的特征和栈刚好相反，先进先出（FIFO）。**
#### 1.2.1 队列的数组实现方式
```java
/**
 * 队列的数组实现
 * @author Administrator
 *
 */
public class ArrayQueue {
	private Object[] items;
	private int head=0;
	private int tail=0;
	/*
	 *初始化队列
	 */
	public ArrayQueue(int capcity){
		this.items=new Object[capcity];
	}
	/*
	 * 入队
	 */
	public boolean put(Object item){
		if(head==(tail+1)%items.length){
			//说明队列已满
			return false;
		}
		items[tail]=item;
		tail=(tail+1)%items.length;
		return true;
	}
	/*
	 * 获取列头元素，不出队
	 */
	public Object peek(){
		if(head==tail){
			//说明队列为空
			return null;	
		}
		return items[head];
		
	}
	/*
	 * 出队
	 */
	public Object poll(){
		if(head==tail){
			//说明队列为空
			return null;
		}
		Object item=items[head];
		items[head]=null;
		head=(head+1)%items.length;
		return item;
	}
}

```
### 1.3 链表问题太多，我们改日再聊
## 2.collection接口
**Collection接口有三个子接口，下面详细介绍。**
### 2.1 List
**List包含ArrayList和LinkedList,他们的区别在于实现的方式不同，所以对数据进行不同操作时的效率不同。实际使用中我们需要根据特定的需求选用合适的类，如果除了在末尾外不能在其他位置插入或者删除元素，那么ArrayList效率更高，如果需要经常插入或者删除元素，就选择LinkedList**
### 2.2 Set
**Set接口有三个具体实现类，分别是散列集HashSet、链式散列集LinkedHashSet和树形集TreeSet。**
>散列集HashSet是一个用于实现Set接口的具体类，可以使用它的无参构造方法来创建空的散列集，也可以由一个现有的集合创建散列集。在散列集中，有两个名词需要关注，初始容量和客座率。客座率是确定在增加规则集之前，该规则集的饱满程度，当元素个数超过了容量与客座率的乘积时，容量就会自动翻倍。
>LinkedHashSet是用一个链表实现来扩展HashSet类，它支持对规则集内的元素排序。HashSet中的元素是没有被排序的，而LinkedHashSet中的元素可以按照它们插入规则集的顺序提取。
>TreeSet扩展自AbstractSet，并实现了NavigableSet，AbstractSet扩展自AbstractCollection，树形集是一个有序的Set，其底层是一颗树，这样就能从Set里面提取一个有序序列了。在实例化TreeSet时，我们可以给TreeSet指定一个比较器Comparator来指定树形集中的元素顺序。树形集中提供了很多便捷的方法。

### 2.3 Queue(如上所述)
## 3. Map接口
**Map接口常用的有三个具体实现类，分别是HashMap、LinkedHashMap、TreeMap。**

**没啥好说的大家都懂！**

