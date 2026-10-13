// board
let tilesize = 32;
let rows= 16;
let columns = 16;

let board;
let boardwidth = tilesize * columns;
let boardheight = tilesize * rows;
let context;

//shippy
let shipwidth = tilesize*2;
let shipheight = tilesize;
let shipX = tilesize * columns/2 - tilesize;
let shipY = tilesize * rows - tilesize*2;

let ship ={
    x : shipX,
    y: shipY,
    width : shipwidth,
    height : shipheight
}

let shipimg;
let shipvelocityX = tilesize; // shippy movein speed

//alliieesns
let aliArray = [];
let aliwidth = tilesize*2;
let aliheight= tilesize;
let aliX = tilesize;
let aliY = tilesize;
let aliimg;
let aliImg =[];
let cuurentAlicolor = 0;

let alirows = 2;
let alicolumns= 3;
let alicount = 0; // no. of ali to defaeat
let alivelocityX = 1; // ali moving speed

// bulets
let bulletArray =[];
let bulletvelocityY = -10; // bullet spped

let score = 0;
let gameover = false;
let GS=false;

window.onload = function(){
    board = document.getElementById("board");
    board.width = boardwidth;
    board.height = boardheight;
    context = board.getContext("2d");

    // draw initial shippy
    //context.fillStyle = "brown";
    //context.fillRect(ship.x, ship.y , ship.width, ship.height);
    // load img

    shipimg = new Image();
    shipimg.src = "imgs/shooter.png.png";
    shipimg.onload = function(){
        if(!GS){
           context.drawImage(shipimg, ship.x , ship.y, ship.width, ship.height);
    }
};
    
    let alienfiles=[
        "imgs/alien.png",
        "imgs/alien-cyan.png",
        "imgs/alien-magenta.png",
        "imgs/alien-yellow.png"
    ];
    
    let imagesloaded= 0;
    alienfiles.forEach((src,index)=>{
        aliImg[index]=new Image();

        aliImg[index].onload = function(){
            imagesloaded++;

            if(imagesloaded=== alienfiles.length){
                aliimg = aliImg[cuurentAlicolor];
                createAli();
            }
        };
        aliImg[index].src=src;
    });

    requestAnimationFrame(update);
    document.addEventListener("keydown", moveship);
    document.addEventListener("keyup",shoot);
    document.getElementById("startbtn").addEventListener("click",startGame);
    document.getElementById("restartbtn").addEventListener("click",restartGame);
}    

function update(){
    requestAnimationFrame(update);
    if (gameover || !GS){
        return;
    }
    
    context.clearRect(0,0, board.width , board.height);

    context.drawImage(shipimg, ship.x, ship.y, ship.width, ship.height);

    // ali
    for (let i =0; i < aliArray.length;i++){
        let ali = aliArray[i];
        if (ali.alive){
            ali.x += alivelocityX;
            
            //if alien touch border
            if (ali.x + ali.width >= board.width || ali.x <=0){
                alivelocityX *= -1;
                ali.x += alivelocityX*2;

                // move all ali up by one eow
                for (let j=0; j< aliArray.length; j++){
                    aliArray[j].y += aliheight;
                }
            }
            context.drawImage(ali.img, ali.x, ali.y , ali.width, ali.height);
            if (ali.y >= ship.y){
                gameover=true;
                alert("GAME OVER!\n Your Score:"+score);
            }
        }
    }

    // bullets
    for (let i=0; i < bulletArray.length; i++){
        let bullet = bulletArray[i];
        bullet.y += bulletvelocityY;
        context.fillStyle="red";
        context.fillRect(bullet.x , bullet.y, bullet.width, bullet.height);

        // collison
        for (let j=0; j < aliArray.length; j++){
            let ali = aliArray[j];
            if (!bullet.used && ali.alive && detectCollision(bullet, ali)){
                bullet.used = true;
                ali.alive = false;
                alicount--;
                score +=10;
            }
        }
    }

    //clear bullets
    while(bulletArray.length>0 && (bulletArray[0].used|| bulletArray[0].y <0)){
        bulletArray.shift();
    }

    // next level
    if (alicount== 0){
        cuurentAlicolor=(cuurentAlicolor+1)% aliImg.length;
        aliimg = aliImg[cuurentAlicolor];
        alicolumns = Math.min(alicolumns + 1 , columns/2-2);
        alirows= Math.min(alirows+1, rows-4);
        alivelocityX += 0.2;
        aliArray=[];
        bulletArray=[];
        createAli();
    }
    // score
    context.fillStyle= "white";
    context.font="16px courier";
    context.fillText(score,5,20);
}

function moveship(e){
    if (gameover){
        return;
    }
    if (e.code == "ArrowLeft" && ship.x - shipvelocityX >= 0){
        ship.x -= shipvelocityX; // move left
    }
    else if (e.code == "ArrowRight" && ship.x + shipvelocityX + ship.width<= board.width){
        ship.x += shipvelocityX; // move right
    }
}

function createAli(){
    for (let c= 0; c< alicolumns; c++){
        for (let r=0; r< alirows; r++){
            let ali = {
                img: aliimg,
                x : aliX + c*aliwidth,
                y : aliY + r*aliheight,
                width: aliwidth,
                height : aliheight,
                alive : true
            }

            aliArray.push(ali);
        }
    }
    alicount = aliArray.length;
}

function shoot(e){
    if (gameover){
        return;
    }

    if(e.code =="Space"){
        // shoot
        let bullet ={
            x : ship.x + shipwidth*15/32,
            y : ship.y,
            width : tilesize/8,
            height : tilesize/2,
            used : false
        }
        bulletArray.push(bullet);
    }
}

function detectCollision(a,b){
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height> b.y;
}

function startGame(){
    if (!gameover){
        GS = true;
    }
}

function restartGame(){
    ship.x = shipX;
    aliArray=[];
    bulletArray=[];

    score = 0;
    gameover= false;
    GS= true;

    alicolumns=3;
    alirows= 2;
    alivelocityX=1;

    cuurentAlicolor=0;
    aliimg=aliImg[cuurentAlicolor];

    createAli();
}