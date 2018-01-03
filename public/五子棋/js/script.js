var me=true;
var over=false;
var chessBoardArr=[];
for(var i=0;i<15;i++){
    chessBoardArr[i]=[];
    for(var j=0;j<15;j++){
        chessBoardArr[i][j]=0;
    }
}

//赢法数组
var wins=[];
for(var i=0;i<15;i++){
    wins[i]=[];
    for(var j=0;j<15;j++){
        wins[i][j]=[];
    }
}
//赢法种类索引
var count=0;
//所有横向的赢法
for(var i=0;i<15;i++){
    for(var j=0;j<11;j++){
        //wins[0][0][0]=true;
        //wins[0][1][0]=true;
        //wins[0][2][0]=true;
        //wins[0][3][0]=true;
        //wins[0][4][0]=true;
        
        //wins[0][1][1]=true;
        //wins[0][2][1]=true;
        //wins[0][3][1]=true;
        //wins[0][4][1]=true;
        //wins[0][5][1]=true;
        for(var k=0;k<5;k++){
            wins[i][j+k][count]=true;
        }
        count++;
    }
}
//所有纵向的赢法
for(var i=0;i<15;i++){
    for(var j=0;j<11;j++){
        for(var k=0;k<5;k++){
            wins[j+k][i][count]=true;
        }
        count++;
    }
}
//所有斜向的赢法
for(var i=0;i<11;i++){
    for(var j=0;j<11;j++){
        for(var k=0;k<5;k++){
            wins[i+k][j+k][count]=true;
        }
        count++;
    }
}
//所有反斜向的赢法
for(var i=0;i<11;i++){
    for(var j=14;j>3;j--){
        for(var k=0;k<5;k++){
            wins[i+k][j-k][count]=true;
        }
        count++;
    }
}
console.log(count);
//赢法统计数组
var myWin=[];
var comWin=[];
for(var i=0;i<count;i++){
    myWin[i]=0;
    comWin[i]=0;
}


var chess = document.getElementById("chess");
var context = chess.getContext("2d");
context.strokeStyle = "#BFBFBF";
var logo = new Image();
logo.src = "images/logo1.png";
logo.onload=function(){
    context.drawImage(logo,0,0,900,900);
    drawChessBoard();   
}
var drawChessBoard=function(){
    for(var i=0;i<15;i++){
        context.moveTo(30, 30+60*i);
        context.lineTo(870, 30+60*i);
        context.stroke();
        context.moveTo(30+60*i, 30);
        context.lineTo(30+60*i, 870);
        context.stroke();
    }
}
var oneStep=function(i,j,me){
    context.beginPath();
    context.arc(30+60*i,30+60*j,26,0,2*Math.PI);
    context.closePath();
    var gradient=context.createRadialGradient(30+60*i+2,30+60*j-2,26,30+60*i+2,30+60*j-2,0);
    if(me){
        gradient.addColorStop(0,"#0A0A0A");
        gradient.addColorStop(1,"#636766");
    }else{
        gradient.addColorStop(0,"#D1D1D1");
        gradient.addColorStop(1,"#F9F9F9");
    }
    context.fillStyle = gradient;
    context.fill();
} 
chess.onclick=function(e){
    if(over){
        return;
    }
    if(!me){
        return;
    }
    var x=e.offsetX;
    var y=e.offsetY;
    var i=Math.floor(x/60);
    var j=Math.floor(y/60);
    if(chessBoardArr[i][j]==0){
        oneStep(i,j,me);
        chessBoardArr[i][j]=1;
        //如果K中赢法中的(i,j)位置有子,则胜利的那种赢法胜利的系数+1
        for(var k=0;k<count;k++){
            if(wins[i][j][k]){
                myWin[k]++;
                comWin[k]=6;
                if(myWin[k]==5){
                    window.alert("you win!");
                    over=true;
                }
            }
        }
        if(!over){
            me=!me;
            computerAI();
        }
    }
    
}
var computerAI=function(){
    var myScore=[];
    var computerScore=[];
    var maxScore=0;
    var u=0,v=0;
    for(var i=0;i<15;i++){
        myScore[i]=[];
        computerScore[i]=[];
        for(var j=0;j<15;j++){
            myScore[i][j]=0;
            computerScore[i][j]=0;
        }
    }
    for(var i=0;i<15;i++){
        for(var j=0;j<15;j++){
            if(chessBoardArr[i][j]==0){
                for(var k=0;k<count;k++){
                    if(wins[i][j][k]){
                        if(myWin[k]==1){
                            myScore[i][j]+=200;
                        }else if(myWin[k]==2){
                            myScore[i][j]+=400;
                        }else if(myWin[k]==3){
                            myScore[i][j]+=2000;
                        }else if(myWin[k]==4){
                            myScore[i][j]+=10000;
                        }
                        if(comWin[k]==1){
                            computerScore[i][j]+=220;
                        }else if(comWin[k]==2){
                            computerScore[i][j]+=420;
                        }else if(comWin[k]==3){
                            computerScore[i][j]+=2200;
                        }else if(comWin[k]==4){
                            computerScore[i][j]+=20000;
                        }
                    }
                    
                }
                if(myScore[i][j]>maxScore){
                    maxScore=myScore[i][j];
                    u=i;
                    v=j;
                }else if(myScore[i][j]==maxScore){
                    if(computerScore[i][j]>computerScore[u][v]){
                        u=i;
                        v=j;
                    }
                }
                if(computerScore[i][j]>maxScore){
                    maxScore=computerScore[i][j];
                    u=i;
                    v=j;
                }else if(myScore[i][j]==maxScore){
                    if(myScore[i][j]>myScore[u][v]){
                        u=i;
                        v=j;
                    }
                }
            }
        }
    }
    oneStep(u,v,false);
    chessBoardArr[u][v]=2;
    //如果K中赢法中的(i,j)位置有子,则胜利的那种赢法胜利的系数+1
    for(var k=0;k<count;k++){
        if(wins[u][v][k]){
            comWin[k]++;
            myWin[k]=6;
            if(comWin[k]==5){
                window.alert("you lose!");
                over=true;
            }
        }
    }
    if(!over){
        me=!me;
    }    
}