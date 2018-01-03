---
title: Android登陆界面设计
date: 2017-03-21 22:14:10
tags: [Android]
---
***
>登陆界面的设计主要包括
* 欢迎界面
* 登陆界面
* 注册界面

废话不多说，借用一哥们的qq登陆界面学习一下。
链接：[GItHub](https://github.com/dongdatangjie/QQLogin)
<!--more-->
[TOC]
### 1.欢迎界面
**其实欢迎界面有挺多中的，比如微信qq一样的通过animation添加图片的渐变效果，然后延迟显示。也有滑动的介绍界面，在我看来全是在打广告。当然不可否认有些人是利用这样一种方式来介绍app的功能，比如阅读器一类的app的前面效果还是有作用的。**
![带有功能介绍的欢迎界面](http://ofhbt8uhx.bkt.clouddn.com/762fd87dc76540a59e415fb04111cc56dddf11462cf99-uL0KNz_fw658.jpg)
![一闪而过的欢迎界面，感觉没啥用](http://ofhbt8uhx.bkt.clouddn.com/splash.png)
#### main.xml
```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="fill_parent"
    android:layout_height="fill_parent"
    android:orientation="vertical" 
    android:background="@drawable/splash">

</LinearLayout>
```
#### WelcomeActivity.java
```java
package com.geniuseoe.demo;


import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;

/**
 * 
 * @author geniuseoe2012
 *  更多精彩，请关注我的CSDN博客http://blog.csdn.net/geniuseoe2012
 *  android开发交流群：200102476
 */
public class WelcomeActivity extends Activity{
    /** Called when the activity is first created. */

	private Handler mHandler;
	
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
       
        initView();
    }
    
    
    public void initView()
    {
    	mHandler = new Handler();
    	mHandler.postDelayed(new Runnable() {
			
			@Override
			public void run() {
				// TODO Auto-generated method stub
				goLoginActivity();
			}
    	}, 1000);
    }
    
    public void goLoginActivity()
    {
    	Intent intent = new Intent();
    	intent.setClass(this, LoginActivity.class);
    	startActivity(intent);
    	finish();
    }
    
}
```
**最后得到的界面就是上面的QQ的图片**
### 2.登陆界面
>登陆界面主要包括用户名和密码输入框，提交按钮和一些必要的快捷操作，例如记住密码呀，切换到注册假面的按钮和其他一些正常用不到但是用到的时候可以弹出的选项。
![登陆界面](http://ofhbt8uhx.bkt.clouddn.com/login.PNG)
####loginpage.xml
```xml
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout 
    android:orientation="vertical" 
    android:id="@+id/loginpage"
    android:background="@drawable/login_bg" 
    android:layout_width="fill_parent" 
    android:layout_height="fill_parent"
    xmlns:android="http://schemas.android.com/apk/res/android">

     
    <ImageView android:id="@+id/image" 
        android:background="@drawable/login_pic2" 
        android:layout_width="wrap_content" 
        android:layout_height="wrap_content" 
        android:layout_marginLeft="28.0dip" 
        android:layout_marginTop="46.0dip" 
        android:layout_marginRight="28.0dip" />

    <LinearLayout 
        android:orientation="vertical" 
        android:id="@+id/input" 
        android:background="@drawable/login_input" 
        android:layout_width="fill_parent" 
        android:layout_height="wrap_content" 
        android:layout_marginLeft="28.0dip" 
        android:layout_marginRight="28.0dip" 
        android:layout_below="@id/image">  
        <EditText android:textSize="16.0sp" android:textColor="#ff1d1d1d" android:textColorHint="#ff666666" android:id="@+id/accounts" android:background="#00ffffff" android:paddingLeft="12.0dip" android:layout_width="fill_parent" android:layout_height="44.0dip" android:hint="@string/account" android:maxLines="1" android:maxLength="16"     android:inputType="number"/>
        <View android:background="#ffc0c3c4" android:layout_width="fill_parent" android:layout_height="1.0px" android:layout_marginLeft="1.0px" android:layout_marginRight="1.0px" />
        <EditText android:textSize="16.0sp" android:textColor="#ff1d1d1d" android:textColorHint="#ff666666" android:gravity="center_vertical" android:id="@+id/password" android:background="#00ffffff" android:paddingLeft="12.0dip" android:layout_width="fill_parent" android:layout_height="44.0dip" android:hint="@string/password" android:maxLines="1" android:maxLength="16" android:inputType="textPassword" />
    </LinearLayout>
    

    <Button 
        android:textSize="18.0sp" 
        android:textColor="#ff333333" 
        android:gravity="center" 
        android:id="@+id/login" 
        android:background="@drawable/chat_send_button_bg" 
        android:paddingTop="5.0dip" 
        android:layout_width="fill_parent"
        android:layout_height="wrap_content" 
        android:layout_marginLeft="28.0dip" 
        android:layout_marginTop="12.0dip" 
        android:layout_marginRight="28.0dip" 
        android:text="@string/login"    
        android:layout_below="@id/input" />


    <RelativeLayout 
        android:layout_width="fill_parent" 
        android:layout_height="wrap_content" 
        android:layout_marginLeft="30.0dip"
        android:layout_marginTop="8.0dip" 
        android:layout_marginRight="30.0dip" 
        android:layout_below="@id/login"
        android:layout_weight="1" >
		<CheckBox android:textSize="12.0sp" android:textColor="#ffffffff" android:layout_alignParentLeft="true"  android:id="@+id/auto_save_password" android:background="@null" android:layout_width="wrap_content" android:layout_height="wrap_content" android:checked="true" android:button="@null" android:text="@string/auto_save_password" android:drawableLeft="@drawable/checkbox_bg1" android:drawablePadding="4.0dip"/>
		<Button  android:textSize="12.0sp" android:textColor="#ffffffff" android:layout_alignParentRight="true" android:gravity="left|center"  android:id="@+id/regist" android:background="@drawable/login_regist_bg" android:paddingLeft="8.0dip" android:paddingRight="18.0dip" android:clickable="true" android:layout_width="wrap_content" android:layout_height="wrap_content" android:text="@string/register2" />
    </RelativeLayout>
    
    <LinearLayout 
        android:orientation="vertical" 
        android:id="@+id/menu" 
        android:background="@drawable/login_moremenu_back" 
        android:layout_width="fill_parent" 
        android:layout_height="wrap_content" 
        android:layout_alignParentBottom="true">
        
        <RelativeLayout 
            android:id="@+id/more" 
            android:layout_width="fill_parent" 
            android:layout_height="wrap_content"
            android:paddingTop="8.0dip"
            android:paddingBottom="8.0dip"
            android:clickable="true">
            <TextView android:textSize="14.0sp" android:textColor="#ffc6e6f9" android:gravity="center" android:id="@+id/more_text" android:background="@null" android:layout_width="wrap_content" android:layout_height="wrap_content" android:text="@string/more_login_setting" android:maxLines="1" android:layout_centerInParent="true" />
            <ImageView android:id="@+id/more_image" android:clickable="false" android:layout_width="wrap_content" android:layout_height="wrap_content" android:src="@drawable/login_more_up" android:layout_toLeftOf="@+id/more_text" android:layout_marginRight="5.0dip" android:layout_centerVertical="true" />
        </RelativeLayout>


        <LinearLayout 
            android:orientation="vertical" 
            android:id="@+id/moremenu" 
            android:visibility="gone" 
            android:layout_width="fill_parent" 
            android:layout_height="wrap_content">
            
               <View android:background="#ff005484" android:layout_width="fill_parent" android:layout_height="1.0px" />
               <View android:background="#ff0883cb" android:layout_width="fill_parent" android:layout_height="1.0px" />
               
            <LinearLayout android:orientation="horizontal" android:layout_width="fill_parent" android:layout_height="wrap_content" android:layout_marginLeft="30.0dip" android:layout_marginTop="12.0dip" android:layout_marginRight="30.0dip">
                <CheckBox android:textSize="12.0sp" android:textColor="#ffc6e6f9" android:id="@+id/hide_login" android:background="@null" android:layout_width="1.0px" android:layout_height="wrap_content" android:checked="false" android:button="@null" android:text="@string/hide_login" android:drawableLeft="@drawable/checkbox_bg1" android:drawablePadding="4.0dip" android:layout_weight="2.0" />
                <CheckBox android:textSize="12.0sp" android:textColor="#ffc6e6f9" android:id="@+id/silence_login" android:background="@null" android:layout_width="1.0px" android:layout_height="wrap_content" android:checked="false" android:button="@null" android:text="@string/silence_login" android:drawableLeft="@drawable/checkbox_bg1" android:drawablePadding="4.0dip" android:layout_weight="1.0" />
            </LinearLayout>
            <LinearLayout android:orientation="horizontal" android:layout_width="fill_parent" android:layout_height="wrap_content" android:layout_marginLeft="30.0dip" android:layout_marginTop="18.0dip" android:layout_marginRight="30.0dip" android:layout_marginBottom="18.0dip">
                <CheckBox android:textSize="12.0sp" android:textColor="#ffc6e6f9" android:id="@+id/accept_accounts" android:background="@null" android:layout_width="1.0px" android:layout_height="wrap_content" android:checked="true" android:button="@null" android:text="@string/info_accounts" android:singleLine="true" android:drawableLeft="@drawable/checkbox_bg1" android:drawablePadding="4.0dip" android:layout_weight="2.0" />
                <CheckBox android:textSize="12.0sp" android:textColor="#ffc6e6f9" android:id="@+id/accept_troopmsg" android:background="@null" android:layout_width="1.0px" android:layout_height="wrap_content" android:checked="true" android:button="@null" android:text="@string/info_troopmessage" android:drawableLeft="@drawable/checkbox_bg1" android:drawablePadding="4.0dip" android:layout_weight="1.0" />
            </LinearLayout>
        </LinearLayout>
        
    </LinearLayout>
    
</RelativeLayout>

```
####LoginActivity.java
```java
package com.geniuseoe.demo;

import android.app.Activity;
import android.app.Dialog;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.ImageView;

public class LoginActivity extends Activity implements OnClickListener{

	private Button mBtnRegister;
	private Button mBtnLogin;
	
	private View mMoreView;
	private ImageView mMoreImage;
	private View mMoreMenuView;
	
	private boolean mShowMenu = false;
	
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.loginpage);
       
        initView();
    }
    
    
    public void initView()
    {
    	mMoreView = findViewById(R.id.more);
    	mMoreMenuView = findViewById(R.id.moremenu);
    	mMoreImage = (ImageView) findViewById(R.id.more_image);
    	mMoreView.setOnClickListener(this);
    	
    	mBtnRegister = (Button) findViewById(R.id.regist);
    	mBtnRegister.setOnClickListener(this);
    	
    	mBtnLogin = (Button) findViewById(R.id.login);
    	mBtnLogin.setOnClickListener(this);
    }
    
    
    public void showMoreView(boolean bShow)
    {
    	if (bShow)
    	{
    		mMoreMenuView.setVisibility(View.GONE);
    		mMoreImage.setImageResource(R.drawable.login_more_up);
    		mShowMenu = true;
    	}else{
    		mMoreMenuView.setVisibility(View.VISIBLE);
    		mMoreImage.setImageResource(R.drawable.login_more);
    		mShowMenu = false;
    	}
    }


	@Override
	public void onClick(View v) {
		// TODO Auto-generated method stub
		
		switch(v.getId())
		{
		case R.id.more:
			showMoreView(!mShowMenu);
			break;
		case R.id.regist:
			goRegisterActivity();
			break;
		case R.id.login:
			showRequestDialog();
			break;
			default:
				break;
		}
	}
    
    public void goRegisterActivity()
    {
    	Intent intent = new Intent();
    	intent.setClass(this, RegisterActivity.class);
    	startActivity(intent);
    }
	   

	private Dialog mDialog = null;
	private void showRequestDialog()
	{
		if (mDialog != null)
		{
			mDialog.dismiss();
			mDialog = null;
		}
		mDialog = DialogFactory.creatRequestDialog(this, "正在验证账号...");
		mDialog.show();
	}
	
	
}

```
###3.注册界面
>注册界面一般包含邮箱，用户名，密码和手机等个人信息。
![注册界面](http://ofhbt8uhx.bkt.clouddn.com/register.PNG)
#### register.xml
```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout    
  android:orientation="vertical" 
  android:background="@color/white" 
  android:layout_width="fill_parent" 
  android:layout_height="fill_parent" 
  xmlns:android="http://schemas.android.com/apk/res/android">

    <RelativeLayout 
        android:orientation="vertical"
        android:background="@drawable/title_bar9"
        android:layout_width="fill_parent" 
        android:layout_height="50dip">
        <TextView android:layout_centerInParent="true" android:textSize="20.0sp" android:textColor="@color/white"  android:layout_width="wrap_content" android:layout_height="wrap_content" android:text="@string/qr_register" />
    </RelativeLayout>
    
        
    <LinearLayout 
        android:orientation="vertical" 
        android:background="@drawable/shape_bg" 
        android:layout_width="fill_parent" 
        android:layout_height="wrap_content" 
        android:layout_marginLeft="10.0dip" 
        android:layout_marginTop="20.0dip" 
        android:layout_marginRight="10.0dip">       
      
        <LinearLayout android:gravity="center_vertical" android:orientation="horizontal" android:layout_width="fill_parent" android:layout_height="50.0dip">
            <TextView android:textSize="18.0sp" android:textColor="@android:color/black" android:paddingLeft="15.0dip" android:layout_width="1px" android:layout_height="wrap_content" android:gravity="right" android:text="邮    箱:" android:layout_weight="1"/>
            <EditText android:textSize="16.0sp" android:textColor="#ff545454" android:id="@+id/email" android:background="@android:color/white" android:paddingLeft="10.0dip" android:layout_width="1px" android:layout_height="wrap_content" android:layout_marginLeft="10.0dip" android:layout_marginRight="15.0dip" android:hint="请输入邮箱" android:inputType="textEmailAddress" android:maxLength="20" android:layout_weight="3"/>
        </LinearLayout>
        
        <View android:background="@drawable/shape_line" android:layout_width="fill_parent" android:layout_height="1.0px" />
        
        <LinearLayout android:gravity="center_vertical" android:orientation="horizontal" android:layout_width="fill_parent" android:layout_height="50.0dip">
            <TextView android:textSize="18.0sp" android:textColor="@android:color/black" android:paddingLeft="15.0dip" android:layout_width="1px" android:layout_height="wrap_content" android:gravity="right" android:text="用户名:" android:layout_weight="1"/>
            <EditText android:textSize="16.0sp" android:textColor="#ff545454" android:id="@+id/password" android:background="@android:color/white" android:paddingLeft="10.0dip" android:layout_width="1px" android:layout_height="wrap_content" android:layout_marginLeft="10.0dip" android:layout_marginRight="15.0dip" android:hint="请输入用户名" android:maxLength="20" android:layout_weight="3"/>
        </LinearLayout>
        
        <View android:background="@drawable/shape_line" android:layout_width="fill_parent" android:layout_height="1.0px" />
        
        <LinearLayout android:gravity="center_vertical" android:orientation="horizontal" android:layout_width="fill_parent" android:layout_height="50.0dip">
            <TextView android:textSize="18.0sp" android:textColor="@android:color/black" android:paddingLeft="15.0dip" android:layout_width="1px" android:layout_height="wrap_content" android:gravity="right" android:text="密    码:" android:layout_weight="1"/>
            <EditText android:textSize="16.0sp" android:textColor="#ff545454" android:id="@+id/name" android:background="@android:color/white" android:paddingLeft="10.0dip" android:layout_width="1px" android:layout_height="wrap_content" android:layout_marginLeft="10.0dip" android:layout_marginRight="15.0dip" android:hint="请输入密码" android:maxLength="20"  android:layout_weight="3" android:inputType="textPassword"/>
        </LinearLayout>
        
        <View android:background="@drawable/shape_line" android:layout_width="fill_parent" android:layout_height="1.0px" />
        
        <LinearLayout android:gravity="center_vertical" android:orientation="horizontal" android:layout_width="fill_parent" android:layout_height="50.0dip">
            <TextView android:textSize="18.0sp" android:textColor="@android:color/black" android:paddingLeft="15.0dip" android:layout_width="1px" android:layout_height="wrap_content" android:gravity="right" android:text="手机号:" android:layout_weight="1"/>
            <EditText android:textSize="16.0sp" android:textColor="#ff545454" android:id="@+id/phone" android:background="@android:color/white" android:paddingLeft="10.0dip" android:layout_width="1px" android:layout_height="wrap_content" android:layout_marginLeft="10.0dip" android:layout_marginRight="15.0dip" android:hint="请输入手机号" android:maxLength="20" android:inputType="number" android:layout_weight="3"/>
        </LinearLayout>
        
    </LinearLayout>
    
    <LinearLayout 
        android:gravity="left" 
        android:orientation="horizontal" 
        android:layout_width="fill_parent" 
        android:layout_height="wrap_content" 
        android:layout_marginLeft="20.0dip" 
        android:layout_marginTop="10.0dip">       
        <TextView android:textSize="14.0sp" android:textColor="@color/button_unselected"  android:layout_width="wrap_content" android:layout_height="wrap_content" android:text="@string/register_tip" />
    </LinearLayout>

    <Button android:id="@+id/register_btn"  android:textSize="18.0sp" android:textColor="#ff000000"  android:background="@drawable/op_bg_selector" android:layout_width="fill_parent" android:layout_height="wrap_content" android:layout_marginLeft="20.0dip" android:layout_marginTop="20.0dip" android:layout_marginRight="20.0dip" android:text="注 册" />
    
</LinearLayout>

```
#### RegisterAvtivity.java
```java
package com.geniuseoe.demo;

import android.app.Activity;
import android.app.Dialog;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;

public class RegisterActivity extends Activity implements OnClickListener{

	private Button mBtnRegister;
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		// TODO Auto-generated method stub
		super.onCreate(savedInstanceState);
		
		setContentView(R.layout.register);
		
		initView();
		
	}
	
	
	public void initView()
	{
		mBtnRegister = (Button) findViewById(R.id.register_btn);
		mBtnRegister.setOnClickListener(this);
	}
	
	

	private Dialog mDialog = null;
	private void showRequestDialog()
	{
		if (mDialog != null)
		{
			mDialog.dismiss();
			mDialog = null;
		}
		mDialog = DialogFactory.creatRequestDialog(this, "正在注册中...");
		mDialog.show();
	}


	@Override
	public void onClick(View v) {
		// TODO Auto-generated method stub
		switch(v.getId())
		{
		case R.id.register_btn:
			showRequestDialog();
			break;
			default:
				break;
		}
	}
}

```
