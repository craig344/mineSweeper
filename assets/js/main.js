function click(ctx, colour, x, y, grid, click) {
    x -= x % 50;
    y -= y % 50;
    var nx = x / 50,
        ny = y / 50;

    if (grid[nx][ny] != click) {
        ctx.fillStyle = colour;
        ctx.fillRect(x, y, 49, 49);
        grid[nx][ny] = click;
        console.log(grid[nx][ny], nx, ny);
    }
    return grid;
}

function fillCanvas(ctx, grid) {
    ctx.fillStyle = "#808080";
    for (i = 0; i < 10; i++) {
        grid[i] = [];
    }

    for (i = 0; i < 500; i += 50) {
        for (j = 0; j < 500; j += 50) {
            ctx.fillRect(i, j, 49, 49);
            grid[i / 50][j / 50] = 0;
        }
    }
    return grid;
}

function placeBombs(grid){
    var bx, by;
    for(i = 0; j<10; i++){
        bx = Math.floor((Math.random() * 10));
        by = Math.floor((Math.random() * 10));
        if(grid[bx][by] == 2){
            i--;
        }else{
            grid[bx][by] = 2;
        }
    }
    return grid;

}

function addBoxes(grid, box){
    for(i = 0; i < 10; i++){
        for(j = 0; j < 10; j++){
            grid[i][j] = new box;
        }
    }
    return grid;
}

function init() {
    var canvas = document.getElementById("mainCanvas");
    var ctx = canvas.getContext("2d");
    var grid = [];
    var box = {
        flag: "no",
        click: "no",
        bomb: "no"
    };

    grid = fillCanvas(ctx, grid);
    grid = addBoxes(grid, box);

    canvas.addEventListener('click', (e) => {
        grid = click(ctx, "rgba(200,0,0,1)", e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop, grid, 1);
    });

    canvas.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        grid = click(ctx, "#808080", e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop, grid, 0);
    });

}
