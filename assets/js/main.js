function Box() {
    this.flag = "no";
    this.opened = "no";
    this.bomb = "no";
}

function State() {
    this.x = 0;
    this.y = 0;
    this.nx = 0;
    this.ny = 0;
    this.bombsPlaced = null;
    this.ctx = null;
    this.grid = null;
    this.score = 0;
    this.size = 0;
    this.flags = 0;
    this.click = null;
    this.end = false;
    this.interval = null;
    this.started = false;
}

function click(curState) {
    curState.x -= curState.x % 50;
    curState.y -= curState.y % 50;
    curState.nx = curState.x / 50;
    curState.ny = curState.y / 50;
    if (curState.nx < curState.size && curState.ny < curState.size) {
        if(!curState.started){
            curState = startGame(curState);
        }
        if (curState.click == "right" && !curState.end) {
            //fillColour(ctx, x, y, "rgba(200,0,0,1)");
            if (curState.grid[curState.nx][curState.ny].flag == "no" && curState.grid[curState.nx][curState.ny].opened == "no") {
                if (curState.flags > 0) {
                    drawFlag(curState);
                    curState.grid[curState.nx][curState.ny].flag = "yes";
                    curState.flags--;
                    drawFlagCount(curState);
                    if(curState.grid[curState.nx][curState.ny].bomb == "yes"){
                        curState.score++;
                        if(curState.score == curState.size){
                            winGame(curState);
                        }
                    }
                }
            } else if (curState.grid[curState.nx][curState.ny].flag == "yes") {
                fillColour(curState, "#505050");
                curState.grid[curState.nx][curState.ny].flag = "no";
                curState.flags++;
                drawFlagCount(curState);
                if(curState.grid[curState.nx][curState.ny].bomb == "yes"){
                    curState.score--;
                }
            }
        } else if (curState.click == "left" && !curState.end) {
            if (curState.grid[curState.nx][curState.ny].flag == "no" || curState.grid[curState.nx][curState.ny].opened == "no") {
                fillColour(curState, "#808080");
                curState.grid[curState.nx][curState.ny].opened = "yes";
                if (curState.grid[curState.nx][curState.ny].bomb == "yes") {
                    drawBomb(curState);
                    looseGame(curState);
                } else {
                    //writeNumber(countAdjacentBombs(nx, ny, grid), x, y, ctx);
                    curState.grid = flood(curState);
                }
            }
        }
    }

    return curState;
}

function fillColour(curState, colour) {
    curState.ctx.fillStyle = colour;
    curState.ctx.fillRect(curState.x, curState.y, 49, 49);
}

function fillCanvas(curState) {
    curState.ctx.fillStyle = "#505050";

    for (i = 0; i < 50 * curState.size; i += 50) {
        for (j = 0; j < 50 * curState.size; j += 50) {
            curState.ctx.fillRect(i, j, 49, 49);
        }
    }
}

function placeBombs(curState) {
    var bx, by;
    for (i = 0; i < curState.size; i++) {
        bx = Math.floor((Math.random() * 10));
        by = Math.floor((Math.random() * 10));
        if (curState.grid[bx][by].bomb == "yes" || (bx == curState.nx && by == curState.ny)) {
            i--;
        } else {
            curState.grid[bx][by].bomb = "yes";
        }
    }
    return curState;
}

function make2d(curState) {
    for (i = 0; i < curState.size; i++) {
        curState.grid[i] = [];
    }
    return curState;
}

function addBoxes(curState) {
    for (i = 0; i < curState.size; i++) {
        for (j = 0; j < curState.size; j++) {
            curState.grid[i][j] = new Box();
        }
    }
    return curState;
}

function drawFlag(curState) {
    curState.ctx.beginPath();
    curState.ctx.moveTo(curState.x + 18, curState.y + 46);
    curState.ctx.lineTo(curState.x + 24, curState.y + 46);
    curState.ctx.moveTo(curState.x + 21, curState.y + 46);
    curState.ctx.lineTo(curState.x + 21, curState.y + 3);
    curState.ctx.lineTo(curState.x + 42, curState.y + 12);
    curState.ctx.lineTo(curState.x + 21, curState.y + 24);
    curState.ctx.closePath();
    curState.ctx.lineWidth = 2;
    curState.ctx.strokeStyle = "rgba(0,0,0,1)";
    curState.ctx.stroke();
    curState.ctx.fillStyle = "rgba(200,0,0,1)";
    curState.ctx.fill();
}

function drawBomb(curState) {
    curState.ctx.fillStyle = "rgba(200,0,0,1)";
    curState.ctx.arc(curState.x + 24, curState.y + 24, 20, 0, 2 * Math.PI);
    curState.ctx.closePath();
    curState.ctx.fill();
}

function writeNumber(n, curState) {
    curState.ctx.fillStyle = "rgba(0,0,0,1)"
    curState.ctx.font = "30px Calibri";
    curState.ctx.fillText(n, curState.x + 17, curState.y + 34);
}

function countAdjacentBombs(curState) {
    var count = 0;
    for (i = curState.nx - 1; i <= curState.nx + 1; i++) {
        for (j = curState.ny - 1; j <= curState.ny + 1; j++) {
            if (i >= 0 && j >= 0 && i < 10 && j < 10) {
                if (curState.grid[i][j].bomb == "yes") {
                    if (i != curState.nx || j != curState.ny) {
                        count++;
                    }
                }
            }
        }
    }
    if (count != 0) {
        return count;
    }
    return null;
}

function endGame(curState) {
    for (i = 0; i < curState.size; i++) {
        for (j = 0; j < curState.size; j++) {
            if (curState.grid[i][j].opened == "no") {
                if (curState.grid[i][j].bomb == "yes") {
                    curState.x = i * 50;
                    curState.y = j * 50;
                    fillColour(curState, "#808080");
                    drawBomb(curState);
                }
            }
            if (curState.grid[i][j].flag == "yes" && curState.grid[i][j].bomb == "yes") {
                curState.x = i * 50;
                curState.y = j * 50;
                fillColour(curState, "#808080");
                drawCross(curState);
            }
        }
    }
    curState.end = true;
    clearInterval(curState.interval);
    drawScore(curState);
}

function drawCross(curState) {
    curState.ctx.beginPath();
    curState.ctx.moveTo(curState.x + 1, curState.y + 1);
    curState.ctx.lineTo(curState.x + 48, curState.y + 48);
    curState.ctx.moveTo(curState.x + 48, curState.y + 1);
    curState.ctx.lineTo(curState.x + 1, curState.y + 48);
    curState.ctx.closePath();
    curState.ctx.lineWidth = 2;
    curState.ctx.strokeStyle = "rgba(200,0,0,1)";
    curState.ctx.stroke();
}

function flood(curState) {
    var m = 0;
    var n = 0;
    var temp = new State();

    fillColour(curState, "#808080");
    curState.grid[curState.nx][curState.ny].opened = "yes";
    if (countAdjacentBombs(curState) == null) {
        for (m = curState.nx - 1; m <= curState.nx + 1; m++) {
            for (n = curState.ny - 1; n <= curState.ny + 1; n++) {
                if (m >= 0 && n >= 0 && m < 10 && n < 10) {
                    if (m != curState.nx || n != curState.ny) {
                        if (curState.grid[m][n].opened == "no" && curState.grid[m][n].flag == "no") {
                            temp.nx = m;
                            temp.ny = n;
                            temp.ctx = curState.ctx;
                            temp.grid = curState.grid;
                            temp.x = m * 50;
                            temp.y = n * 50;
                            curState.grid = flood(temp);
                        }
                    }
                }

            }
        }
    } else {
        writeNumber(countAdjacentBombs(curState), curState);
    }
    return curState.grid;
}

function drawFlagCount(curState) {
    curState.ctx.fillStyle = "#808080";
    curState.ctx.fillRect(0, 500, 165, 99);
    curState.x = 0;
    curState.y = 525;
    drawFlag(curState);
    curState.ctx.fillStyle = "rgba(0,0,0,1)"
    curState.ctx.font = "50px Calibri";
    curState.ctx.fillText(": " + curState.flags, curState.x + 60, curState.y + 40);
}

function drawScore(curState) {
    curState.ctx.fillStyle = "#808080";
    curState.ctx.fillRect(166, 500, 166, 99);
    var img = new Image();
    img.onload = function(){
        curState.ctx.drawImage(img, 185,525,49,49);
    }
    img.src = "./assets/images/award.svg"
    curState.ctx.fillStyle = "rgba(0,0,0,1)"
    curState.ctx.font = "50px Calibri";
    curState.ctx.fillText(" : " + curState.score, 233, 565);
}

var time = 0;
function drawTimer(curState) {
    curState.ctx.fillStyle = "#808080";
    curState.ctx.fillRect(333, 500, 166, 99);
    var img = new Image();
    img.onload = function(){
        curState.ctx.drawImage(img, 345,525,49,49);
    }
    img.src = "./assets/images/stopwatch.svg"
    curState.ctx.fillStyle = "rgba(0,0,0,1)"
    curState.ctx.font = "40px Calibri";
    curState.ctx.fillText(":" + time, 393, 565);
    time++;
    return curState;
}

function updateTime(curState){
    curState.ctx.fillStyle = "#808080";
    curState.ctx.fillRect(393, 500, 106, 99);
    curState.ctx.fillStyle = "rgba(0,0,0,1)"
    curState.ctx.font = "40px Calibri";
    curState.ctx.fillText(":" + time, 393, 565);
    time++;
}

function startGame(curState){
    curState.started = true;
    curState.interval = setInterval(updateTime,1000,curState);
    curState = placeBombs(curState);
    return curState;
}

function winGame(curState){
    endGame(curState);
    drawBox(curState,"You Win!!!!", "rgba(0,200,0,0.8)");
}

function looseGame(curState){
    endGame(curState);
    drawBox(curState,"You Loose!!", "rgba(200,0,0,0.8)");
}

function drawBox(curState, text, colour){
    curState.ctx.fillStyle = colour;
    curState.ctx.fillRect(100,200, 299, 99);
    curState.ctx.fillStyle = "rgba(255,255,255,1)"
    curState.ctx.font = "50px Calibri";
    curState.ctx.fillText(text, 130, 260);
}

function init() {
    var curState = new State();
    var canvas = document.getElementById("mainCanvas");
    curState.ctx = canvas.getContext("2d");
    curState.grid = [];
    curState.size = 10;
    curState.flags = 10;


    curState = make2d(curState);
    fillCanvas(curState);
    curState = addBoxes(curState);
    drawFlagCount(curState);
    drawScore(curState);
    drawTimer(curState);

    canvas.addEventListener('click', (e) => {
        curState.click = "left";
        curState.x = e.clientX - canvas.offsetLeft;
        curState.y = e.clientY - canvas.offsetTop;
        curState = click(curState);
    });

    canvas.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        curState.click = "right";
        curState.x = e.clientX - canvas.offsetLeft;
        curState.y = e.clientY - canvas.offsetTop;
        curState = click(curState);
    });
}
