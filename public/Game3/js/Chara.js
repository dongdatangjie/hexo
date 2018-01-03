/**
 * Created by Administrator on 2017/1/19.
 */
function Chara(){
    base(this,LSprite,[]);
    var self=this;
    self.moveType=null;//控制左右移动
    self.hp=3;//当前血量
    self.maxHp=3;//最大血量
    self.hpCtrl = 0;//控制血量的回复速度
    self.isJump=true;//判断是否处于跳跃状态
    self.index=0;//控制动作变换快慢
    self.speed=0;//人物下落速度
    self._charaOld=0;//每次下落前的y坐标
    var list=LGlobal.divideCoordinate(960,50,1,24);
    var data=new LBitmapData(loadData["hero"],0,0,40,50);
    self.anime=new LAnimation(self,data,[
        [list[0][0]],
        [list[0][1]],
        [list[0][2],list[0][3],list[0][4],list[0][5],list[0][6],list[0][7],list[0][8],list[0][9],list[0][10],list[0][11],list[0][12]],
        [list[0][13],list[0][14],list[0][15],list[0][16],list[0][17],list[0][18],list[0][19],list[0][20],list[0][21],list[0][22],list[0][23]]
    ]);
}
Chara.prototype.onframe=function(){
    var self=this;
    self._charaOld=self.y;//将当前位置设置为旧位置
    self.y+=self.speed;
    self.speed+=g;//下路速度加快
    if(self.speed>20)self.speed=20;//速度最大20
    //如果掉落超出屏幕大小，则生命值降为0
    if(self.y>LGlobal.height){
        self.hp = 0;
    }else if(self.y<10){
        self.hp--;
        self.y+=20;
        if(self.speed<0)self.speed=0;
    }
    //控制人物行动方向
    if(self.moveType=="left"){
        self.x-=MOVE_STEP;
    }else if(self.moveType=="right"){
        self.x+=MOVE_STEP;
    }
    //控制主角的x坐标防止主角移出屏幕
    if(self.x<-10){
        self.x=-10;
    }else if(self.x > LGlobal.width-30){
        self.x=LGlobal.width-30;
    }
    //主角控制动作变换
    if(self.index-->0){
        return;
    }
    self.index=10;
    self.anime.onframe();
}
Chara.prototype.changeAction=function(){
    var self=this;
    if(self.moveType=="left"){
        hero.anime.setAction(3);
    }else if(self.moveType=="right"){
        hero.anime.setAction(2);
    }else if(hero.isJump){
        hero.anime.setAction(1,0);
    }else{
        hero.anime.setAction(0,0);
    }
}