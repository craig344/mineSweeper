function click(ctx, colour, x, y, squares, click) {
    x -= x % 50;
    y -= y % 50;
    var nx = x / 50,
        ny = y / 50;

    if (squares[nx][ny] != click) {
        ctx.fillStyle = colour;
        ctx.fillRect(x, y, 49, 49);
        squares[nx][ny] = click;
        console.log(squares[nx][ny], nx, ny);
    }
    return squares;
}

function fillCanvas(ctx, squares) {
    ctx.fillStyle = "#808080";
    for (i = 0; i < 10; i++) {
        squares[i] = [];
    }

    for (i = 0; i < 500; i += 50) {
        for (j = 0; j < 500; j += 50) {
            ctx.fillRect(i, j, 49, 49);
            squares[i / 50][j / 50] = 0;
        }
    }
    return squares;
}

function placeBombs(squares){
    var bx, by;
    for(i = 0; j<10; i++){
        bx = Math.floor((Math.random() * 10));
        by = Math.floor((Math.random() * 10));
        if(squares[bx][by] == 2){
            i--;
        }else{
            squares[bx][by] = 2;
        }
    }
    return squares;

}

function init() {
    var canvas = document.getElementById("mainCanvas");
    var ctx = canvas.getContext("2d");
    var squares = [];

    squares = fillCanvas(ctx, squares);

    canvas.addEventListener('click', (e) => {
        squares = click(ctx, "rgba(200,0,0,1)", e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop, squares, 1);
    });

    canvas.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        squares = click(ctx, "#808080", e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop, squares, 0);
    });

}
