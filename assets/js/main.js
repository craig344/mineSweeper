function box() {
    this.flag = "no";
    this.click = "no";
    this.bomb = "no";
    this.red = "no";
}

function click(ctx, x, y, grid, click) {
    x -= x % 50;
    y -= y % 50;
    var nx = x / 50,
        ny = y / 50;

    if (click == "right" && grid[nx][ny].red == "no") {
        grid = fillColour(grid, ctx, x, y, "rgba(200,0,0,1)");
        grid[nx][ny].red = "yes";
    } else if (click == "left" && grid[nx][ny].red == "yes") {
        grid = fillColour(grid, ctx, x, y, "#808080");
        grid[nx][ny].red = "no";
    }
    return grid;
}

function fillColour(grid, ctx, x, y, colour) {
    ctx.fillStyle = colour;
    ctx.fillRect(x, y, 49, 49);
    return grid;
}

function fillCanvas(ctx, size) {
    ctx.fillStyle = "#808080";

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
