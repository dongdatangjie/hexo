/**
 * Created by tangjie on 2017/1/13.
 */
var loadData=[
    {
        name: "bu",path: "images/bu.png"
    },{
        name: "jiandao",path: "images/jiandao.png"
    },{
        name: "shitou",path: "images/shitou.png"
    },{
        name: "title",path: "images/title.png"
    }
];
var loss=0,win=0,draw=0;
var checkList=[[0,1,-1],[-1,0,1],[1,-1,0]];
var selfValue,enemyValue;
var selfBitmap,enemyBitmap;
init(50,"mylegend",800,400,main);
function main(){
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
    //新建背景层
    backLayer=new LSprite();
    addChild(backLayer);
    backLayer.graphics.drawRect(10,"#008800",[0,0,LGlobal.width,LGlobal.height],true,"#000000");
    //显示游戏标题
    var titleBitmap=new LBitmap(new LBitmapData(loadData["title"]));
    titleBitmap.x=(LGlobal.width-titleBitmap.width)/2;
    titleBitmap.y=10;
    backLayer.addChild(titleBitmap);
    //玩家方出拳
    selfBitmap=new LBitmap(new LBitmapData(loadData["shitou"]));
    selfBitmap.x=400-selfBitmap.width-50;
    selfBitmap.y=130;
    backLayer.addChild(selfBitmap);
    //电脑方出拳
    enemyBitmap=new LBitmap(new LBitmapData(loadData["shitou"]));
    enemyBitmap.x=400+50;
    enemyBitmap.y=130;
    backLayer.addChild(enemyBitmap);
    //玩家、电脑名称设定
    var nameText;
    nameText=new LTextField();
    nameText.text="玩家";
    nameText.weight="bolder";
    nameText.color="#ffffff";
    nameText.size=24;
    nameText.x=selfBitmap.x+(selfBitmap.width-nameText.getWidth())/2;
    nameText.y=95;
    backLayer.addChild(nameText);
    nameText=new LTextField();
    nameText.text="电脑";
    nameText.weight="bolder";
    nameText.color="#ffffff";
    nameText.size=24;
    nameText.x=enemyBitmap.x+(enemyBitmap.width-nameText.getWidth())/2;
    nameText.y=95;
    backLayer.addChild(nameText);
    //结果显示层初始化
    initResultLayer();
    //操作层初始化
    initClickLayer();
}

function initResultLayer(){
    resultLayer=new LSprite();
    resultLayer.graphics.drawRect(4,"#ff8800",[0,0,150,110],true,"#ffffff");
    resultLayer.x=10;
    resultLayer.y=100;
    backLayer.addChild(resultLayer);
    selfTextAll=new LTextField();
    selfTextAll.text="猜拳次数：0";
    //selfTextAll.weight="border";
    selfTextAll.x=10;
    selfTextAll.y=20;
    resultLayer.addChild(selfTextAll);
    selfTextWin=new LTextField();
    selfTextWin.text="胜利次数：0";
    //selfTextWin.weight="border";
    selfTextWin.x=10;
    selfTextWin.y=40;
    resultLayer.addChild(selfTextWin);
    selfTextLoss=new LTextField();
    selfTextLoss.text="失败次数：0";
    //selfTextLoss.weight="border";
    selfTextLoss.x=10;
    selfTextLoss.y=60;
    resultLayer.addChild(selfTextLoss);
    selfTextDraw=new LTextField();
    selfTextDraw.text="平局次数：0";
    //selfTextDraw.weight="border";
    selfTextDraw.x=10;
    selfTextDraw.y=80;
    resultLayer.addChild(selfTextDraw);
}

function initClickLayer(){
    clickLayer=new LSprite();
    clickLayer.graphics.drawRect(4,"#ff8800",[0,0,300,110],true,"#ffffff");
    clickLayer.x=250;
    clickLayer.y=275;
    var msgText=new LTextField();
    msgText.text="请出拳";
    msgText.weight="border";
    msgText.x=10;
    msgText.y=10;
    clickLayer.addChild(msgText);
    var btnShiTou=getButton("shitou");
    btnShiTou.x=30;
    btnShiTou.y=35;
    clickLayer.addChild(btnShiTou);
    btnShiTou.addEventListener(LMouseEvent.MOUSE_UP,function(event){
        selfValue=0;
        enemyValue=Math.floor(Math.random()*3);
        selfBitmap.bitmapData=new LBitmapData(loadData["shitou"]);
        if(enemyValue==0){
            enemyBitmap.bitmapData=new LBitmapData(loadData["shitou"]);
        }else if(enemyValue==1){
            enemyBitmap.bitmapData=new LBitmapData(loadData["jiandao"]);
        }else if(enemyValue==2){
            enemyBitmap.bitmapData=new LBitmapData(loadData["bu"]);
        }
        var result=checkList[selfValue][enemyValue];
        if(result==-1){
            loss+=1;
        }else if(result==1){
            win+=1;
        }else{
            draw+=1;
        }
        selfTextWin.text="胜利次数："+win;
        selfTextLoss.text="失败次数："+loss;
        selfTextDraw.text="平局次数："+draw;
        selfTextAll.text="猜拳次数："+(win+loss+draw);
    });
    var btnJiandao=getButton("jiandao");
    btnJiandao.x=115;
    btnJiandao.y=35;
    clickLayer.addChild(btnJiandao);
    btnJiandao.addEventListener(LMouseEvent.MOUSE_UP,function(event){
        selfValue=1;
        enemyValue=Math.floor(Math.random()*3);
        selfBitmap.bitmapData=new LBitmapData(loadData["jiandao"]);
        if(enemyValue==0){
            enemyBitmap.bitmapData=new LBitmapData(loadData["shitou"]);
        }else if(enemyValue==1){
            enemyBitmap.bitmapData=new LBitmapData(loadData["jiandao"]);
        }else if(enemyValue==2){
            enemyBitmap.bitmapData=new LBitmapData(loadData["bu"]);
        }
        var result=checkList[selfValue][enemyValue];
        if(result==-1){
            loss+=1;
        }else if(result==1){
            win+=1;
        }else{
            draw+=1;
        }
        selfTextWin.text="胜利次数："+win;
        selfTextLoss.text="失败次数："+loss;
        selfTextDraw.text="平局次数："+draw;
        selfTextAll.text="猜拳次数："+(win+loss+draw);
    });
    var btnBu=getButton("bu");
    btnBu.x=200;
    btnBu.y=35;
    clickLayer.addChild(btnBu);
    btnBu.addEventListener(LMouseEvent.MOUSE_UP,function(event){
        selfValue=2;
        enemyValue=Math.floor(Math.random()*3);
        selfBitmap.bitmapData=new LBitmapData(loadData["bu"]);
        if(enemyValue==0){
            enemyBitmap.bitmapData=new LBitmapData(loadData["shitou"]);
        }else if(enemyValue==1){
            enemyBitmap.bitmapData=new LBitmapData(loadData["jiandao"]);
        }else if(enemyValue==2){
            enemyBitmap.bitmapData=new LBitmapData(loadData["bu"]);
        }
        var result=checkList[selfValue][enemyValue];
        if(result==-1){
            loss+=1;
        }else if(result==1){
            win+=1;
        }else{
            draw+=1;
        }
        selfTextWin.text="胜利次数："+win;
        selfTextLoss.text="失败次数："+loss;
        selfTextDraw.text="平局次数："+draw;
        selfTextAll.text="猜拳次数："+(win+loss+draw);
    });
    backLayer.addChild(clickLayer);
}
function getButton(value){
    var btnUp=CreatImg(value,0.5,0.5,2,2);
    var btnOver=CreatImg(value,0.5,0.5,2,2);
    var btn=new LButton(btnUp,btnOver);
    return btn;
}

function addListeners() {
    window.addEventListener('resize', resize);
}

function resize() {
    LGlobal.align = LStageAlign.TOP_MIDDLE;
    LGlobal.stageScale = LStageScaleMode.SHOW_ALL;
    LSystem.screen(LStage.FULL_SCREEN);
}

//创建图片对象公共方法

function CreatImg(name,scaleX,scaleY,x,y) {
    var bitmapData = new LBitmapData(loadData[name]);
    var img = new LBitmap(bitmapData);
    img.scaleX = scaleX;
    img.scaleY = scaleY;
    img.x = x;
    img.y = y;
    return img;
}