/**
 * Created by Administrator on 2017/1/16.
 */
var loadData=[
    {name:"backImage",path:"./images/backImage.png"},
    {name:"r1",path:"./images/r1.png"},
    {name:"r2",path:"./images/r2.png"},
    {name:"r3",path:"./images/r3.png"},
    {name:"r4",path:"./images/r4.png"}
];
var loadingLayer,backLayer,graphicsMap,nextLayer;
//方块类变量，用于生成新的方块
var Box;
//当前方块的位置
var pointBox={x:0,y:0};
//当前方块，预览方块
var nowBox,nextBox;
//方块数据数组
var nodeList;
//得分相关
var point=0,pointText;
//消除层数相关
var del=0,delText;
//方块下落速度相关
var speed=15,speedMax=15,speedText,speedIndex = 0;
//方块区域起始位置
var START_X1=15,START_Y1=20,START_X2=228,START_Y2=65;
//控制相关
var myKey = {
    keyControl:null,
    step:1,
    stepindex:0,
    isTouchDown:false,
    touchX:0,
    touchY:0,
    touchMove:false
};
//方块坐标数组初始化
var map;
var bitmapdataList;

init(50,"mylegend",320,480,main);
function main(){
    //方块类变量初始化
    Box=new Box();
    //方块坐标数组初始化
    map=[
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0]
    ];
    //游戏全屏显示
    LGlobal.stageScale = LStageScaleMode.SHOW_ALL;
    LSystem.screen(LStage.FULL_SCREEN);
    //居中
    LGlobal.align = LStageAlign.TOP_MIDDLE;
    addListeners();//监听屏幕尺寸的变化
    loadingLayer=new LoadingSample5();
    addChild(loadingLayer);
    LLoadManage.load(loadData,function(progess){
        loadingLayer.setProgress(progess);
    },gameInit);
}
function gameInit(result){
    loadData=result;
    removeChild(loadingLayer);
    loadingLayer=null;
    //背景初始化
    backLayer=new LSprite();
    backLayer.graphics.drawRect(1,"#000000",[0,0,LGlobal.width,LGlobal.height],"#000000");
    addChild(backLayer);
    //显示游戏标题
    var title=new LTextField();
    title.x=80;
    title.y=100;
    title.size=30;
    title.color="#ffffff";
    title.text="俄罗斯方块";
    backLayer.addChild(title);
    //显示说明文字
    backLayer.graphics.drawRect(1,"#ffffff",[50,240,220,40]);
    var textClick=new LTextField();
    textClick.size=18;
    textClick.color="#ffffff";
    textClick.text="点击页面开始游戏";
    textClick.x=(LGlobal.width-textClick.getWidth())/2;
    textClick.y=245;
    backLayer.addChild(textClick);
    backLayer.addEventListener(LMouseEvent.MOUSE_UP,gameToStart);
}

function gameToStart(){
    //背景层清空
    backLayer.die();
    backLayer.removeAllChild();
    //背景图片显示
    var bgPic=new LBitmap(new LBitmapData(loadData["backImage"]));
    backLayer.addChild(bgPic);
    //得分表示
    pointText = new LTextField();
    pointText.x = 240;
    pointText.y = 200;
    pointText.size = 20;
    backLayer.addChild(pointText);
    //消除层数表示
    delText = new LTextField();
    delText.x = 240;
    delText.y = 290;
    delText.size = 20;
    backLayer.addChild(delText);
    //速度表示
    speedText = new LTextField();
    speedText.x = 240;
    speedText.y = 385;
    speedText.size = 20;
    backLayer.addChild(speedText);
    //将游戏得分，消除层数以及游戏速度显示到画面上
    showText();
    //方块绘制层初始化
    graphicsMap = new LSprite();
    backLayer.addChild(graphicsMap);
    //方块预览层初始化
    nextLayer = new LSprite();
    backLayer.addChild(nextLayer);
    bitmapdataList=[
        new LBitmapData(loadData["r1"]),
        new LBitmapData(loadData["r2"]),
        new LBitmapData(loadData["r3"]),
        new LBitmapData(loadData["r4"])
    ];
    //方块数据数组的初始化
    nodeList=[];
    var i, j,nArr,bitmap;
    for(i=0;i<map.length;i++){
        nArr=[];
        for(j=0;j<map[0].length;j++){
            bitmap=new LBitmap(bitmapdataList[0]);
            bitmap.x=bitmap.getWidth()*j+START_X1;
            bitmap.y=bitmap.getHeight()*i+START_Y1;
            graphicsMap.addChild(bitmap);
            nArr[j]={"index":-1,"value":0,"bitmap":bitmap};
        }
        nodeList[i]=nArr;
    }
    //预览层显示
    getNewBox();
    //将当前下落方块显示到画面上
    plusBox();
    //添加循环播放事件侦听
    backLayer.addEventListener(LEvent.ENTER_FRAME,onFrame);
    //添加鼠标按下事件（即触屏事件）
    backLayer.addEventListener(LMouseEvent.MOUSE_DOWN,touchDown);
    backLayer.addEventListener(LMouseEvent.MOUSE_UP,touchUp);
    backLayer.addEventListener(LMouseEvent.MOUSE_MOVE,touchMove);

    backLayer.addEventListener
    if(!LGlobal.canTouch){
        //在pc上运行时，添加键盘事件
        LEvent.addEventListener(LGlobal.window,LKeyboardEvent.KEY_DOWN,onkeydown);
        LEvent.addEventListener(LGlobal.window,LKeyboardEvent.KEY_UP,onkeyup);
    }

}
/*
创建方块类
 */
function Box(){
    var self=this;
    self.box1=
        [[0,0,0,0],
         [0,0,0,0],
         [1,1,1,1],
         [0,0,0,0]];
    self.box2=
        [[0,0,0,0],
         [0,1,1,0],
         [0,1,1,0],
         [0,0,0,0]];
    self.box3=
        [[0,0,0,0],
         [1,1,1,0],
         [0,1,0,0],
         [0,0,0,0]];
    self.box4=
        [[0,1,1,0],
         [0,1,0,0],
         [0,1,0,0],
         [0,0,0,0]];
    self.box5=
        [[0,1,1,0],
         [0,0,1,0],
         [0,0,1,0],
         [0,0,0,0]];
    self.box6=
        [[0,0,0,0],
         [0,1,0,0],
         [0,1,1,0],
         [0,0,1,0]];
    self.box7=
        [[0,0,0,0],
         [0,0,1,0],
         [0,1,1,0],
         [0,1,0,0]];
    self.box=[self.box1,self.box2,self.box3,self.box4,self.box5,self.box6,self.box7];
}
Box.prototype={
    getBox:function(){
        var self=this;
        var num=7*Math.random();
        var index=parseInt(num);
        var result=[];
        var colorIndex=1+Math.floor(Math.random()*4);
        var i,j;
        for(i=0;i<4;i++){
            var child=[];
            for(j=0;j<4;j++){
                child[j]=self.box[index][i][j]*colorIndex;
            }
            result[i]=child;
        }
        return result;

    }
}
//游戏得分，消除层数以及游戏速度显示
function showText(){
    pointText.text = point;
    delText.text = del;
    speedText.text = speedMax - speed + 1;
}
/*
获取下一块方块
 */
function getNewBox(){
    if(nextBox==null){
        nextBox=Box.getBox();
    }
    nowBox=nextBox;
    pointBox.x=3;
    pointBox.y=-4;
    nextBox=Box.getBox();
    console.log(nextBox);
    nextLayer.removeAllChild();
    var i, j,bitmap;
    for(i=0;i<nextBox.length;i++){
        for(j=0;j<nextBox[0].length;j++){
            if(nextBox[i][j]==0){
                continue;
            }
            console.log(bitmapdataList[nextBox[i][j]-1]);
            bitmap=new LBitmap(bitmapdataList[nextBox[i][j]-1]);
            bitmap.x=bitmap.getWidth()*j+START_X2;
            bitmap.y=bitmap.getHeight()*i+START_Y2;
            nextLayer.addChild(bitmap);
        }
    }
}
/*
添加方块
 */
function plusBox(){
    var i,j;
    for(i=0;i<nowBox.length;i++){
        for(j=0;j<nowBox[i].length;j++){
            if(i+pointBox.y<0||i+pointBox.y>=map.length||j+pointBox.x<0||j+pointBox.x>=map[0].length){
                continue;
            }
            map[i+pointBox.y][j+pointBox.x]=nowBox[i][j]+map[i+pointBox.y][j+pointBox.x];
            nodeList[i+pointBox.y][j+pointBox.x]["index"]=map[i+pointBox.y][j+pointBox.x]-1;
        }
    }
}
/*
移除方块
 */
function minusBox(){
    var i,j;
    for(i=0;i<nowBox.length;i++){
        for(j=0;j<nowBox[i].length;j++){
            if(i+pointBox.y<0||i+pointBox.y>=map.length||j+pointBox.x<0||j+pointBox.x>=map[0].length){
                continue;
            }
            map[i+pointBox.y][j+pointBox.x]=map[i+pointBox.y][j+pointBox.x]-nowBox[i][j];
            nodeList[i+pointBox.y][j+pointBox.x]["index"]=map[i+pointBox.y][j+pointBox.x]-1;
        }
    }
}
/*
判断是否可以移动
 */
function checkPlus(nx,ny){
    var i,j;
    for(i=0;i<nowBox.length;i++){
        for(j=0;j<nowBox[i].length;j++){
            if(i+pointBox.y+ny<0){
                //判断网格未落入网格内
                continue;
            }else if(i+pointBox.y+ny>=map.length||j+pointBox.x+nx<0||j+pointBox.x+nx>=map[0].length){
                //判断网格超出范围
                if(nowBox[i][j]==0){
                    continue;
                }else{
                    return false;
                }
            }
            if(nowBox[i][j]>0&&map[i+pointBox.y+ny][j+pointBox.x+nx]>0){
                //移动的位置有方块，也无法移动
                return false;
            }

        }
    }
    return true;
}
/*
绘制所有方块
 */
function drawMap(){
    var i, j,box1=15;
    for(i=0;i<map.length;i++){
        for(j=0;j<map[0].length;j++){
            if(nodeList[i][j]["index"]>=0){
                nodeList[i][j]["bitmap"].bitmapData=bitmapdataList[nodeList[i][j]["index"]];
            }else{
                nodeList[i][j]["bitmap"].bitmapData=null;
            }
        }
    }
}

/*
游戏结束
 */
function gameOver(){
    backLayer.die();
    var txt=new LTextField();
    txt.color="#ff0000";
    txt.size=40;
    txt.text="游戏结束";
    txt.x=(LGlobal.width-txt.getWidth())*0.5;
    txt.y=200;
    backLayer.addChild(txt);
}

//键盘按下事件
function onkeydown(event){
    if(myKey.keyControl!=null)return;
    if(event.keyCode==37){
        myKey.keyControl="left";
    }else if(event.keyCode==38){
        myKey.keyControl="up";
    }else if(event.keyCode==39){
        myKey.keyControl="right";
    }else if(event.keyCode==40){
        myKey.keyControl="down";
    }
}

//键盘弹起事件
function onkeyup(event){
    myKey.keyControl=null;
    myKey.stepindex=0;
}

/*
方形变形
 */
function changeBox(){
    var saveBox=nowBox;
    nowBox=[
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
    ];
    var i,j;
    for(i=0;i<saveBox.length;i++){
        for(j=0;j<saveBox[1].length;j++){
            nowBox[i][j]=saveBox[(3-j)][i];
        }
    }
    if(!checkPlus(0,0)){
        nowBox=saveBox;
    }

}

//鼠标按下
function touchDown(event){
    myKey.isTouchDown = true;
    myKey.touchX = Math.floor(event.selfX / 20);
    myKey.touchY = Math.floor(event.selfY / 20);
    myKey.touchMove = false;
    myKey.keyControl = null;

}
//鼠标弹起
function touchUp(event){
    myKey.isTouchDown = false;
    if(!myKey.touchMove)myKey.keyControl = "up";
}
//鼠标移动
function touchMove(event){
    if(!myKey.isTouchDown)return;
    var mx = Math.floor(event.selfX / 20);
    if(myKey.touchX == 0){
        myKey.touchX = mx;
        myKey.touchY = Math.floor(event.selfY / 20);
    }
    if(mx > myKey.touchX){
        myKey.keyControl = "right";
    }else if(mx < myKey.touchX){
        myKey.keyControl = "left";
    }
    if(Math.floor(event.selfY / 20) > myKey.touchY){
        myKey.keyControl = "down";
    }
}

//消除指定层的方块
function moveLine(line){
    var i;
    for(i=line;i>1 ;i--){
        for(j=0;j<map[0].length;j++){
            map[i][j]=map[i-1][j];
            nodeList[i][j].index=nodeList[i-1][j].index;
        }
    }
    for(j=0;j<map[0].length;j++){
        map[0][j]=0;
        nodeList[0][j].index=-1;
    }
}
//消除可消除的方块
function removeBox(){
    var i,j,count = 0;
    for(i=pointBox.y;i<(pointBox.y+4);i++){
        if(i < 0 || i >= map.length)continue;
        for(j=0;j<map[0].length;j++){
            if(map[i][j]==0){
                break;
            }
            if(j==map[0].length - 1){
                moveLine(i);
                count++;
            }
        }
    }
    if(count == 0)return;
    del += count;
    if(count == 1){
        point += 1;
    }else if(count == 2){
        point += 3;
    }else if(count == 3){
        point += 6;
    }else if(count == 4){
        point += 10;
    }
    if(speed > 1 && del / 100 >= (speedMax - speed + 1)){
        speed--;
    }
    showText();
}

function onFrame(){
    //首先将当前下落方块移除画面
    minusBox();
    if(myKey.keyControl!=null&&myKey.stepindex--<0){
        myKey.stepindex=myKey.step;
        switch(myKey.keyControl){
            case "left":
                if(checkPlus(-1,0)){
                    pointBox.x-=1;
                    if(LGlobal.canTouch || true){
                        myKey.keyControl = null;
                        myKey.touchMove = true;
                        myKey.touchX = 0;
                    }
                }
                break;
            case "right":
                if(checkPlus(1,0)){
                    pointBox.x+=1;
                    if(LGlobal.canTouch || true){
                        myKey.keyControl = null;
                        myKey.touchMove = true;
                        myKey.touchX = 0;
                    }
                }
                break;
            case "down":
                if(checkPlus(0,1)){
                    pointBox.y+=1;
                    if(LGlobal.canTouch || true){
                        myKey.keyControl = null;
                        myKey.touchMove = true;
                        myKey.touchY = 0;
                    }
                }
                break;
            case "up":
                changeBox();
                if(LGlobal.canTouch || true){
                    myKey.keyControl = null;
                    myKey.stepindex = 0;
                }
                break;
        }
    }
    if(speedIndex++>speed){
        speedIndex=0;
        if(checkPlus(0,1)){
            //可以下移
            pointBox.y++;
        }else{
            //无法下移
            plusBox();
            if(pointBox.y<0){
                //如果当前方块的坐标小于零，则游戏结束
                gameOver();
                return;
            }
            removeBox();
            //取得新方块
            getNewBox();
        }
    }
    plusBox();
    drawMap();

}

function addListeners() {
    window.addEventListener('resize', resize);
}

function resize() {
    LGlobal.align = LStageAlign.TOP_MIDDLE;
    LGlobal.stageScale = LStageScaleMode.SHOW_ALL;
    LSystem.screen(LStage.FULL_SCREEN);
}