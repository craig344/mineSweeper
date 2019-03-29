function box() {
    this.flag = "no";
    this.opened = "no";
    this.bomb = "no";
}

function click(ctx, x, y, grid, click) {
    x -= x % 50;
    y -= y % 50;
    var nx = x / 50,
        ny = y / 50;

    if (click == "right") {
        //fillColour(ctx, x, y, "rgba(200,0,0,1)");
        if (grid[nx][ny].flag == "no" && grid[nx][ny].opened == "no") {
            drawFlag(x, y, ctx);
            grid[nx][ny].flag = "yes";
            grid[nx][ny].opened = "yes";
        } else if (grid[nx][ny].flag == "yes") {
            fillColour(ctx, x, y, "#505050");
            grid[nx][ny].flag = "no";
            grid[nx][ny].opened = "no";
        }
    } else if (click == "left") {
        if (grid[nx][ny].flag == "no" && grid[nx][ny].opened == "no") {
            fillColour(ctx, x, y, "#808080");
            grid[nx][ny].opened = "yes";
            if (grid[nx][ny].bomb == "yes") {
                drawBomb(x, y, ctx);
                var score = endGame(ctx, grid);
                alert("You loose! Your score is: " + score);
            } else {
                //writeNumber(countAdjacentBombs(nx, ny, grid), x, y, ctx);
                grid = flood(nx,ny,ctx,grid);
            }
        }
    }

    return grid;
}

function fillColour(ctx, x, y, colour) {
    ctx.fillStyle = colour;
    ctx.fillRect(x, y, 49, 49);
}

function fillCanvas(ctx, size) {
    ctx.fillStyle = "#505050";

    for (i = 0; i < 50 * size; i += 50) {
        for (j = 0; j < 50 * size; j += 50) {
            ctx.fillRect(i, j, 49, 49);
        }
    }
}

function placeBombs(grid, size) {
    var bx, by;
    for (i = 0; i < size; i++) {
        bx = Math.floor((Math.random() * 10));
        by = Math.floor((Math.random() * 10));
        if (grid[bx][by].bomb == "yes") {
            i--;
        } else {
            grid[bx][by].bomb = "yes";
        }
    }
    return grid;
}

function make2d(grid, size) {
    for (i = 0; i < size; i++) {
        grid[i] = [];
    }
    return grid
}

function addBoxes(grid, size) {
    for (i = 0; i < size; i++) {
        for (j = 0; j < size; j++) {
            grid[i][j] = new box();
        }
    }
    return grid;
}

function drawFlag(x, y, ctx) {
    ctx.beginPath();
    ctx.moveTo(x + 18, y + 46);
    ctx.lineTo(x + 24, y + 46);
    ctx.moveTo(x + 21, y + 46);
    ctx.lineTo(x + 21, y + 3);
    ctx.lineTo(x + 42, y + 12);
    ctx.lineTo(x + 21, y + 24);
    ctx.closePath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(0,0,0,1)";
    ctx.stroke();
    ctx.fillStyle = "rgba(200,0,0,1)";
    ctx.fill();
}

function drawBomb(x, y, ctx) {
    ctx.fillStyle = "rgba(200,0,0,1)";
    ctx.arc(x + 24, y + 24, 20, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
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

function endGame(ctx, grid) {
    var score = 0;
    for (i = 0; i < 10; i++) {
        for (j = 0; j < 10; j++) {
            if (grid[i][j].opened == "no") {
                grid[i][j].opened = "yes";
                if (grid[i][j].bomb == "yes") {
                    fillColour(ctx, i * 50, j * 50, "#808080");
                    drawBomb(i * 50, j * 50, ctx);
                }
            } else if (grid[i][j].flag == "yes" && grid[i][j].bomb == "yes") {
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
    var canvas = document.getElementById("mainCanvas");
    var ctx = canvas.getContext("2d");
    var grid = [];
    var size = 10;

    grid = make2d(grid, size);
    fillCanvas(ctx, size);
    grid = addBoxes(grid, size);
    grid = placeBombs(grid, size);

    canvas.addEventListener('click', (e) => {
        grid = click(ctx, e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop, grid, "left");
    });

    canvas.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        grid = click(ctx, e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop, grid, "right");
    });
}
