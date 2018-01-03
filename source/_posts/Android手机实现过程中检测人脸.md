---
title: Android手机实现过程中检测人脸
date: 2016-10-25 23:56:51
tags: [Android,人脸检测]
---
***
**前面我们实现了通过在图片中检测到人脸，之后我们通过在android的surfaceview预览相机功能中加入人脸识别的代码从而实现在行车过程中能够一直检测人脸。作用是预防驾驶员行驶时间过长导致疲劳驾驶的情况出现。**
>人脸检测方面使用的是google自带的FaceDetection算法
***
### Android程序目录结构
![目录结构](http://ofhbt8uhx.bkt.clouddn.com/ca.png)
<!--more-->
***
#### 1.CameraInterface类
**主要用来创建单例模式的camera类用来打开android手机摄像头和进行相机预览操作和关闭操作的工具类**
```java
package com.tangjie.fa1.camera;
import android.graphics.PixelFormat;
import android.hardware.Camera;
import android.util.Log;
import android.view.SurfaceHolder;
import com.tangjie.fa1.util.CamParaUtil;
import java.io.IOException;
import java.util.List;

/**
 * Created by Administrator on 2016/10/20.
 * 相机的打开与关闭，获取相机图像预览和关闭预览接口控制，相机对象使用单例模式
 */
public class CameraInterface {
    private static final String TAG = "CameraInterface";
    private float mPreviwRate = -1f;
    private Camera camera;
    private Camera.Parameters params;
    private int cameraId=-1;
    private boolean isPreviewing = false;
    private static CameraInterface cameraInterface;
    private CameraInterface(){}
    //获取单例的CameraInterface对象
    public static synchronized CameraInterface getInstance(){
        if(cameraInterface==null){
            cameraInterface=new CameraInterface();
        }
        return cameraInterface;
    }
    //打开摄像头
    public void doOpenCamera(int cameraId){
        camera=Camera.open(cameraId);
        this.cameraId=cameraId;
    }
    //预览相机
    public void doStartPreview(SurfaceHolder holder, float previewRate){
        Log.i(TAG, "doStartPreview...");
        if(isPreviewing){
            camera.stopPreview();
            return;
        }
        if(camera!=null) {
            params = camera.getParameters();
            params.setPictureFormat(PixelFormat.JPEG);
            Camera.Size pictureSize = CamParaUtil.getInstance().getPropPictureSize(params.getSupportedPictureSizes(),previewRate, 800);
            params.setPictureSize(pictureSize.width, pictureSize.height);
            Camera.Size previewSize = CamParaUtil.getInstance().getPropPreviewSize(
                    params.getSupportedPreviewSizes(), previewRate, 800);
            //设置预览尺寸
            params.setPreviewSize(previewSize.width, previewSize.height);
            camera.setDisplayOrientation(90);
            //设置是否支持对焦
            List<String> focusModes = params.getSupportedFocusModes();
            if(focusModes.contains("continuous-video")){
                params.setFocusMode(Camera.Parameters.FOCUS_MODE_CONTINUOUS_VIDEO);
            }
            camera.setParameters(params);
            try {
                camera.setPreviewDisplay(holder);
                camera.startPreview();//����Ԥ��
            } catch (IOException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
            isPreviewing = true;
            mPreviwRate = previewRate;
            params = camera.getParameters();
        }
    }
    //关闭相机预览
    public void doStopCamera(){
        if(camera!=null)
        {
            camera.setPreviewCallback(null);
            camera.stopPreview();
            isPreviewing = false;
            mPreviwRate = -1f;
            camera.release();
            camera = null;
        }
    }
    public int getCameraId(){
        return cameraId;
    }
    public Camera.Parameters getCameraParams(){
        return params;
    }
    public Camera getCamera(){
        return camera;
    }
}
```
***
#### 2.CameraSurface类
**用来使用surfaceview创建相机预览的界面**
```java
package com.tangjie.fa1.camera;

import android.content.Context;
import android.graphics.PixelFormat;
import android.hardware.Camera;
import android.util.AttributeSet;
import android.util.Log;
import android.view.SurfaceHolder;
import android.view.SurfaceView;

/**
 * Created by Administrator on 2016/10/20.
 * 创建相机预览的界面
 */
public class CameraSurface extends SurfaceView implements SurfaceHolder.Callback{
    private static final String TAG = "CameraSurface";
    private SurfaceHolder surfaceholder;
    public CameraSurface(Context context, AttributeSet attrs) {
        super(context, attrs);
        Log.i(TAG, "初始化CameraSurface");
        surfaceholder=getHolder();//拿到holder对象
        surfaceholder.setFormat(PixelFormat.TRANSLUCENT);//是窗口透明
        //surfaceholder.setType(SurfaceHolder.SURFACE_TYPE_PUSH_BUFFERS);
        surfaceholder.addCallback(this);//将callback回调添加到surfaceholder中
    }

    @Override

    public void surfaceCreated(SurfaceHolder holder) {
        Log.i(TAG, "surfaceCreated...");
        Log.i(TAG, CameraInterface.getInstance() + "");
        CameraInterface.getInstance().doOpenCamera(Camera.CameraInfo.CAMERA_FACING_FRONT);
    }

    @Override
    public void surfaceChanged(SurfaceHolder holder, int format, int width, int height) {
        Log.i(TAG, "surfaceChanged...");
        CameraInterface.getInstance().doStartPreview(surfaceholder, 1.333f);
    }

    @Override
    public void surfaceDestroyed(SurfaceHolder holder) {
        Log.i(TAG, "surfaceDestroyed...");
        CameraInterface.getInstance().doStopCamera();
    }

    public SurfaceHolder getSurfaceHolder(){
        return surfaceholder;
    }
}
```
***
#### 3.GoogleFaceDetection类
**通过实现google的人脸监听类来判断是否检测到人脸，在其中通过消息处理机制Handler来接收消息，并且返回消息信息UPDATE_FACE_RECT，用来绘制人脸图像**
```java
package com.tangjie.fa1.detect;

import android.hardware.Camera;
import android.os.Handler;
import android.os.Message;
import android.util.Log;

import com.tangjie.fa1.MainActivity;

/**
 * Created by Administrator on 2016/10/20.
 */
public class GoogleFaceDetect implements Camera.FaceDetectionListener{
    private static final String TAG="GoogleFaceDetect";
    private Handler handler;
    public GoogleFaceDetect(Handler handler){
        this.handler=handler;
    }
    @Override
    public void onFaceDetection(Camera.Face[] faces, Camera camera) {
        Log.i(TAG, "onFaceDetection...");

        //判断是否检测到人脸
        if(faces!=null){
            Message m=handler.obtainMessage();
            m.what = MainActivity.UPDATE_FACE_RECT;
            m.obj = faces;
            m.sendToTarget();
        }


    }
}
```
***
#### 4.FaceView类
**在检测到的人脸上绘制矩形红色方框，捕捉人脸**
```java
package com.tangjie.fa1.ui;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.graphics.RectF;
import android.graphics.drawable.Drawable;
import android.hardware.Camera;
import android.util.AttributeSet;
import android.widget.ImageView;

import com.tangjie.fa1.R;
import com.tangjie.fa1.camera.CameraInterface;

/**
 * Created by Administrator on 2016/10/20.
 */
public class FaceView extends ImageView {

    private Camera.Face[] mFaces;//camera中检测到的face对象
    private Paint mLinePaint;//绘图对象
    private Drawable mFaceIndicator = null;
    private Matrix mMatrix = new Matrix();
    private RectF mRect = new RectF();
    public FaceView(Context context, AttributeSet attrs) {
        super(context, attrs);
        initPaint();
        mFaceIndicator = getResources().getDrawable(R.drawable.ic_face_find_2);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        //如果检测不到人脸，则不进行绘制
        if(mFaces == null || mFaces.length < 1){
            return;
        }
        boolean isMirror = false;
        int Id = CameraInterface.getInstance().getCameraId();
        if(Id == Camera.CameraInfo.CAMERA_FACING_BACK){
            isMirror = false; 
        }else if(Id == Camera.CameraInfo.CAMERA_FACING_FRONT){
            isMirror = true;  
        }

        // Need mirror for front camera.
        mMatrix.setScale(isMirror ? -1 : 1, 1);
        // This is the value for android.hardware.Camera.setDisplayOrientation.
        mMatrix.postRotate(90);
        // Camera driver coordinates range from (-1000, -1000) to (1000, 1000).
        // UI coordinates range from (0, 0) to (width, height).
        mMatrix.postScale(getWidth() / 2000f, getHeight() / 2000f);
        mMatrix.postTranslate(getWidth() / 2f, getHeight()/ 2f);
        canvas.save();
        mMatrix.postRotate(0); 
        canvas.rotate(-0);   
        for(int i = 0; i< mFaces.length; i++){
            mRect.set(mFaces[i].rect);
            mMatrix.mapRect(mRect);
            mFaceIndicator.setBounds(Math.round(mRect.left), Math.round(mRect.top),
                    Math.round(mRect.right), Math.round(mRect.bottom));
            mFaceIndicator.draw(canvas);
//			canvas.drawRect(mRect, mLinePaint);
        }
        canvas.restore();
        super.onDraw(canvas);

    }

    public void setFaces(Camera.Face[] faces){
        this.mFaces = faces;
        invalidate();
    }
    public void clearFaces(){
        mFaces = null;
        //请求对view树进行重绘，该方法会触发ondraw方法
        invalidate();
    }

    private void initPaint(){
        mLinePaint = new Paint(Paint.ANTI_ALIAS_FLAG);
//		int color = Color.rgb(0, 150, 255);
        int color = Color.rgb(98, 212, 68);
//		mLinePaint.setColor(Color.RED);
        mLinePaint.setColor(color);
        mLinePaint.setStyle(Paint.Style.STROKE);
        mLinePaint.setStrokeWidth(5f);
        mLinePaint.setAlpha(180);
    }
}
```
***
#### 5.CamParaUtil类
**主要负责拿到camera的各种参数**
```java
package com.tangjie.fa1.util;

import android.hardware.Camera;
import android.hardware.Camera.Size;
import android.util.Log;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public class CamParaUtil {
	private static final String TAG = "CamParaUtil";
	private CameraSizeComparator sizeComparator = new CameraSizeComparator();
	private static CamParaUtil myCamPara = null;
	private CamParaUtil(){

	}
	public static CamParaUtil getInstance(){
		if(myCamPara == null){
			myCamPara = new CamParaUtil();
			return myCamPara;
		}
		else{
			return myCamPara;
		}
	}

	public Size getPropPreviewSize(List<Size> list, float th, int minWidth){
		Collections.sort(list, sizeComparator);

		int i = 0;
		for(Size s:list){
			if((s.width >= minWidth) && equalRate(s, th)){
				Log.i(TAG, "PreviewSize:w = " + s.width + "h = " + s.height);
				break;
			}
			i++;
		}
		if(i == list.size()){
			i = 0;
		}
		return list.get(i);
	}
	public Size getPropPictureSize(List<Size> list, float th, int minWidth){
		Collections.sort(list, sizeComparator);

		int i = 0;
		for(Size s:list){
			if((s.width >= minWidth) && equalRate(s, th)){
				Log.i(TAG, "PictureSize : w = " + s.width + "h = " + s.height);
				break;
			}
			i++;
		}
		if(i == list.size()){
			i = 0;
		}
		return list.get(i);
	}

	public boolean equalRate(Size s, float rate){
		float r = (float)(s.width)/(float)(s.height);
		if(Math.abs(r - rate) <= 0.03)
		{
			return true;
		}
		else{
			return false;
		}
	}

	public  class CameraSizeComparator implements Comparator<Size> {
		public int compare(Size lhs, Size rhs) {
			// TODO Auto-generated method stub
			if(lhs.width == rhs.width){
				return 0;
			}
			else if(lhs.width > rhs.width){
				return 1;
			}
			else{
				return -1;
			}
		}

	}

	/**
	 * @param params
	 */
	public  void printSupportPreviewSize(Camera.Parameters params){
		List<Size> previewSizes = params.getSupportedPreviewSizes();
		for(int i=0; i< previewSizes.size(); i++){
			Size size = previewSizes.get(i);
			Log.i(TAG, "previewSizes:width = " + size.width + " height = " + size.height);
		}
	
	}

	/**
	 * @param params
	 */
	public  void printSupportPictureSize(Camera.Parameters params){
		List<Size> pictureSizes = params.getSupportedPictureSizes();
		for(int i=0; i< pictureSizes.size(); i++){
			Size size = pictureSizes.get(i);
			Log.i(TAG, "pictureSizes:width = " + size.width
					+ " height = " + size.height);
		}
	}
	/**
	 * @param params
	 */
	public void printSupportFocusMode(Camera.Parameters params){
		List<String> focusModes = params.getSupportedFocusModes();
		for(String mode : focusModes){
			Log.i(TAG, "focusModes--" + mode);
		}
	}
}
```
***
#### 6.DisplayUtil类
**用来适配屏幕的大小，适用不同手机的效果**
```java
package com.tangjie.fa1.util;

import android.content.Context;
import android.graphics.Point;
import android.util.DisplayMetrics;
import android.util.Log;

public class DisplayUtil {
	private static final String TAG = "DisplayUtil";
	public static int dip2px(Context context, float dipValue){
		final float scale = context.getResources().getDisplayMetrics().density;                 
		return (int)(dipValue * scale + 0.5f);         
	}     
	public static int px2dip(Context context, float pxValue){
		final float scale = context.getResources().getDisplayMetrics().density;                 
		return (int)(pxValue / scale + 0.5f);         
	} 
	public static Point getScreenMetrics(Context context){
		DisplayMetrics dm =context.getResources().getDisplayMetrics();
		int w_screen = dm.widthPixels;
		int h_screen = dm.heightPixels;
		Log.i(TAG, "Screen---Width = " + w_screen + " Height = " + h_screen + " densityDpi = " + dm.densityDpi);
		return new Point(w_screen, h_screen);
		
	}
	public static float getScreenRate(Context context){
		Point P = getScreenMetrics(context);
		float H = P.y;
		float W = P.x;
		return (H/W);
	}
}
```
#### 7.MainActivity类
**显示的UI，带有计时器的代码**
```java
package com.tangjie.fa1;

import android.app.Activity;
import android.graphics.Point;
import android.hardware.Camera;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.os.SystemClock;
import android.speech.tts.TextToSpeech;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebChromeClient;
import android.widget.Chronometer;
import android.widget.ImageButton;

import com.tangjie.fa1.camera.CameraInterface;
import com.tangjie.fa1.camera.CameraSurface;
import com.tangjie.fa1.detect.GoogleFaceDetect;
import com.tangjie.fa1.ui.FaceView;
import com.tangjie.fa1.util.DisplayUtil;

import java.util.Locale;

public class MainActivity extends Activity {

    private static final String TAG = "MainActivity";

    public static final int UPDATE_FACE_RECT = 0;//重新绘制矩形人脸检测框
    public static final int CAMERA_HAS_STARTED_PREVIEW = 1;//相机开始预览

    private Chronometer driverTime;
    private Chronometer leaveTime;
    private TextToSpeech textToSpeech;
    private boolean isleave=false;

    CameraSurface surfaceView = null;
    FaceView faceView;
    ImageButton switchBtn;//切换前后摄像头
    //ImageButton shutterBtn;//切换前后摄像头
    float previewRate = -1f;//屏幕长宽比
    private MainHandler mMainHandler = null;//handler消息队列用来处理事件消息
    GoogleFaceDetect googleFaceDetect = null;//人脸检测监听器
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        initUI();
        initViewParams();
        mMainHandler=new MainHandler();
        googleFaceDetect=new GoogleFaceDetect(mMainHandler);
        switchBtn.setOnClickListener(new BtnListeners());
        mMainHandler.sendEmptyMessageDelayed(CAMERA_HAS_STARTED_PREVIEW, 1500);
        textToSpeech = new TextToSpeech(this,new TextToSpeechListener());
        driverTime=(Chronometer)findViewById(R.id.driverTime);
        leaveTime=(Chronometer)findViewById(R.id.leaveTime);
        driverTime.setOnChronometerTickListener(new Chronometer.OnChronometerTickListener() {
            @Override
            public void onChronometerTick(Chronometer chronometer) {
                String currTime = chronometer.getText().toString();
                if ("00:03:00".equals(currTime)) {
                    textToSpeech.speak("您的驾驶时间已经超过了3分钟了，请停止驾驶休息！", TextToSpeech.QUEUE_FLUSH, null);
                    new Handler().postDelayed(new Runnable() {
                        public void run() {
                            System.exit(0);
                        }
                    }, 4000);
                }
            }
        });
        leaveTime.setOnChronometerTickListener(new Chronometer.OnChronometerTickListener() {
            @Override
            public void onChronometerTick(Chronometer chronometer) {
                String currTime = chronometer.getText().toString();
                Log.i(TAG, mMainHandler.obtainMessage().obj+"");

                if ("00:00:30".equals(currTime)) {
                    textToSpeech.speak("您的离开时间已经超过了30秒了，需要重新验证人脸！", TextToSpeech.QUEUE_FLUSH, null);
                    new Handler().postDelayed(new Runnable() {
                        public void run() {
                            System.exit(0);
                        }
                    }, 4000);
                }
            }
        });
        driverTime.setBase(SystemClock.elapsedRealtime());//计时器清零
        int driverhour = (int) ((SystemClock.elapsedRealtime() - driverTime.getBase()) / 1000 / 60);
        driverTime.setFormat("0" + String.valueOf(driverhour) + ":%s");
        driverTime.start();
        leaveTime.setBase(SystemClock.elapsedRealtime());//计时器清零
        int leavehour = (int) ((SystemClock.elapsedRealtime() - leaveTime.getBase()) / 1000 / 60);
        leaveTime.setFormat("0" + String.valueOf(leavehour) + ":%s");
        leaveTime.start();

//        leaveTime.setBase(SystemClock.elapsedRealtime());//计时器清零
//        int leavehour = (int) ((SystemClock.elapsedRealtime() - driverTime.getBase()) / 1000 / 60);
//        leaveTime.setFormat("0"+String.valueOf(leavehour) + ":%s");
//        leaveTime.start();

    }
    private void initUI(){
        surfaceView = (CameraSurface)findViewById(R.id.camera_surfaceview);
        switchBtn=(ImageButton)findViewById(R.id.btn_switch);
        faceView = (FaceView)findViewById(R.id.face_view);
    }
    private void initViewParams(){
        ViewGroup.LayoutParams params = surfaceView.getLayoutParams();
        Point p = DisplayUtil.getScreenMetrics(this);//得到屏幕的分辨率(像素)
        params.width = p.x;
        params.height = p.y;
        previewRate = DisplayUtil.getScreenRate(this);
        surfaceView.setLayoutParams(params);
    }
    private class BtnListeners implements View.OnClickListener {
        @Override
        public void onClick(View v) {
            switch(v.getId()){
                case R.id.btn_switch:
                    switchCamera();
                    break;
                default:
                    break;
            }
        }

    }
    private void switchCamera(){
        stopGoogleFaceDetect();
        int newId = (CameraInterface.getInstance().getCameraId() + 1)%2;
        CameraInterface.getInstance().doStopCamera();
        CameraInterface.getInstance().doOpenCamera(newId);
        CameraInterface.getInstance().doStartPreview(surfaceView.getSurfaceHolder(), previewRate);
        //延时人脸检测
        mMainHandler.sendEmptyMessageDelayed(CAMERA_HAS_STARTED_PREVIEW, 1500);
		//startGoogleFaceDetect();

    }
    //创建一个消息队列用来收发消息
    private  class MainHandler extends Handler {

        @Override
        public void handleMessage(Message msg) {
            // TODO Auto-generated method stub
            switch (msg.what){
                case UPDATE_FACE_RECT:
                    if(msg.obj!=null){
                        leaveTime.setBase(SystemClock.elapsedRealtime());
                        Camera.Face[] faces = (Camera.Face[]) msg.obj;
                        faceView.setFaces(faces);
                    }
                    break;
                case CAMERA_HAS_STARTED_PREVIEW:
                    startGoogleFaceDetect();
                    break;
            }
            super.handleMessage(msg);
        }

    }

    private void startGoogleFaceDetect(){
        Camera.Parameters params = CameraInterface.getInstance().getCameraParams();
        //判断设备是否具备人脸检测功能
        if(params.getMaxNumDetectedFaces() > 0){
            //如果具备则绘制矩形框
            if(faceView != null){
                //先清空人脸然后就阻止了绘制
                faceView.clearFaces();
                //放view可见
                faceView.setVisibility(View.VISIBLE);
            }
            CameraInterface.getInstance().getCamera().setFaceDetectionListener(googleFaceDetect);
            CameraInterface.getInstance().getCamera().startFaceDetection();
        }
    }

    private void stopGoogleFaceDetect(){
        Camera.Parameters params = CameraInterface.getInstance().getCameraParams();
        if(params.getMaxNumDetectedFaces() > 0){
            CameraInterface.getInstance().getCamera().setFaceDetectionListener(null);
            CameraInterface.getInstance().getCamera().stopFaceDetection();
            faceView.clearFaces();
        }
    }

    public class TextToSpeechListener implements TextToSpeech.OnInitListener {
        @Override
        public void onInit(int status) {
            if (status == TextToSpeech.SUCCESS) {
                int result = textToSpeech.setLanguage(Locale.CHINA);
                if (result == TextToSpeech.LANG_MISSING_DATA
                        || result == TextToSpeech.LANG_NOT_SUPPORTED) {
                }else {
//                  textToSpeech.speak("人脸验证成功，进入下个程序", TextToSpeech.QUEUE_FLUSH,
//                                null);
                }
            }
        }
    }
}
```
***
### 结果
![截图](http://ofhbt8uhx.bkt.clouddn.com/Screenshot_2016-10-25-23-49-40_com.tencent.mm.png)