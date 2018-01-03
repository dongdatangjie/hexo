---
title: Java IO流
date: 2016-11-16 11:24:20
tags: Java

---
***
## 1.架构
### 1.1 常用字节流字符流
![](http://ofhbt8uhx.bkt.clouddn.com/IO.png)
### 1.2 IO流的分类
* **1.根据处理的数据类型分为：字节流和字符流**
* **2.根据流向不同分为输出流和输入流**
### 1.3 字符流的由来
**因为文件编码不同而出现了对字符高效操作的字符流对象，其实就是基于字节流读取字节时查看码表**
### 1.4 字节流和字符流的区别
* **1.字节流读取的时候，读到一个字节就返回一个字节**
* **2.字符流读取的时候，适用字节流读取一个或多个字节时，先查看码表，将查到的字符返回**
<!--more-->
## 2.FileReader
```java
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;

/**
 * 读取文件数据，并且一个字符一个字符打印出来
 * @author Administrator
 *
 */
public class Test5 {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		StringBuffer sb=new StringBuffer();
		FileReader fr = null;
		int num;
		try {
			fr=new FileReader(new File("D:/data.json"));
			while((num=fr.read())!=-1){
				sb.append((char)num);
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}finally{
			try {
				fr.close();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		System.out.println(sb.toString());
		
	}

}

```
>注意：这里的文件路径如果使用反斜杠，需要使用双反斜杠"\\"，但是这一个字符一个字符的读取效率很低，我们可以创建一个1k的数组，让他读完再打印出来字符串。
```java
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;

/**
 * 读取文件数据，并且一个字符一个字符打印出来
 * @author Administrator
 *
 */
public class Test5 {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		StringBuffer sb=new StringBuffer();
		FileReader fr = null;
		char[] ch=new char[1024];
		int num;
		try {
			fr=new FileReader(new File("D:/data.json"));
			while((num=fr.read(ch))!=-1){
				sb.append(new String(ch,0,num));
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}finally{
			try {
				fr.close();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		System.out.println(sb.toString());
		
	}

}

```

**结果**
```java
锘縶"name":"tangjie",
	"age":25,
	"job":"student",
	"hobby":[{"name":"basketball"},{"name":"volleyball"},{"name":"pingpang"}]
}

```
**可以看出这里出现了乱码，猜测可能是在读取字符的时候没有使用字节的转换流进行转码，下面我们使用转换流转码之后再打印出字符串**
```java
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStreamReader;

/**
 * 读取文件数据，并且一个字符一个字符打印出来
 * @author Administrator
 *
 */
public class Test5 {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		StringBuffer sb=new StringBuffer();
		InputStreamReader in = null;
		char[] ch=new char[1024];
		int num;
		try {
			in=new InputStreamReader(new FileInputStream(new File("D:/data.json")),"UTF-8");
			while((num=in.read(ch))!=-1){
				sb.append(new String(ch,0,num));
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}finally{
			try {
				in.close();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		System.out.println(sb.toString());
		
	}

}

```
**结果**
```java
?{"name":"tangjie",
	"age":25,
	"job":"student",
	"hobby":[{"name":"basketball"},{"name":"volleyball"},{"name":"pingpang"}]
}

```
**我们可以看到乱码没有了，但是json文件前面出现了一个问号，当时我一脸懵逼，于是我去找度娘问了一下，然后我发现大牛们是这么解释的！**
上网找了一下，找到几篇比较好文章，这里就不转载啦把链接搞过来。 
[文件编码问题集锦](http://blog.csdn.net/fancyaphy/article/details/619972) 
[字符串编码(charset,encoding，decoding)问题原理](http://www.iteye.com/topic/31860) 
[Java编码浅析](http://www.iteye.com/topic/311583) 
[定文件编码或文本流编码的方法](http://www.iteye.com/topic/108540) 
上面的几篇文章可以看成认识编码问题的“从入门到精通” 
>于是得出结论
>Java在读文件时没能正确处理UTF-8文件的BOM编码，将前3个字节当作文本内容来处理了。 
>使用链接中提供的代码可以解决碰到的乱码问题：
>http://koti.mbnet.fi/akini/java/unicodereader/ 

**于是在代码中加入对UnicodeReader工具类的使用**
```java
/**
 version: 1.1 / 2007-01-25
 - changed BOM recognition ordering (longer boms first)

 Original pseudocode   : Thomas Weidenfeller
 Implementation tweaked: Aki Nieminen

 http://www.unicode.org/unicode/faq/utf_bom.html
 BOMs:
   00 00 FE FF    = UTF-32, big-endian
   FF FE 00 00    = UTF-32, little-endian
   EF BB BF       = UTF-8,
   FE FF          = UTF-16, big-endian
   FF FE          = UTF-16, little-endian

 Win2k Notepad:
   Unicode format = UTF-16LE
***/

import java.io.*;

/**
 * Generic unicode textreader, which will use BOM mark
 * to identify the encoding to be used. If BOM is not found
 * then use a given default or system encoding.
 */
public class UnicodeReader extends Reader {
   PushbackInputStream internalIn;
   InputStreamReader   internalIn2 = null;
   String              defaultEnc;

   private static final int BOM_SIZE = 4;

   /**
    *
    * @param in  inputstream to be read
    * @param defaultEnc default encoding if stream does not have 
    *                   BOM marker. Give NULL to use system-level default.
    */
   UnicodeReader(InputStream in, String defaultEnc) {
      internalIn = new PushbackInputStream(in, BOM_SIZE);
      this.defaultEnc = defaultEnc;
   }

   public String getDefaultEncoding() {
      return defaultEnc;
   }

   /**
    * Get stream encoding or NULL if stream is uninitialized.
    * Call init() or read() method to initialize it.
    */
   public String getEncoding() {
      if (internalIn2 == null) return null;
      return internalIn2.getEncoding();
   }

   /**
    * Read-ahead four bytes and check for BOM marks. Extra bytes are
    * unread back to the stream, only BOM bytes are skipped.
    */
   protected void init() throws IOException {
      if (internalIn2 != null) return;

      String encoding;
      byte bom[] = new byte[BOM_SIZE];
      int n, unread;
      n = internalIn.read(bom, 0, bom.length);

      if ( (bom[0] == (byte)0x00) && (bom[1] == (byte)0x00) &&
                  (bom[2] == (byte)0xFE) && (bom[3] == (byte)0xFF) ) {
         encoding = "UTF-32BE";
         unread = n - 4;
      } else if ( (bom[0] == (byte)0xFF) && (bom[1] == (byte)0xFE) &&
                  (bom[2] == (byte)0x00) && (bom[3] == (byte)0x00) ) {
         encoding = "UTF-32LE";
         unread = n - 4;
      } else if (  (bom[0] == (byte)0xEF) && (bom[1] == (byte)0xBB) &&
            (bom[2] == (byte)0xBF) ) {
         encoding = "UTF-8";
         unread = n - 3;
      } else if ( (bom[0] == (byte)0xFE) && (bom[1] == (byte)0xFF) ) {
         encoding = "UTF-16BE";
         unread = n - 2;
      } else if ( (bom[0] == (byte)0xFF) && (bom[1] == (byte)0xFE) ) {
         encoding = "UTF-16LE";
         unread = n - 2;
      } else {
         // Unicode BOM mark not found, unread all bytes
         encoding = defaultEnc;
         unread = n;
      }    
      //System.out.println("read=" + n + ", unread=" + unread);

      if (unread > 0) internalIn.unread(bom, (n - unread), unread);

      // Use given encoding
      if (encoding == null) {
         internalIn2 = new InputStreamReader(internalIn);
      } else {
         internalIn2 = new InputStreamReader(internalIn, encoding);
      }
   }

   public void close() throws IOException {
      init();
      internalIn2.close();
   }

   public int read(char[] cbuf, int off, int len) throws IOException {
      init();
      return internalIn2.read(cbuf, off, len);
   }

}
```
**下面是加入编码之后的字符读取代码**
```java
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.Charset;

/**
 * 读取文件数据，并且一个字符一个字符打印出来
 * @author Administrator
 *
 */
public class Test5 {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		StringBuffer sb=new StringBuffer();
		BufferedReader in = null;
		char[] ch=new char[1024];
		int num;
		try {
			in=new BufferedReader(new UnicodeReader(new FileInputStream(new File("D:/data.json")),Charset.defaultCharset().name()));
			while((num=in.read(ch))!=-1){
				sb.append(new String(ch,0,num));
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}finally{
			try {
				in.close();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		System.out.println(sb.toString());
		
	}

}

```
**结果**
```java
{"name":"tangjie",
	"age":25,
	"job":"student",
	"hobby":[{"name":"basketball"},{"name":"volleyball"},{"name":"pingpang"}]
}

```
## 3.字符流的读写
```java
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;

public class Test6 {

	public static void main(String[] args) {
		char[] ch=new char[1024];
		// TODO Auto-generated method stub
		int num;
		try {
			FileReader fr=new FileReader(new File("D:/data.json"));
			FileWriter fw=new FileWriter(new File("D:/data2.json"));
			while((num=fr.read(ch))!=-1){
				fw.write(ch);
			}
			fr.close();
			fw.close();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}

```
```java
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;

public class Test6 {

	public static void main(String[] args) {
		char[] ch=new char[1024];
		// TODO Auto-generated method stub
		int num;
		BufferedReader br;
		BufferedWriter bw;
		int s;
		try {
			 br=new BufferedReader(new FileReader(new File("D:/data.json")));
			bw=new BufferedWriter(new FileWriter(new File("D:/data2.json")));
			while((s=br.read(ch))!=-1){
				bw.write(ch);
			}
			br.close();
			bw.close();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}

```
**通常，Reader 所作的每个读取请求都会导致对基础字符或字节流进行相应的读取请求。因此，建议用 BufferedReader 包装所有其 read() 操作可能开销很高的 Reader（如 FileReader 和 InputStreamReader）。例如，**

	BufferedReader in = new BufferedReader(new FileReader("foo.in"));
	
**将缓冲指定文件的输入。如果没有缓冲，则每次调用 read() 或 readLine() 都会导致从文件中读取字节，并将其转换为字符后返回，而这是极其低效的.**
## 4.字节流的读写
```java
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;

public class Test7 {

	public static void main(String[] args) {
		byte[] b=new byte[1024];
		int len;
		// TODO Auto-generated method stub
		try {
			FileInputStream in=new FileInputStream(new File("D:/data.json"));
			FileOutputStream out=new FileOutputStream(new File("D:/data2.json"));
			while((len=in.read(b))!=-1){
				out.write(b, 0, len);
			}
			in.close();
			out.close();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}

```
```java
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;

public class Test7 {

	public static void main(String[] args) {
		byte[] b=new byte[1024];
		int len;
		// TODO Auto-generated method stub
		try {
			BufferedInputStream bi=new BufferedInputStream(new FileInputStream(new File("D:/data.json")));
			BufferedOutputStream bo=new BufferedOutputStream(new FileOutputStream(new File("D:/data2.json")));
			while((len=bi.read(b))!=-1){
				bo.write(b, 0, len);
			}
			bi.close();
			bo.close();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}

```
## 5.字节流转换为字符流
```java
public class ReadTest {
    public static void main(String[] args) {
        try {
            BufferedReader br=new BufferedReader(
                    new InputStreamReader(
                            new FileInputStream("F:\\t.txt")));
            BufferedWriter bw=new BufferedWriter(
                    new OutputStreamWriter(
                            new FileOutputStream("F:\\d.txt")));
            String s;
            StringBuilder sb=new StringBuilder();
            while((s=br.readLine())!=null){
                System.out.println(s);
                bw.write(s);
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```