function Click(ctx, colour, x, y, squares, click) {
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

function init() {
    var canvas = document.getElementById("mainCanvas");
    var ctx = canvas.getContext("2d");
    var squares = [];

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
    canvas.addEventListener('click', (e) => {
        squares = Click(ctx, "rgba(200,0,0,1)", e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop, squares, 1);
    });

    canvas.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        squares = Click(ctx, "#808080", e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop, squares, 0);
    });

}
