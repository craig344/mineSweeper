var canvas = document.getElementById("mainCanvas");
var ctx = canvas.getContext("2d");
ctx.fillStyle = "#808080";
for(i=0; i<500; i+=50){
    for(j=0; j<500; j+=50){
        ctx.fillRect(i,j,49,49);
    }
}