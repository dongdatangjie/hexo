---
title: Android人脸检测
date: 2016-10-19 20:13:54
tags: [Android,人脸检测]
---
***

**Google Play Service提供给我们一个FaceDetection的方法用来检测人脸并绘制出人脸的8个特征点。**

**具体的在[Git](https://github.com/tutsplus/Android-PlayServices-FaceDetection)**

### 1.项目部署

新建一个Andorid项目(Android Studio)，在build.gradle中需要添加dependencies
```java
compile 'com.google.android.gms:play-services-vision:8.1.0'
```
然后在AndroidManifest.xml的Application代码段中加入google play service对于人脸检测的依赖配置：
```java
<meta-data android:name="com.google.android.gms.vision.DEPENDENCIES" android:value="face"/>
```
<!--more-->
下面创建一个自定的View用来显示资源文件中图片，创建两个对象句柄
```java
public class FaceOverlayView extends View{
    private Bitmap mBitmap;
    private SparseArray<Face> mFaces;
    public FaceOverlayView(Context context){
        this(context, null);
    }
    public FaceOverlayView(Context context, AttributeSet attrs)
    {
        this(context, attrs, 0);
    }
	public FaceOverlayView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }
}
```
**Bitmap用来接受图片的信息，SparseArray是稀疏数组，用来存储每张人脸的信息.**

设置bitmap
```java
public void setBitmap( Bitmap bitmap ) {
    mBitmap = bitmap;
}
```
在res的layout中加入
```java
<?xml version="1.0" encoding="utf-8"?>
<com.tutsplus.facedetection.FaceOverlayView
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/face_overlay"
    android:layout_width="match_parent"
    android:layout_height="match_parent" />
```
读取资源图片的数据放到andorid view上
```java
public class MainActivity extends AppCompatActivity {
 
    private FaceOverlayView mFaceOverlayView;
 
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        mFaceOverlayView = (FaceOverlayView) findViewById( R.id.face_overlay );
 
        InputStream stream = getResources().openRawResource( R.raw.face );
        Bitmap bitmap = BitmapFactory.decodeStream(stream);
 
        mFaceOverlayView.setBitmap(bitmap);
 
    }
}
```
### 2.人脸检测
```java
package com.tangjie.fac;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Rect;
import android.util.AttributeSet;
import android.util.Log;
import android.util.SparseArray;
import android.view.View;

import com.google.android.gms.vision.Frame;
import com.google.android.gms.vision.face.Face;
import com.google.android.gms.vision.face.FaceDetector;
import com.google.android.gms.vision.face.Landmark;

/**
 * Created by Administrator on 2016/10/19.
 */
public class FaceOverlayView extends View{
    private Bitmap mBitmap;
    private SparseArray<Face> mFaces;

    public FaceOverlayView(Context context) {
        this(context, null);
    }

    public FaceOverlayView(Context context, AttributeSet attrs) {
        this(context, attrs, 0);
    }

    public FaceOverlayView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }

    public void setBitmap( Bitmap bitmap ) {
        mBitmap = bitmap;
        FaceDetector detector = new FaceDetector.Builder(getContext())
                .setTrackingEnabled(true)
                .setLandmarkType(FaceDetector.ALL_LANDMARKS)
                .setMode(FaceDetector.ACCURATE_MODE)
                .build();

        if (!detector.isOperational()) {
            //Handle contingency
        } else {
            Frame frame = new Frame.Builder().setBitmap(bitmap).build();
            mFaces = detector.detect(frame);
            Log.i("mFaces",mFaces+"");
            detector.release();
        }
        logFaceData();
        invalidate();
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);

        if ((mBitmap != null) && (mFaces != null)) {
            double scale = drawBitmap(canvas);
            drawFaceLandmarks(canvas, scale);
        }
    }

    private double drawBitmap(Canvas canvas) {
        double viewWidth = canvas.getWidth();
        double viewHeight = canvas.getHeight();
        double imageWidth = mBitmap.getWidth();
        double imageHeight = mBitmap.getHeight();
        double scale = Math.min(viewWidth / imageWidth, viewHeight / imageHeight);

        Rect destBounds = new Rect(0, 0, (int)(imageWidth * scale), (int)(imageHeight * scale));
        canvas.drawBitmap(mBitmap, null, destBounds, null);
        return scale;
    }

    private void drawFaceBox(Canvas canvas, double scale) {
        //This should be defined as a member variable rather than
        //being created on each onDraw request, but left here for
        //emphasis.
        Paint paint = new Paint();
        paint.setColor(Color.GREEN);
        paint.setStyle(Paint.Style.STROKE);
        paint.setStrokeWidth(5);

        float left = 0;
        float top = 0;
        float right = 0;
        float bottom = 0;

        for( int i = 0; i < mFaces.size(); i++ ) {
            Face face = mFaces.valueAt(i);

            left = (float) ( face.getPosition().x * scale );
            top = (float) ( face.getPosition().y * scale );
            right = (float) scale * ( face.getPosition().x + face.getWidth() );
            bottom = (float) scale * ( face.getPosition().y + face.getHeight() );

            canvas.drawRect( left, top, right, bottom, paint );
        }
    }

    private void drawFaceLandmarks( Canvas canvas, double scale ) {
        Paint paint = new Paint();
        paint.setColor( Color.GREEN );
        paint.setStyle( Paint.Style.STROKE );
        paint.setStrokeWidth( 5 );

        for( int i = 0; i < mFaces.size(); i++ ) {
            Face face = mFaces.valueAt(i);

            for ( Landmark landmark : face.getLandmarks() ) {
                int cx = (int) ( landmark.getPosition().x * scale );
                int cy = (int) ( landmark.getPosition().y * scale );
                canvas.drawCircle( cx, cy, 10, paint );
            }

        }
    }

    private void logFaceData() {
        float smilingProbability;
        float leftEyeOpenProbability;
        float rightEyeOpenProbability;
        float eulerY;
        float eulerZ;
        for( int i = 0; i < mFaces.size(); i++ ) {
            Face face = mFaces.valueAt(i);

            smilingProbability = face.getIsSmilingProbability();
            leftEyeOpenProbability = face.getIsLeftEyeOpenProbability();
            rightEyeOpenProbability = face.getIsRightEyeOpenProbability();
            eulerY = face.getEulerY();
            eulerZ = face.getEulerZ();
            Log.e("脸数",i+"");
            Log.e("Tuts+ Face Detection", "Smiling: " + smilingProbability);
            Log.e( "Tuts+ Face Detection", "Left eye open: " + leftEyeOpenProbability );
            Log.e( "Tuts+ Face Detection", "Right eye open: " + rightEyeOpenProbability );
            Log.e( "Tuts+ Face Detection", "Euler Y: " + eulerY );
            Log.e( "Tuts+ Face Detection", "Euler Z: " + eulerZ );
        }
    }

}

```
### 3.结果
![](https://cms-assets.tutsplus.com/uploads/users/798/posts/25212/image/facebox.png)