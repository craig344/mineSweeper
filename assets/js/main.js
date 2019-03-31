function Box() {
    this.flag = "no";
    this.opened = "no";
    this.bomb = "no";
}

function State(){
    this.x = 0;
    this.y = 0;
    this.nx = 0;
    this.ny = 0;
    this.bombsPlaced = null;
    this.ctx = null;
    this.grid = null;
    this.score = 0;
    this.size = 0;
    this.flags = this.size;
    this.click = null;
}

function click(curState) {
    curState.x -= curState.x % 50;
    curState.y -= curState.y % 50;
    curState.nx = curState.x/50;
    curState.ny = curState.y/50;

    if (curState.click == "right") {
        //fillColour(ctx, x, y, "rgba(200,0,0,1)");
        if (curState.grid[curState.nx][curState.ny].flag == "no" && curState.grid[curState.nx][curState.ny].opened == "no") {
            drawFlag(curState);
            curState.grid[curState.nx][curState.ny].flag = "yes";
            curState.grid[curState.nx][curState.ny].opened = "yes";
        } else if (curState.grid[curState.nx][curState.ny].flag == "yes") {
            fillColour(curState, "#505050");
            curState.grid[curState.nx][curState.ny].flag = "no";
            curState.grid[curState.nx][curState.ny].opened = "no";
        }
    } else if (curState.click == "left") {
        if (curState.grid[curState.nx][curState.ny].flag == "no" && curState.grid[curState.nx][curState.ny].opened == "no") {
            fillColour(curState, "#808080");
            curState.grid[curState.nx][curState.ny].opened = "yes";
            if (curState.grid[curState.nx][curState.ny].bomb == "yes") {
                drawBomb(curState);
                curState.score = endGame(curState);
                alert("You loose! Your score is: " + curState.score);
            } else {
                //writeNumber(countAdjacentBombs(nx, ny, grid), x, y, ctx);
                curState.grid = flood(curState);
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
        if (curState.grid[bx][by].bomb == "yes") {
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

function writeNumber(n,curState) {
    curState.ctx.fillStyle = "rgba(0,0,0,1)"
    curState.ctx.font = "30px Arial";
    curState.ctx.fillText(n, curState.x + 15, curState.y + 34);
}

function countAdjacentBombs(curState) {
    var count = 0;
    for (i = curState.nx - 1; i <= curState.nx + 1; i++) {
        for (j = curState.ny - 1; j <= curState.ny + 1; j++) {
            if (i >= 0 && j >= 0 && i < 10 && j < 10) {
                if (curState.grid[i][j].bomb != "no") {
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
    var score = 0;
    for (i = 0; i < curState.size; i++) {
        for (j = 0; j < curState.size; j++) {
            if (curState.grid[i][j].opened == "no") {
                curState.grid[i][j].opened = "yes";
                if (curState.grid[i][j].bomb == "yes") {
                    curState.x = i*50;
                    curState.y = j*50;
                    fillColour(curState, "#808080");
                    drawBomb(curState);
                }
            } else if (curState.grid[i][j].flag == "yes" && curState.grid[i][j].bomb == "yes") {
                score++;
            }
        }
    }
    return score;
}
function flood(curState) {
    var m = 0;
    var n = 0;
    var temp = new State();

    fillColour(curState, "#808080");
    curState.grid[curState.nx][curState.ny].opened = "yes";
    if (countAdjacentBombs(curState) == null) {
        for (m =curState.nx - 1; m <= curState.nx + 1; m++) {
            for (n = curState.ny - 1; n <= curState.ny + 1; n++) {
                if (m >= 0 && n >= 0 && m < 10 && n < 10) {
                    if (m != curState.nx || n != curState.ny) {
                        if(curState.grid[m][n].opened == "no"){
                            temp.nx = m;
                            temp.ny = n;
                            temp.ctx = curState.ctx;
                            temp.grid = curState.grid;
                            temp.x = m*50;
                            temp.y = n*50;
                            curState.grid = flood(temp);
                        }
                    }
                }

            }
        }
    }else{
        writeNumber(countAdjacentBombs(curState), curState);
    }
    return curState.grid;
}

function init() {
    var curState = new State();
    var canvas = document.getElementById("mainCanvas");
    curState.ctx = canvas.getContext("2d");
    curState.grid = [];
    curState.size = 10;
    

    curState = make2d(curState);
    fillCanvas(curState);
    curState = addBoxes(curState);
    curState = placeBombs(curState);

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
