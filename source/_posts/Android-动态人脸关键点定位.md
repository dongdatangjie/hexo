---
title: Android 动态人脸关键点定位
date: 2017-06-15 21:45:15
tags: [Android,人脸检测]
---
***
## android视频预览
**layout 界面布局**
```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="fill_parent"
    android:layout_height="fill_parent"
    android:orientation="vertical">
    <TextView
        android:id="@+id/txt"
        android:layout_height="wrap_content"
        android:layout_width="fill_parent"
        android:text="本地摄像头预览"
        android:textAlignment="center" />
    <SurfaceView android:id="@+id/localView"
        android:layout_height="240dip"
        android:layout_width="320dip"
        android:layout_gravity="center_horizontal">
    </SurfaceView>
</LinearLayout>  
```
<!--more-->
**主界面代码**
```java
package com.tangjie.cameraface;

import android.app.Activity;
import android.content.pm.ActivityInfo;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.graphics.PixelFormat;
import android.hardware.Camera;
import android.os.Bundle;
import android.os.Environment;
import android.util.Log;
import android.view.Surface;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.view.Window;
import android.view.WindowManager;
import android.widget.ImageView;
import android.widget.Toast;

import com.tangjie.dzseetaface.CMSeetaFace;
import com.tangjie.dzseetaface.FileUtils;
import com.tangjie.dzseetaface.SeetaFace;

import org.opencv.android.BaseLoaderCallback;
import org.opencv.android.LoaderCallbackInterface;
import org.opencv.android.OpenCVLoader;
import org.opencv.android.Utils;
import org.opencv.core.Mat;
import org.opencv.core.Point;
import org.opencv.core.Size;
import org.opencv.imgproc.Imgproc;

import java.io.IOException;
import java.util.List;

public class PericvideoActivity extends Activity implements SurfaceHolder.Callback, Camera.PreviewCallback {
    public static final String TAG = "CameraActivity";
    Camera mCamera;
    Surface mLocalSurface;
    SurfaceView mLocalView;
    SurfaceHolder mLocalSurfaceHolder;
    ImageView imageView;
    boolean remoteVideoVisible=true;
    int previewWidth=320,previewHeight=240;
   
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        //设置屏幕全屏
        final Window win = getWindow();
        win.setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
        setContentView(R.layout.activity_pericvideo);
        mLocalView = (SurfaceView) findViewById(R.id.localView);
        mLocalSurfaceHolder = mLocalView.getHolder();
        mLocalSurfaceHolder.addCallback(this);
        mLocalSurfaceHolder.setType(SurfaceHolder.SURFACE_TYPE_PUSH_BUFFERS);
        mLocalSurface = mLocalSurfaceHolder.getSurface();
        //没有调用.addCallback( this);  说明这个surfaceview没有调用surfacecreated等方法，照相机没打开没预览界面（这个surfaceview没执行打开照相机操作，
        //因为上一个surfaceview已经打开照相机了，所以在这个surfaceview的holder中先不显示camera内容）
    }

    @Override
    public void surfaceCreated(SurfaceHolder holder) {
         Log.i(TAG, "surfaceCreated");
        mCamera = Camera.open(Camera.CameraInfo.CAMERA_FACING_FRONT);
        //camera调用setPreviewCallback方法传入PreviewCallback接口，获得预览帧视频，要复写onPreviewFrame方法
        mCamera.setPreviewCallback(this);
        try {
            mCamera.setPreviewDisplay(holder);
        } catch (IOException exception) {
            mCamera.release();
            mCamera = null;
        }
    }

    @Override
    public void surfaceChanged(SurfaceHolder holder, int format, int width, int height) {
        Log.i(TAG, "surfaceChanged");
        Camera.Parameters parameters = mCamera.getParameters();
        List<Camera.Size> previewSizes = parameters.getSupportedPreviewSizes();
        int length = previewSizes.size();
        for (int i = 0; i < length; i++) {
            Log.i("size","SupportedPreviewSizes : " + previewSizes.get(i).width + "x" + previewSizes.get(i).height);
        }
        parameters.setPreviewSize(previewWidth, previewHeight);
        parameters.setPreviewFormat(PixelFormat.YCbCr_420_SP);
        parameters.setPreviewFrameRate(10);
        mCamera.setParameters(parameters);
        mCamera.setDisplayOrientation(90);
        mCamera.startPreview();
    }

    @Override
    public void surfaceDestroyed(SurfaceHolder holder) {
         Log.i(TAG, "surfaceDestroyed");
        if (mCamera != null) {
            mCamera.setPreviewCallback(null);
            mCamera.stopPreview();
            mCamera.release();
            mCamera = null;
        }
    }

    @Override
    public void onPreviewFrame(byte[] data, Camera camera) {
        Log.i(TAG, "onPreviewFrame.");
    }
}
```
## 界面效果

<div align="center">
![](http://ofhbt8uhx.bkt.clouddn.com/GIF5.gif)
</div>

## 将预览帧显示在surfaceview中
### 布局
```xml
 <SurfaceView android:id="@+id/remoteView"
            android:layout_height="120dip"
            android:layout_width="160dip">
 </SurfaceView>
```
### 主要代码
**初始化显示surfaceview**
```java
	SurfaceView mRemoteView;
	SurfaceHolder mRemoteSurfaceHolder;
```
```java
	mRemoteView = (SurfaceView) findViewById(R.id.remoteView);
	mRemoteSurfaceHolder = mRemoteView.getHolder();
    mRemoteSurfaceHolder.setType(SurfaceHolder.SURFACE_TYPE_GPU);
```
**在onPreviewFrame(byte[] data, Camera camera)中将预览帧中的bmp显示**
```java
if (remoteVideoVisible) {
	int w =  camera.getParameters().getPreviewSize().width;
    int h =  camera.getParameters().getPreviewSize().height;
    drawRemoteVideo(data,w,h);
}
```
**方法drawRemoteVideio用来在surfaceview中绘制**
```java
private void drawRemoteVideo(final byte[] imageData, int width, int height) {
        //Log.i(TAG, "drawRemoteVideo");
        //byte[] data=rotateYUV420Degree90(imageData,width, height);
        byte[] data=new byte[width*height*3/2];
        YUV420spRotate90Anticlockwise(imageData,data,width,height);
        //先使用下面转换格式方法decodeYUV420SP，将图片数组转化为rgb数组
        int[] rgb = decodeYUV420SP(data, height, width);
        //根据转换的帧图片的数据流为rgb来构造一个bitmap
        //使用rgb数组构造图片
        Bitmap bmp = Bitmap.createBitmap(rgb, height, width, Bitmap.Config.ARGB_8888);
        //将位图按一定比例裁减
        bmp=Bitmap.createScaledBitmap(bmp, mRemoteView.getWidth(), mRemoteView.getHeight(), true);
        //SurfaceHolder.lockCanvas()获得Canvas对象并锁定画布
        //这里才处理帧视频的holder，此接mRemoteSurfaceHolder = mRemoteView.getHolder()，以外都是在处理预览的surfaceview和surfaceholder
        Canvas canvas = mRemoteSurfaceHolder.lockCanvas();
        canvas.drawBitmap(bmp, 0, 0, null);
        //SurfaceHolder.unlockCanvasAndPost(Canvas canvas)结束锁定画图，并提交改变，将图形显示。
        mRemoteSurfaceHolder.unlockCanvasAndPost(canvas);
        //这里处理的图像大小会是截取部分的，因为remoteView的大小与取得的图像不同。所以如果要显示全像，要再处理图像的缩放：
        //bmp=Bitmap.createScaledBitmap(bmp,mRemoteView.getWidth(), mRemoteView.getHeight(),true);然后再用canvas画出来。
    }
```
**YUV420spRotate90Anticlockwise方法用来将摄像头预览帧的图像逆时针旋转90度**
```java
//逆时针旋转90
    private void YUV420spRotate90Anticlockwise(byte[] src, byte[] dst, int width, int height) {
        int wh = width * height;
        int uvHeight = height >> 1;

        //旋转Y
        int k = 0;
        for (int i = 0; i < width; i++) {
            int nPos = width - 1;
            for (int j = 0; j < height; j++) {
                dst[k] = src[nPos - i];
                k++;
                nPos += width;
            }
        }

        for (int i = 0; i < width; i += 2) {
            int nPos = wh + width - 1;
            for (int j = 0; j < uvHeight; j++) {
                dst[k] = src[nPos - i - 1];
                dst[k + 1] = src[nPos - i];
                k += 2;
                nPos += width;
            }
        }
    }
```
**decodeYUV420SP，将图片数组转化为rgb数组**
```java
//用于转换data字节流中接收的帧视频图像为格式YUV420SP的数据流，将处理完的rgb传给Bitmap.createBitmap用于构造一个bitmap  BitmapFactory.decodeByteArray()再使用这个函数解析图片
    public int[] decodeYUV420SP(byte[] yuv420sp, int width, int height) {
        final int frameSize = width * height;
        int rgb[] = new int[width * height];
        for (int j = 0, yp = 0; j < height; j++) {
            int uvp = frameSize+(j >> 1)* width, u = 0, v = 0;
            for (int i = 0; i < width; i++, yp++) {
                int y = (0xff & ((int) yuv420sp[yp])) - 16;
                if (y < 0) y = 0;
                if ((i & 1) == 0) {
                    v = (0xff & yuv420sp[uvp ]) - 128;
                    u = (0xff & yuv420sp[uvp ]) - 128;
                }
                int y1192 = 1192 * y;
                int r = (y1192+1634 * v);
                int g = (y1192 - 833 * v - 400 * u);
                int b = (y1192+2066 * u);
                if (r < 0) r = 0;
                else if (r > 262143) r = 262143;
                if (g < 0) g = 0;
                else if (g > 262143) g = 262143;
                if (b < 0) b = 0;
                else if (b > 262143) b = 262143;
                rgb[yp] = 0xff000000 | ((r << 6) & 0xff0000) | ((g >> 2) &
                        0xff00) | ((b >> 10) & 0xff);
            }
        }
        return rgb;
    }
```
## 在预览帧的bitmap图像中做人脸定位
**定位算法使用Seetaface中的facealignment**
### 关键类解释
#### CMSeetaFace类
```java
package com.tangjie.dzseetaface;

public class CMSeetaFace {
 
	//人脸范围
    public int left, right, top, bottom;
    
    public float roll_angle;  //旋转
    public float pitch_angle;	//俯仰
    public float yaw_angle;	//偏头
        
    //5个点的坐标，眼睛，鼻子，嘴巴
    public int landmarks[] = new int[10];
    
    //人脸特征
	public float features[] = new float[2048];

//	public CMSeetaFace(int left, int right, int top, int bottom) {
//		super();
//		this.left = left;
//		this.right = right;
//		this.top = top;
//		this.bottom = bottom;
//	}
}
```
#### SeetaFace类（包括人脸模型初始化方法和人脸检测和定位方法）
```java
package com.tangjie.dzseetaface;

import android.graphics.Bitmap;

public class SeetaFace {
	static {
		System.loadLibrary("SeetafaceSo");
	}

	//初始化so库，告诉底层人脸识别模型文件的目录
	//该目录下应当包括这3个文件：seeta_fd_frontal_v1.0.bin,seeta_fa_v1.1.bin,seeta_fr_v1.0.bin
	public native boolean init(String vModelDir);
	
	/**
	 * 检测人脸
	 * @param vBmp：待检测人脸的大图
	 * @param vFaceBmp：其中一个人脸抠图
	 * @return
	 */
	public native CMSeetaFace[] DetectFaces(Bitmap vBmp, Bitmap vFaceBmp);	
} 
```
**这里涉及android的NDK开发,具体怎么调用的我们以后再说，现在我只是将jni文件中的c++文件全部生成.so文件方便调用**
$$libSeetafaceSo.so$$
**下面是所有用到的类的截图**

<div align="center">
![](http://ofhbt8uhx.bkt.clouddn.com/111.png)
</div>

#### 在预览帧中拿到bitmap方法下面
```java
 CMSeetaFace[] tRectFaces = detectAndCompareFace(bmp);
        Bitmap tempbmp=draw(bmp,tRectFaces);
        if(tRectFaces!=null){
            Bitmap bitmap=Bitmap.createBitmap(tempbmp, tRectFaces[0].landmarks[0]-40, tRectFaces[0].landmarks[1]-40, 70, 70, null, false);
            bitmap=Bitmap.createScaledBitmap(bitmap,mEyeView.getWidth(),mEyeView.getHeight(),false);
            Bitmap bitmap2=binaryzation(bitmap);
            bitmap2=changeBitmap(bitmap2);
            Canvas canvas = mEyeSurfaceHolder.lockCanvas();
            canvas.drawBitmap(bitmap2, 0, 0, null);
            //SurfaceHolder.unlockCanvasAndPost(Canvas canvas)结束锁定画图，并提交改变，将图形显示。
            mEyeSurfaceHolder.unlockCanvasAndPost(canvas);
        }
```
#### detectAndCompareFace方法
```java
 private CMSeetaFace[] detectAndCompareFace(Bitmap bmp) {
        int width = bmp.getWidth();
        int height = bmp.getHeight();
        Bitmap mFaceBmp = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);

        CMSeetaFace[] tRetFaces;
        long t = System.currentTimeMillis();
        Log.i("jni", jni + "");
        tRetFaces = jni.DetectFaces(bmp, mFaceBmp);

        t = System.currentTimeMillis() - t;
        return tRetFaces;
    }
```
#### draw方法
```java
private Bitmap draw(Bitmap bmp,CMSeetaFace[] tRetFaces){
        Bitmap tempBitmap = bmp.copy(Bitmap.Config.ARGB_8888, true);
        Canvas canvas = new Canvas(tempBitmap);
        Paint paint = new Paint();
        paint.setColor(Color.RED);
        paint.setStyle(Paint.Style.STROKE);//不填充
        paint.setStrokeWidth(2);  //线的宽度
        if(tRetFaces!=null){
            for(int i=0;i<tRetFaces.length;i++){
                canvas.drawRect(tRetFaces[i].left, tRetFaces[i].top, tRetFaces[i].right, tRetFaces[i].bottom, paint);
                for(int j=0;j<5;j++){
                    int px = tRetFaces[i].landmarks[j*2];
                    int py = tRetFaces[i].landmarks[j*2+1];
                    canvas.drawCircle(px, py, 2, paint);// 小圆
                }
            }
        }
        return tempBitmap;
    }
```
#### 显示效果如下所示

<div align="center">
![](http://ofhbt8uhx.bkt.clouddn.com/GIF6.gif)
</div>
