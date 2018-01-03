/**
 * Created by Administrator on 2017/1/18.
 */
function Floor(){
    base(this,LSprite,[]);
    var self=this;
    //人物相对地板的位置
    self.hy=0;
    //地板的皮肤
    self.setView();
}
//地板的皮肤
Floor.prototype.setView=function(){}
//每一帧的操作
Floor.prototype.onframe=function(){
    var self=this;
    self.y-=STAGE_STEP;
    if(self.child){
        self.child.y-=STAGE_STEP;
        if(self.child.y<10){
            self.child.hp--;
            self.child.y+=20;
            self.child=null;
        }
    }

}
//地板的移动
Floor.prototype.hitRun=function(){}
function Floor01(){
    base(this,Floor,[]);
}
//普通地板
Floor01.prototype.setView=function(){
    var self=this;
    self.bitmap=new LBitmap(new LBitmapData(loadData["floor0"]));
    self.addChild(self.bitmap);
}
//会消失的地板
function Floor02(){
    base(this,Floor,[]);
    var self=this;
    self.ctrlIndex=0;
}
Floor02.prototype.setView=function(){
    var self=this;
    self.bitmap=new LBitmap(new LBitmapData(loadData["floor1"],0,0,100,20));
    self.addChild(self.bitmap);
}
Floor02.prototype.hitRun=function(){
    var self=this;
    self.callParent("hitRun",arguments);
    self.ctrlIndex++;
    if(self.ctrlIndex>=40){
        self.parent.removeChild(this);
    }else if(self.ctrlIndex==20){
        self.bitmap.bitmapData.setCoordinate(100,0);
    }
}
//带刺的地板
function Floor03(){
    base(this,Floor,[]);
    this.hit=false;
    this.hy=10;
}
Floor03.prototype.setView=function(){
    var self=this;
    self.bitmap=new LBitmap(new LBitmapData(loadData["floor3"],0,0,100,20));
    self.addChild(self.bitmap);
}
Floor03.prototype.hitRun=function(){
    var self=this;
    self.callParent("hitRun",arguments);
    if(self.hit){
        return;
    }
    self.hit=true;
    self.child.hp-=1;
}
//带弹性的地板
function Floor04(){
    base(this,Floor,[]);
    var self=this;

    self.ctrlIndex=0;
    this.hy=8;
}
Floor04.prototype.setView = function(){
    var self = this;
    self.bitmap = new LBitmap(new LBitmapData(loadData["floor2"],0,0,100,20));
    self.addChild(self.bitmap);
}
Floor04.prototype.hitRun=function(){
    var self = this;
    self.callParent("hitRun",arguments);
    self.ctrlIndex = 0;
    self.child.y -= self.hy;
    self.child.speed = -4;
    self.child.isJump = true;
    self.child = null;
    self.bitmap.bitmapData.setCoordinate(100,0);
}
Floor04.prototype.onframe = function (){
    var self = this;
    self.callParent("onframe",arguments);
    self.ctrlIndex++;
    if(self.ctrlIndex == 20)self.bitmap.bitmapData.setCoordinate(0,0);
}
//右移动的地板
function Floor05(){
    base(this,Floor,[]);
}
Floor05.prototype.setView=function(){
    var self=this;
    self.graphics.drawRect(1,"#cccccc",[10,2,80,16]);
    self.wheelLeft=new LBitmap(new LBitmapData(loadData["wheel"]));
    self.addChild(self.wheelLeft);
    self.wheelRight=new LBitmap(new LBitmapData(loadData["wheel"]));
    self.wheelRight.x=100-self.wheelRight.getWidth();
    self.addChild(self.wheelRight);
}
Floor05.prototype.onframe=function(){
    var self = this;
    self.callParent("onframe",arguments);
    self.wheelLeft.rotate+=2;
    self.wheelRight.rotate+=2;
}
Floor05.prototype.hitRun=function(){
    var self=this;
    self.callParent("hitRun",arguments);
    self.child.x+=(MOVE_STEP-1);
}
//左移动的地板
function Floor06(){
    base(this,Floor,[]);
}
Floor06.prototype.setView=function(){
    var self=this;
    self.graphics.drawRect(1,"#cccccc",[10,2,80,16]);
    self.wheelLeft=new LBitmap(new LBitmapData(loadData["wheel"]));
    self.addChild(self.wheelLeft);
    self.wheelRight=new LBitmap(new LBitmapData(loadData["wheel"]));
    self.wheelRight.x=100-self.wheelRight.getWidth();
    self.addChild(self.wheelRight);
}
Floor06.prototype.onframe=function(){
    var self = this;
    self.callParent("onframe",arguments);
    self.wheelLeft.rotate-=2;
    self.wheelRight.rotate-=2;
}
Floor06.prototype.hitRun=function(){
    var self=this;
    self.callParent("hitRun",arguments);
    self.child.x-=(MOVE_STEP-1);
}