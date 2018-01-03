---
title: Java链表
date: 2016-12-08 21:06:32

tags: [Java,数据结构]
---


***
### 1.java实现单向链表
<!--more-->
#### Node 类（节点类）
```java
/**
 * 链表的节点类
 * @author dongdatangjie
 *
 */
public class Node {
	private int data;
	private Node next;
	public int getData() {
		return data;
	}
	public void setData(int data) {
		this.data = data;
	}
	public Node getNext() {
		return next;
	}
	public void setNext(Node next) {
		this.next = next;
	}
	
}

```
#### Link 类 （链表实现类）
```java
/**
 * 单向链表
 * 
 * @author Administrator
 *
 */
public class Link {
	private int size = 0;// 链表长度
	private Node first;// 头节点
	private Node last;// 尾节点

	/**
	 * 链表初始化
	 */
	public Link() {
	}

	/**
	 * 当链表为空时插入新元素
	 * @param data
	 */
	private void fillStart(int data) {
		first = new Node();
		first.setData(data);
		last = first;
	}
	/**
	 * 只有一个元素时清空链表
	 */
	private void clear(){
		first=null;
		last=null;
		size=0;
	}
	/**
	 * 链表头部插入
	 * @param data
	 */
	public void addFirst(int data) {
		if(size==0){
			//初始化头尾元素
			fillStart(data);
		}else{
			Node node=new Node();
			node.setData(data);
			node.setNext(first);//把元素的下一个位置指向头元素
			first=node;//把元素指定为头元素
		}
		size++;
	}
	/**
	 * 链表尾部插入元素
	 * @param data
	 */
	public void addLast(int data){
		if(size==0){
			fillStart(data);
		}else{
			Node node=new Node();
			node.setData(data);
			last.setNext(node);
			last=node;
		}
		size++;
	}
	/**
	 * 获取指定下标元素
	 * @param index
	 * @return
	 */
	public Node get(int index){
		Node temp=first;
		for(int i=0;i<index;i++){
			temp=temp.getNext();
		}
		return temp;
	}
	/**
	 * 在链表指定位置后面插入元素
	 * @param data
	 * @param index
	 */
	public void add(int data,int index){
		if(size>index){
			if(size==0){
				//初始化链表
				fillStart(data);
				size++;	
			}else if(index==-1){
				addFirst(data);
			}else if(size==index+1){
				addLast(data);
			}else{
				Node temp=get(index);
				Node node=new Node();
				node.setData(data);
				node.setNext(temp.getNext());
				temp.setNext(node);
				size++;
			}
		}else{
			throw new IndexOutOfBoundsException("元素下标超出链表长度");
		}
	}
	/**
	 * 删除表头元素
	 */
	public void removeFirst(){
		if(size==0){
			throw new IndexOutOfBoundsException("元素下标超出链表长度");
		}else if(size==1){
			//清除所有
			clear();
		}else{
			Node temp=first;
			first=temp.getNext();
			temp=null;
			size--;
		}
	}
	/**
	 * 删除尾部元素
	 */
	public void removeLast(){
		if(size==0){
			throw new IndexOutOfBoundsException("元素下标超出链表长度");
		}else if(size==1){
			//清除所有
			clear();
		}else{
			Node temp=get(size-2);//获取尾元素之前的元素
			temp.setNext(null);
			size--;
		}
	}
	/**
	 * 删除中间元素
	 * @param index
	 */
	public void removeMiddle(int index){
		if(size==0){
			throw new IndexOutOfBoundsException("元素下标超出链表长度");
		}else if(size==1){
			//清除所有
			clear();
		}else{
			if(index==0){
				removeFirst();
			}else if(size==index+1){
				removeLast();
			}else{
				Node temp=get(index-1);//获取要删除元素之前的一个元素
				Node next=temp.getNext();
				temp.setNext(next.getNext());
				next=null;
				size--;
			}
		}
	}
	/**
	 * 打印所有数据
	 */
	public void printAll(){
		for(int i=0;i<size;i++){
			System.out.print(get(i).getData()+",");
		}
		System.out.println("");
	}
	/**
	 * 链表大小
	 * @return
	 */
	public int size(){
		return size;
	}
	/**
	 * 实现反转链表的功能
	 */
	public void reverse(){
		Node temp=first;
		last=first;
		Node next=first.getNext();
		for(int i=0;i<size-1;i++){
			Node nextNext=next.getNext();
			next.setNext(temp);
			temp=next;
			next=nextNext;
		}
		last.setNext(null);
		first=temp;
	}
}

```
#### LinkTest 类（链表测试类）
```java

public class LinkTest {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		Link link=new Link();
		link.addFirst(2);
		link.addFirst(1);
		link.addLast(4);
		link.addLast(5);
		link.add(3,1);
		link.printAll();
//		link.removeFirst();
//		link.removeFirst();
//		System.out.println(link.size());
		link.reverse();
		link.printAll();
	}

}

```
***
### 2.java实现双向链表
#### DoubleNode 类(节点类)
```java

public class DoubleNode {
	private Object obj;
	private DoubleNode prev;
	private DoubleNode next;
	
	public DoubleNode(Object obj){
		this.obj=obj;
	}

	public Object getObj() {
		return obj;
	}

	public void setObj(Object obj) {
		this.obj = obj;
	}

	public DoubleNode getPrev() {
		return prev;
	}

	public void setPrev(DoubleNode prev) {
		this.prev = prev;
	}

	public DoubleNode getNext() {
		return next;
	}

	public void setNext(DoubleNode next) {
		this.next = next;
	}
}

```
#### DoubleLink 类（链表实现类）
```java

public class DoubleLink {

	private DoubleNode head = null;// 头节点
	private DoubleNode tail = head;// 尾节点

	private int size;// 链表大小

	/**
	 * 链表后添加元素
	 * @param o
	 */
	public void add(Object obj) {
		//根据给定值创建节点
		DoubleNode node=new DoubleNode(obj);
		if(head==null){
			//如果链表为空，添加为第一个节点，既是头节点有事尾节点
			head=node;
			tail=head; 
		}else{
			tail.setNext(node);
			node.setPrev(tail);
			tail=node;
		}
	}
	
	/**
	 * 在指定位置添加元素
	 * @param index
	 * @param obj
	 */
	public void add(int index,Object obj){
		//创建节点
		DoubleNode node=new DoubleNode(obj);
		//判断下标
		if(index<0||index>size()){
			throw new RuntimeException("下标越界：size："+size()+"index："+index);
		}else{
			if(head==null){
				head=node;
				tail=head;
			}else if(index==size()){
				add(node);
			}else{
				//链表不为空时，取得当前下标的节点
				DoubleNode newnode=getCurrNode(index);
				DoubleNode fnode=newnode.getPrev();
				fnode.setNext(node);
				node.setPrev(fnode);
				node.setNext(newnode);
				newnode.setPrev(node);
			}
		}
	}
	/**
	 * 根据下标删除当前节点
	 * @param index
	 */
	public void remove(int index){
		if(index<0||index>size()){
			throw new RuntimeException("下标越界：size："+size()+"index："+index);
		}else{
			if(head==null){
				System.out.println("链表为空，不能删除！");
			}else{
				//取得当前下标节点
				DoubleNode newnode=getCurrNode(index);
				DoubleNode pnode=newnode.getPrev();
				DoubleNode nnode=newnode.getNext();
				
				pnode.setNext(nnode);
				nnode.setPrev(pnode);
			}
		}
	}
	
	
	/**
	 * 获取链表大小
	 * @return
	 */
	public int size(){
		if(head==null){
			return 0;
		}else{
			DoubleNode node=head;
			int count=0;
			while(node!=null){
				count++;
				node=node.getNext();
			}
			return count;
			
		}
	}
	
	/**
	 * 根据下标取得当前的节点
	 * @param index
	 * @return
	 */
	public DoubleNode getCurrNode(int index){
		//判断传入下标
		if(index<0||index>size()){
			throw new RuntimeException("下标越界：size："+size()+"index："+index);
		}else{
			DoubleNode node=head;
			int i=0;
			while(i<index){
				i++;
				node=node.getNext();
			}
			return node;
		}
	}
	
	/**
	 * 在指定位置更新节点值
	 * @param index
	 * @param obj
	 */
	public void upDate(int index,Object obj){
		//判断传入下标
		if(index<0||index>size()){
			throw new RuntimeException("下标越界：size："+size()+"index："+index);
		}else{
			DoubleNode newnode=getCurrNode(index);
			newnode.setObj(obj);
		}		
	}
	
	public void printDoubleLink(){
		if(head==null){
			System.out.println("链表为空");
		}else{
			int count=0;
			DoubleNode node=head;
			while(node!=null){
				count++;
				Object obj=node.getObj();
				System.out.print(obj+" ");
				node=node.getNext();
			}
			System.out.println("");
		}
	}
}

```
#### DoubleLinkTest(链表测试类)
```java

public class DoubleLinkTest {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		DoubleLink dl=new DoubleLink();
		dl.add("头节点");
		for(int i=0;i<10;i++){
			dl.add("结点"+i);
		}
		//测试指定位置下取得结点
		Object obj=dl.getCurrNode(3).getObj();
		//测试在指定位置插入元素
		dl.add(3, "新来的元素");
		System.out.println("<><><><><><><>"+obj);
		dl.printDoubleLink();
		System.out.println("<><><><><><><><><><><><><><><><><><><><><");
		// list.remove(3);
		// list.printLinkNode(front);
		dl.upDate(3, "值被改变的元素");
		dl.printDoubleLink();
		System.out.println("<><><><><><><><><><><><><><><><><><><><><");
	}

}

```
### 3.java循环链表，实现原理就是，将头节点和尾节点作为有个节点。