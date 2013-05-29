function Vector(x, y){
    this.x = x;
    this.y = y;
    this.times= function(k){
        return new Vector(this.x*k, this.y *k);
    };
    this.dot = function(other){
        return new Vector(this.x * other.x, this.y * other.y);
    };
    this.cross = function(other){
        //Remember: this is actually a vector value. It's just in the K direction.
        return this.x * other.y - this.y * other.x;
    }

    this.toString = function(){
        return '<'+this.x+','+this.y+'>';
    }
}

function randomcolor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}

function PhysicsBall(x, y, velocity, radius){
    this.x = x;
    this.y = y;
    this.vel = velocity;
    this.r = radius || 15; //Default radius
    this.toString = function () {
        return JSON.stringify(this)
    };
    this.reflectY = function () {
        this.vel = new Vector(this.vel.x, -1 * this.vel.y);
    };
    this.reflectX = function(){
        this.vel = new Vector(-1*this.vel.x, this.vel.y);
    }
}

function redPhysicsball(x, y, velocity, radius){
    var ball = new PhysicsBall(x, y, velocity, radius);
    ball.color = 'red';
    return ball;
}


function animationStart(){
    var containingDiv = $('<div>').css('width', '500px').css('height', '500px');
    $('body').append(containingDiv);
    var stage = new Kinetic.Stage({
        container: containingDiv[0],
        width: 500,
        height: 500
    });
    var layer = new Kinetic.Layer();
    //Background rectangle; necessary for event detection because binding to stage sort of doesn't wor
    var rect = new Kinetic.Rect({
        x:0,
        y:0,
        width:stage.getWidth(),
        height:stage.getHeight(),
        fill: 'none',
        stroke: 'black',
        strokeWidth: 1
    });
    layer.add(rect);

    var instructionText = new Kinetic.Text({
        x: 20,
        y: 15,
        text: 'Click anywhere to launch a new particle.',
        fontSize: 20,
        fontFamily: 'Calibri',
        fill: 'black'
    });
    layer.add(instructionText);

    var balls = [], circles = [];


    stage.add(layer);

    //noinspection JSUnusedLocalSymbols
    var anim = new Kinetic.Animation(function(frame) {

        for(var i=0; i<balls.length; i++){
            var ball = balls[i], circle = circles[i];
            ball.x += ball.vel.x;
            ball.y += ball.vel.y;
            for(var b=0; b<balls.length; b++){
                if(b==i){continue;}
                var ball2 = balls[b];
                var dist = Math.sqrt(Math.pow(ball2.x - ball.x, 2) + Math.pow(ball2.y - ball.y, 2));
                if(dist < ball2.r + ball.r){
                    var collisionAngle = Math.atan2(ball2.y-ball.y, ball2.x-ball.x);
                    var correctionDist = (ball2.r + ball.r - dist)/2;
                    ball.x += correctionDist * Math.cos(collisionAngle+Math.PI);
                    ball.y += correctionDist * Math.sin(collisionAngle+Math.PI);
                    ball2.x += correctionDist * Math.cos(collisionAngle);
                    ball2.y += correctionDist * Math.sin(collisionAngle);
                    //Actual Collision
                    var nX = Math.cos(collisionAngle);
                    var nY = Math.sin(collisionAngle);
                    var a1 = ball.vel.x * nX + ball.vel.y * nY
                    var a2 = ball2.vel.x * nX + ball2.vel.y * nY
                    var optimisedP = (2.0 * (a1-a2) ) / 2

                    ball.vel.x -= optimisedP * nX
                    ball.vel.y -= optimisedP * nY
                    ball2.vel.x += optimisedP * nX
                    ball2.vel.y += optimisedP * nY

                }

            }

            //Bounce off sides of container
            if(ball.x - ball.r < 0){
                ball.x = ball.r;
                ball.reflectX();
            }
            if(ball.x + ball.r > stage.getWidth()){
                ball.x = stage.getWidth() - ball.r;
                ball.reflectX();
            }
            if(ball.y - ball.r < 0){
                ball.y = ball.r;
                ball.reflectY();
            }
            if(ball.y + ball.r > stage.getHeight()){
                ball.y = stage.getHeight() - ball.r;
                ball.reflectY();
            }
            circle.setX(ball.x);
            circle.setY(ball.y);
        }

    }, layer);

    //Make Ball Cluster
    var clusterRadius=2;
    for(var x=-clusterRadius; x<=clusterRadius; x++){
        for(var y=-clusterRadius; y<=clusterRadius; y++){
            balls.push(new PhysicsBall(250+30*x, 250+30*y, new Vector(0,0)));
        }
    }





    for(var j=0; j<balls.length; j++){
        //Visual representation of the ball object
        circles.push( new Kinetic.Circle({
            x: balls[j].x,
            y: balls[j].r,
            radius: balls[j].r,
            fill: 'blue',
            stroke: 'black',
            strokeWidth: 2
        }));
        layer.add(circles[j]);
    }
    rect.on('click tap', function(){
        var mousepos = stage.getMousePosition();
        var mouseX = mousepos.x;
        var mouseY = mousepos.y;
        var newBall = new PhysicsBall(mouseX, mouseY, new Vector(Math.random() * 7, Math.random()*7));
        var newCircle = new Kinetic.Circle({
            x: newBall.x,
            y: newBall.y,
            radius:newBall.r,
            fill: 'red',
            stroke:'black',
            strokeWidth: 2
        });
        balls.push(newBall);
        circles.push(newCircle);
        layer.add(newCircle);

        //Hide the instruction text.
        instructionText.hide();
    });

    anim.start();
}

animationStart();

