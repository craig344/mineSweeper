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
    ctx.fillStyle = "rgba(200,0,0,1)";
    var x = e.clientX - canvas.offsetLeft
        , y = e.clientY - canvas.offsetTop;

    x -= x % 50;
    y -= y % 50;
    if (squares[x / 50][y / 50] == 0) {
        ctx.fillRect(x, y, 49, 49);
        squares[x / 50][y / 50] = 1;
        console.log(squares[x / 50][y / 50]);
    }
});

canvas.addEventListener('contextmenu', (e) => {
    ctx.fillStyle = "#808080";
    e.preventDefault();
    var x = e.clientX - canvas.offsetLeft
        , y = e.clientY - canvas.offsetTop;

    x -= x % 50;
    y -= y % 50;

    if (squares[x / 50][y / 50] == 1) {
        ctx.fillRect(x, y, 49, 49);
        squares[x / 50][y / 50] = 0;
        console.log(squares[x / 50][y / 50]);
    }
});
