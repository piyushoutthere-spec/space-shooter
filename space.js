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
    shipimg.src = "imgs/ship.png";
    shipimg.onload = function(){
    context.drawImage(shipimg, ship.x , ship.y, ship.width, ship.height);
    }
}