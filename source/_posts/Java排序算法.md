---
title: Java排序算法
date: 2016-12-19 22:10:34
tags: [Java,数据结构]
---
***
## 1.冒泡排序
**冒泡排序是从头部到尾部进行比较，假设有n个元素，前一个元素和后一个元素比较，大的放在后面，一个轮回之后，最大的元素到了最后一个位置，然后对前面的n-1个元素，继续进行这样的操作，就可以依次得到尾部的最大元素的排列，反过来就是从小到大的排序。**
<!--more-->
```java
/**
 * 冒泡排序算法
 * @author tangjie
 *
 */
public class BubbleSort {
	private int[] array;
	
	public BubbleSort(int[] array){
		this.array=array;
	}
	/**
	 * 小到大
	 */
	public void sortAsc(){
		for(int i=0;i<array.length-1;i++){
			for(int j=0;j<array.length-1-i;j++){
				if(array[j]>array[j+1]){
					int temp=array[j];
					array[j]=array[j+1];
					array[j+1]=temp;
				}
			}
		}
	}
	
	/**
	 * 大到小
	 */
	public void sortDesc(){
		for(int i=0;i<array.length-1;i++){
			for(int j=0;j<array.length-i-1;j++){
				if(array[j]<array[j+1]){
					int temp=array[j];
					array[j]=array[j+1];
					array[j+1]=temp;
				}
			}
		}
	}
	
	public void print(){
		for(int i=0;i<array.length;i++){
			System.out.println(array[i]);
		}
	}

}
```
## 2.快速排序算法
**首先选择一个基准数，下面以第一个数作为基准数，比较这个基准和最后一个元素大小，如果基准大的话就互换位置，然后比较基准和前面第二个元素大小，如果基准小的话，互换位置，之后再和后面倒数第二个元素互换，如果出现前下标和后下标的大小出现变化，则继续比较这个时候基准左右两边的数列，同样使用上面的方法，即迭代上面的函数**
```java
/**
 * 快速排序
 * @author tangjie
 *
 */
public class QuickSort {
	private int[] array;
	
	public QuickSort(int array[]){
		this.array=array;
	}
	
	public void sort(){
		quickSort(array, 0, array.length-1);
	}
	
	public void print(){
		for(int i=0;i<array.length;i++){
			System.out.println(array[i]);
		}
	}
	
	private void quickSort(int src[],int begin,int end){
		if(begin<end){
			int key=src[begin];
			int i=begin;
			int j=end;
			while(i<j){
				while(i<j&&src[j]>key){
					j--;
				}
				
				if(i<j){
					src[i]=src[j];
					i++;
				}
				while(i<j&&src[i]<key){
					i++;
				}
				if(i<j){
					src[j]=src[i];
					j--;
				}
			}
			src[i]=key;
			quickSort(src, begin, i-1);
			quickSort(src, i+1, end);
		}
	}
}
```
## 3.插入排序
**从第一个元素开始取出来和前面的元素对比，如果比前面元素小，就让前面元素后移，然后找到位置插入**
```java
/**
 * 插入排序
 * @author tangjie
 *
 */
public class InsertSort {
	private int[] array;
	
	public InsertSort(int array[]){
		this.array=array;
	}
	
	public void sort(){
		if(array.length>0){
			for(int i=1;i<array.length;i++){
				int temp=array[i];
				int j=i;
				for(;j>0&&array[j-1]>temp;j--){
					array[j]=array[j-1];
				}
				array[j]=temp;
			}
		}
	}
	
	public void print(){
		for(int i=0;i<array.length;i++){
			System.out.println(array[i]);
		}
	}
}

```
## 4.希尔排序
**把待排序的数列按照一定的增量分割成多个子数列，子数列不是连续的，是通过前面提到的增量，按照一定的相隔的增量进行分割的，对各个子数列进行插入排序，然后减小增量再排序，直到增量为1**
```java

public class ShellSort {
	
	private int[] array;
	
	public ShellSort(int array[]){
		this.array=array;
	}
	
	public void sort(){
		int temp;
		for(int k=array.length/2;k>0;k/=2){
			for(int i=k;i<array.length;i++){
				for(int j=i;j>=k;j-=k){
					if(array[j-k]>array[j]){
						temp=array[j-k];
						array[j-k]=array[j];
						array[j]=temp;
					}
				}
			}
		}
	}
	
	public void print(){
		for(int i=0;i<array.length;i++){
			System.out.println(array[i]);
		}
	}
}

```
## 5.简单选择排序
**首先找到数列中最小的元素与第一个元素对换，然后找后面n-1个元素的最小值和第二个元素对换，一直这样直到只剩下一个元素**
```java
/**
 * 简单选择排序
 * @author tangjie
 *
 */
public class SelectSort {
private int[] array;
	
	public SelectSort(int array[]){
		this.array=array;
	}
	
	public void sort(){
		for(int i=0;i<array.length;i++){
			int minIndex=i;
			for(int j=i+1;j<array.length;j++){
				if(array[j]<array[minIndex]){
					minIndex=j;
				}
			}
			if(minIndex!=i){
				int temp=array[minIndex];
				array[minIndex]=array[i];
				array[i]=temp;
			}
		}
	}
	
	public void print(){
		for(int i=0;i<array.length;i++){
			System.out.println(array[i]);
		}
	}
}

```
>下面我们测试下这五种算法的执行效率如何
```java

public class Test {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		int array[]=new int[10000];
		for(int i=0;i<array.length;i++){
			array[i]=(int)Math.round(Math.random()*100000);
		}
		BubbleSort b=new BubbleSort(array);
		QuickSort q=new QuickSort(array);
		InsertSort i=new InsertSort(array);
		ShellSort sh=new ShellSort(array);
		SelectSort se=new SelectSort(array);
	
		long Bubblestart=System.currentTimeMillis();
		b.sortDesc();
		long Bubbleend=System.currentTimeMillis();
		System.out.println("Bubble:"+(Bubbleend-Bubblestart));
		
		long Quickstart=System.currentTimeMillis();
		q.sort();
		long Quickend=System.currentTimeMillis();
		System.out.println("Quick:"+(Quickend-Quickstart));
		
		long Insertstart=System.currentTimeMillis();
		i.sort();
		long Insertend=System.currentTimeMillis();
		System.out.println("Insert:"+(Insertend-Insertstart));
		
		long Shellstart=System.currentTimeMillis();
		sh.sort();
		long Shellend=System.currentTimeMillis();
		System.out.println("Shell:"+(Shellend-Shellstart));
		
		long Selectstart=System.currentTimeMillis();
		se.sort();
		long Selectend=System.currentTimeMillis();
		System.out.println("Select:"+(Selectend-Selectstart));
	}

}

```
>结果
```java
Bubble:220
Quick:109
Insert:1
Shell:196
Select:30
```
