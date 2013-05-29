var div = $("<div>")
$('body').append(div)

var w=2000, h=2000
var stage = new Kinetic.Stage({
    container: div[0],
    width: w,
    height: h
});

//Tile that surface!
var layer = new Kinetic.Layer();
for(var x=0; x<w; x+=50){
    for(var y=0; y<h; y+=50){
        var rect = new Kinetic.Rect({
            x: x,
            y: y,
            width: 50,
            height: 50,
            fill: randomcolor(),
            strokeWidth: 0
        })
        layer.add(rect)
    }
}

// add the layer to the stage
stage.add(layer);


function randomcolor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}