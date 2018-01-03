/**
 * Created by Administrator on 2017/1/25.
 */
var backLayer,cLayer,enemy,gameOver;
var point={x:100,y:200};
init(20,"mylegend",600,400,main);
function main(){
    LGlobal.setDebug(true);
    LGlobal.box2d=new LBox2d();
    backLayer=new LSprite();
    addChild(backLayer);
    backLayer.graphics.drawRect(1,"#cc3300",[0,0,600,10],true,"#cc3300");
    backLayer.graphics.drawRect(1,"#cc3300",[590,0,10,400],true,"#cc3300");
    backLayer.graphics.drawRect(1,"#cc3300",[0,390,600,10],true,"#cc3300");
    backLayer.graphics.drawRect(1,"#cc3300",[0,0,10,400],true,"#cc3300");
    backLayer.graphics.drawRect(1,"#cc3300",[220,200,10,200],true,"#cc3300");
    backLayer.graphics.drawRect(1,"#cc3300",[230,270,30,10],true,"#cc3300");

    cLayer=new LSprite();
    backLayer.addChild(cLayer);
    //通过顶点坐标数组加入四面墙
    var shapeArray=[
        [[0,0],[600,0],[600,10],[0,10]],
        [[590,0],[600,0],[600,400],[590,400]],
        [[0,390],[600,390],[600,400],[0,400]],
        [[0,0],[10,0],[10,400],[0,400]],
        [[220,200],[230,200],[230,400],[220,400]],
        [[230,270],[260,270],[260,280],[230,280]]

    ];
    cLayer.addBodyVertices(shapeArray,0,0,0,.5,.4,.5);
    backLayer.graphics.drawArc(1,"#336699",[point.x,point.y,50,0,2*Math.PI],true,"#336699")

    enemy=new LSprite();
    enemy.name="enemy";
    enemy.x=250;
    enemy.y=240;
    backLayer.addChild(enemy);
    enemy.addBodyPolygon(20,20,1,5,0.4,0.2);
    enemy.graphics.drawRect(1,"#FF3399",[0,0,20,20],true,"#FF3399");
    //加入鼠标事件
    backLayer.addEventListener(LMouseEvent.MOUSE_DOWN,createBox);
    //加入碰撞侦听事件
    LGlobal.box2d.setEvent(LEvent.POST_SOLVE,postSolve);
}
//侦听事件
function postSolve(contact,impulse){
    if(gameOver)return;
    var objA=contact.GetFixtureA().GetBody().GetUserData();
    var objB=contact.GetFixtureB().GetBody().GetUserData();
    if((objA.name=="mybox" && objB.name=="enemy")||(objB.name=="mybox"&&objA.name=="enemy")){
        gameOver=true;
        backLayer.removeChild(enemy);
    }
}

function createBox(event){
    if((event.offsetX-point.x)*(event.offsetX-point.x)+(event.offsetY-point.y)*(event.offsetY-point.y)>50*50)
        return;
    var box01=new LSprite();
    box01.name="mybox";
    box01.x=event.selfX;
    box01.y=event.selfY;
    backLayer.addChild(box01);
    box01.graphics.drawArc(1,"#000",[10,10,10,0,2*Math.PI],true,"#000");
    box01.addBodyCircle(10,0,0,1,1,0.5,0.6);
    var angle=Math.atan2(event.offsetY-point.y,event.offsetX-point.x);
    var force=1000;
    var vec=new LGlobal.box2d.b2Vec2(force*Math.cos(angle),force*Math.sin(angle));
    box01.box2dBody.ApplyForce(vec,box01.box2dBody.GetWorldCenter());
}