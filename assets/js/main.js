function box() {
    this.flag = "no";
    this.opened = "no";
    this.bomb = "no";
}

function state(){
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
            curState.grid[i][j] = new box();
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

function writeNumber(n, x, y, ctx) {
    ctx.fillStyle = "rgba(0,0,0,1)"
    ctx.font = "30px Arial";
    ctx.fillText(n, x + 15, y + 34);
}

function countAdjacentBombs(nx, ny, grid) {
    var count = 0;
    for (i = nx - 1; i <= nx + 1; i++) {
        for (j = ny - 1; j <= ny + 1; j++) {
            if (i >= 0 && j >= 0 && i < 10 && j < 10) {
                if (grid[i][j].bomb != "no") {
                    if (i != nx || j != ny) {
                        count++;
                    }
                }
            }

        }
    }
    if (count != 0) {
        return count;
    }
    return "";
}

function endGame(curState) {
    var score = 0;
    for (i = 0; i < curState.size; i++) {
        for (j = 0; j < curState.size; j++) {
            if (curState.grid[i][j].opened == "no") {
                curState.grid[i][j].opened = "yes";
                if (curState.grid[i][j].bomb == "yes") {
                    curState.nx = i*50;
                    curState.ny = j*50;
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

function flood(nx, ny, ctx, grid) {
    var m = 0;
    var n = 0;
    fillColour(ctx, nx*50, ny*50, "#808080");
    grid[nx][ny].opened = "yes";
    if (countAdjacentBombs(nx, ny, grid) == "") {
        for (m = nx - 1; m <= nx + 1; m++) {
            for (n = ny - 1; n <= ny + 1; n++) {
                if (m >= 0 && n >= 0 && m < 10 && n < 10) {
                    if (m != nx || n != ny) {
                        if(grid[m][n].opened == "no"){
                            grid = flood(m,n,ctx,grid);
                        }
                    }
                }

            }
        }
    }else{
        writeNumber(countAdjacentBombs(nx, ny, grid), nx*50, ny*50, ctx);
    }
    return grid;
}

function init() {
    var curState = new state();
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
