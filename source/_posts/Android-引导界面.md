---
title: Android 引导界面
date: 2017-06-04 22:32:13
tags: [Android]
---
***

## 引导界面分类
- **渐进式引入，比较对象：微信，qq**
- **viewpager引导页设计,比较对象：网易**
- **动画式引导，比较对象：花开** 
##  一、渐进式引入
###  1.实现的效果
<div align=center>
![](http://ofhbt8uhx.bkt.clouddn.com/GIF.gif)
</div>
###  2.布局界面
```xml
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context="com.tangjie.demowelc.MainActivity">

    <ImageView
        android:layout_width="fill_parent"
        android:layout_height="fill_parent"
        android:id="@+id/imageView"
        android:layout_alignParentStart="true"
        android:background="@drawable/welcome"/>
</RelativeLayout>
```
###  3.动画配置（透明动画）
>**使用activity中的动画操作**
```xml
<?xml version="1.0" encoding="utf-8"?>
<set xmlns:android="http://schemas.android.com/apk/res/android"
    android:interpolator="@android:anim/accelerate_interpolator">
    <alpha
        android:fromAlpha="0.0"
        android:toAlpha="1.0"
        android:duration="2000"
        />
    <alpha
        android:fromAlpha="1.0"
        android:toAlpha="0.0"
        android:startOffset="3000"
        android:duration="3000"
        />
</set>
```

**关于动画的操作请看实现效果**
<div align=center>
![](http://ofhbt8uhx.bkt.clouddn.com/GIF2.gif)
</div>
**链接：[Github](https://github.com/linglongxin24/AnimationDemo)**
>**其实还有属性动画可以实现更多更有效的动画，我决定下篇博客详细研究一下！**
### 4.主程序入口
```java
package com.tangjie.demowelc;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.ImageView;

public class MainActivity extends AppCompatActivity implements Animation.AnimationListener{

    private ImageView imageView;
    private Animation alphaAnimation;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        imageView = (ImageView) findViewById(R.id.imageView);
        alphaAnimation = AnimationUtils.loadAnimation(this, R.anim.welcome_alpha);
        alphaAnimation.setFillEnabled(true);
        alphaAnimation.setFillAfter(true);
        imageView.setAnimation(alphaAnimation);
        alphaAnimation.setAnimationListener(this);
    }

    @Override
    public void onAnimationStart(Animation animation) {

    }

    @Override
    public void onAnimationEnd(Animation animation) {
        Intent intent=new Intent(MainActivity.this,WelcomeActivity.class);
        startActivity(intent);
        finish();
    }

    @Override
    public void onAnimationRepeat(Animation animation) {

    }
}

```
## 二、ViewPager引导页设计
###  1.实现的效果
<div align=center>
![](http://ofhbt8uhx.bkt.clouddn.com/GIF4.gif)
</div>
### 2.布局界面
```xml
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent" >

    <android.support.v4.view.ViewPager
        android:id="@+id/viewpager"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />

    <LinearLayout
        android:id="@+id/ll"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_alignParentBottom="true"
        android:layout_centerHorizontal="true"
        android:layout_marginBottom="24.0dip"
        android:orientation="horizontal" >

        <ImageView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_gravity="center_vertical"
            android:clickable="true"
            android:contentDescription="@string/strPoint"
            android:padding="15.0dip"
            android:src="@drawable/point" />

        <ImageView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_gravity="center_vertical"
            android:clickable="true"
            android:contentDescription="@string/strPoint"
            android:padding="15.0dip"
            android:src="@drawable/point" />

        <ImageView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_gravity="center_vertical"
            android:clickable="true"
            android:contentDescription="@string/strPoint"
            android:padding="15.0dip"
            android:src="@drawable/point" />

        <ImageView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_gravity="center_vertical"
            android:clickable="true"
            android:contentDescription="@string/strPoint"
            android:padding="15.0dip"
            android:src="@drawable/point" />
    </LinearLayout>
</RelativeLayout>
```
### 3.其中小点的图片用一个selector来控制颜色
```xml
<?xml version="1.0" encoding="UTF-8"?>
<selector
  xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:state_enabled="true" android:drawable="@drawable/point_normal" />
    <item android:state_enabled="false" android:drawable="@drawable/point_select" />
</selector>
```
### 4.重写ViewPager适配器
```java
package com.yanis.yc_ui_viewpager_guideview;

import java.util.ArrayList;

import android.support.v4.view.PagerAdapter;
import android.support.v4.view.ViewPager;
import android.view.View;
/**
 * 
 * @author YeChao
 * @功能描述：ViewPager适配器，用来绑定数据和view 
 */
public class ViewPagerAdapter extends PagerAdapter{
    //界面列表  
    private ArrayList<View> views;  
    public ViewPagerAdapter(ArrayList<View> views)
    {
         this.views = views; 
    }
    
    /**
     * 获得当前界面数
     */
    @Override
    public int getCount() { 
         if (views != null) {  
             return views.size();  
         }        
         else return 0;  
    }

    /**
     * 判断是否由对象生成界面 
     */
    @Override
    public boolean isViewFromObject(View arg0, Object arg1) {
        return (arg0 == arg1);  
    }

    /**
     * 销毁position位置的界面 
     */
    @Override
    public void destroyItem(View container, int position, Object object) {
        ((ViewPager) container).removeView(views.get(position));     
    }

    /**
     * 初始化position位置的界面 
     */
    @Override
    public Object instantiateItem(View container, int position) {
        ((ViewPager) container).addView(views.get(position), 0);  
        return views.get(position);  
    }
    
}

ViewPagerAdapter.class

```
### 5.重写ViewPager适配器
```java
package com.yanis.yc_ui_viewpager_guideview;

import java.util.ArrayList;

import android.app.Activity;
import android.os.Bundle;
import android.support.v4.view.ViewPager;
import android.support.v4.view.ViewPager.OnPageChangeListener;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.ImageView;
import android.widget.ImageView.ScaleType;
import android.widget.LinearLayout;

/**
 * 
 * @author YeChao
 * @功能描述：主程序入口类
 */
public class MainActivity extends Activity implements OnClickListener,
        OnPageChangeListener {
    // 定义ViewPager对象
    private ViewPager viewPager;
    // 定义ViewPager适配器
    private ViewPagerAdapter vpAdapter;
    // 定义一个ArrayList来存放View
    private ArrayList<View> views;
    // 引导图片资源
    private static final int[] pics = { R.drawable.guide1, R.drawable.guide2,
            R.drawable.guide3, R.drawable.guide4 };
    // 底部小点的图片
    private ImageView[] points;
    // 记录当前选中位置
    private int currentIndex;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        initView();
        initData();
    }

    /**
     * 初始化组件
     */
    private void initView() {
        // 实例化ArrayList对象
        views = new ArrayList<View>();
        // 实例化ViewPager
        viewPager = (ViewPager) findViewById(R.id.viewpager);
        // 实例化ViewPager适配器
        vpAdapter = new ViewPagerAdapter(views);
    }

    /**
     * 初始化数据
     */
    private void initData() {
        // 定义一个布局并设置参数
        LinearLayout.LayoutParams mParams = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.MATCH_PARENT);

        // 初始化引导图片列表
        for (int i = 0; i < pics.length; i++) {
            ImageView iv = new ImageView(this);
            iv.setLayoutParams(mParams);
            //防止图片不能填满屏幕
            iv.setScaleType(ScaleType.FIT_XY);
            //加载图片资源
            iv.setImageResource(pics[i]);
            views.add(iv);
        }

        // 设置数据
        viewPager.setAdapter(vpAdapter);
        // 设置监听
        viewPager.setOnPageChangeListener(this);

        // 初始化底部小点
        initPoint();
    }

    /**
     * 初始化底部小点
     */
    private void initPoint() {
        LinearLayout linearLayout = (LinearLayout) findViewById(R.id.ll);

        points = new ImageView[pics.length];

        // 循环取得小点图片
        for (int i = 0; i < pics.length; i++) {
            // 得到一个LinearLayout下面的每一个子元素
            points[i] = (ImageView) linearLayout.getChildAt(i);
            // 默认都设为灰色
            points[i].setEnabled(true);
            // 给每个小点设置监听
            points[i].setOnClickListener(this);
            // 设置位置tag，方便取出与当前位置对应
            points[i].setTag(i);
        }

        // 设置当面默认的位置
        currentIndex = 0;
        // 设置为白色，即选中状态
        points[currentIndex].setEnabled(false);
    }

    /**
     * 滑动状态改变时调用
     */
    @Override
    public void onPageScrollStateChanged(int arg0) {

    }

    /**
     * 当前页面滑动时调用
     */
    @Override
    public void onPageScrolled(int arg0, float arg1, int arg2) {

    }

    /**
     * 新的页面被选中时调用
     */
    @Override
    public void onPageSelected(int arg0) {
        // 设置底部小点选中状态
        setCurDot(arg0);
    }

    @Override
    public void onClick(View v) {
        int position = (Integer) v.getTag();
        setCurView(position);
        setCurDot(position);
    }

    /**
     * 设置当前页面的位置
     */
    private void setCurView(int position) {
        if (position < 0 || position >= pics.length) {
            return;
        }
        viewPager.setCurrentItem(position);
    }

    /**
     * 设置当前的小点的位置
     */
    private void setCurDot(int positon) {
        if (positon < 0 || positon > pics.length - 1 || currentIndex == positon) {
            return;
        }
        points[positon].setEnabled(false);
        points[currentIndex].setEnabled(true);

        currentIndex = positon;
    }
}

MainActivity.class
```
## 三、动画式引导
###  1.实现的效果
<div align=center>
![](http://www.jcodecraeer.com/uploads/161221/1-161221115S3429.gif)
</div>
### 2.代码实现
[http://www.jcodecraeer.com/a/opensource/2016/1221/6878.html](http://www.jcodecraeer.com/a/opensource/2016/1221/6878.html)