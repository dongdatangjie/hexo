---
title: 散列表的实现原理
date: 2016-10-31 22:22:59

tags: 数据结构
---

***
### 1 散列表的特点
**散列表分为两种，第一种key和value的值相同，即为Set(集合)，第二种key和value的值不一样，这种情况称为Map，即为键值对集合**
**根据其存储结构，它的特点为：**
* 访问速度快
* 需要额外的空间
* 无序
* 可能产生碰撞
<!--more-->
### 2 散列表的存储结构

### 3 散列表的Java实现
**Entry对象类**
```java
package com.tangjie.hashtable;

public class Entry {
	int key;
	int value;
	Entry next;
	public Entry(int key,int value,Entry next){
		super();
		this.key=key;
		this.value=value;
		this.next=next;
	}
}

```
**HashTable类**
```java
package com.tangjie.hashtable;

public class HashTable {
	/**
	 * 设置散列表hashtable的初始长度
	 */
	public static final int DEFAULT_INITIAL_CAPACITY=4;
	/**
	 * 扩容因子
	 */
	public static final float FLOAT_FACTOR=0.75f;
	/**
	 * hashtable数组
	 */
	public Entry[] table=new Entry[DEFAULT_INITIAL_CAPACITY];
	public int size=0;//hashtable数组元素的个数
	public int use=0;//使用地址个数
	
	public void put(int key,int value){
		int index=hash(key);
		if(table[index]==null){
			table[index]=new Entry(-1,-1,null);
		}
		Entry e=table[index];
		if(e.next==null){
			table[index].next=new Entry(key,value,null);
			size++;
			use++;
			//不存在值说明未用过的地址，需要判断是否需要扩容
			if(use>=table.length*FLOAT_FACTOR){
				resize();
			}
		}else{
			//本身已经存在，修改已有的值
			for(e=e.next;e!=null;e=e.next){
				int k=e.key;
				if(k==key){
					e.value=value;
					return;
				}
			}
			//不存在相同的值，直接向链表中添加元素
			Entry temp=table[index].next;
			Entry newEntry=new Entry(key,value,temp);
			table[index].next=newEntry;
			size++;
		}
	}
	/**
	 * 删除
	 * @param key
	 */
	public void remove(int key){
		int index=hash(key);
		Entry e=table[index];
		Entry pre=table[index];
		if(e!=null&&e.next!=null){
			for(e=e.next;e!=null;pre=e,e=e.next){
				int k=e.key;
				if(k==key){
					pre.next=e.next;
					size--;
					return;
				}
			}
			
		}
	}
	/**获取
	 * @param key
	 * @return
	 */
	public int get(int key){
		int index=hash(key);
		Entry e=table[index];
		if(e!=null&&e.next!=null){
			for(e=e.next;e!=null;e=e.next){
				int k=e.key;
				if(k==key){
					return e.value;
				}
			}
		}
		//如果没有找到，则返回-1
		return -1;
	}
	/**
	 * 获取散列表中元素个数
	 * @return
	 */
	public int size(){
		return size;
	}
	/**
	 * 确定扩容数组的长度
	 * @return
	 */
	public int getLength(){
		return table.length;
	}
	
	/**
	 * 根据key,通过哈希函数获取位于散列表数组中的那个位置
	 * @param key
	 * @return
	 */
	private int hash(int key){
		return key%table.length;
	}
	/**
	 * 扩容
	 */
	public void resize(){
		int newLength=table.length*2;
		Entry[] oldTable=table;
		table=new Entry[newLength];
		use=0;
		for(int i=0;i<oldTable.length;i++){
			if(oldTable[i]!=null&&oldTable[i].next!=null){
				Entry e=oldTable[i];
				while(null!=e.next){
					Entry next=e.next;
					//重新计算hash值，放入新地址中
					int index=hash(next.key);
					if(table[index]==null){
						use++;
						table[index]=new Entry(-1,-1,null);
					}
					Entry temp=table[index].next;
					Entry newEntry=new Entry(next.key,next.value,temp);
					table[index].next=newEntry;
					e=next;
				}
			}
		}
	}
}

```

