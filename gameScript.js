//https://spicyyoghurt.com/tutorials/html5-javascript-game-development/develop-a-html5-javascript-game
//Inspiration came from this cite

let canvas;
let context;

window.onload = init;

//initiating game
function init(){
    canvas = document.getElementById("canvas");
    context = canvas.getContext('2d');
   
    createWorld();
    window.requestAnimationFrame(gameLoop);
}

class GameObject
{
    constructor (context, x, y, vx, vy, color){
        this.context = context;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = getRandomColor();

        this.isColliding = false;
    }
}

class Square extends GameObject
{
    constructor (context, x, y, vx, vy){
        super(context, x, y, vx, vy);

        // Set default width and height
        this.width = 25;
        this.height = 25;
    }

    draw(){

        //Draws box
        context.beginPath();
        context.rect(0, 0, 800, 400);
        context.strokeStyle = '#000000';
        context.stroke();   
        
        detectCollisions();
        
        //draws square
        this.context.fillStyle = this.isColliding? getRandomColor() : this.color;//'#355C7D';
        this.context.fillRect(this.x, this.y, this.width, this.height);

        
    }

    update(secondsPassed){
        // changes locations of vx and vy
        this.x += this.vx * secondsPassed;
        this.y += this.vy * secondsPassed;
    
    }
}
//random int function for random color
function randomIntFromInterval(min, max) { 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

// https://stackoverflow.com/questions/1484506/random-color-generator
function getRandomColor()
{
    
  var letters = '0123456789ABCDEF'.split('');

  var color = '#';

  for (var i = 0; i < 6; i++ )
  {
      color += letters[Math.floor(Math.random() * 16)];
  }

  //code for creating clors in array
/*
  var color = '#';
  let myColors = ['D5D6EA', 'D7ECD9'];
  let x = myColors.length - 1;
  let myNum = randomIntFromInterval(0, 1);
  color = color += myColors[myNum];*/


  return color;
}

let secondsPassed = 0;
let oldTimeStamp = 0;
// function that runs game
function gameLoop(timeStamp)
{
    //allows user to input how many boxes they want
    let myLength = gameObjects.length;
    let boxNum = document.getElementById("numBoxes").value;
    if(boxNum > 100){
        alert('Woah woah woah, too many boxes!');
        document.getElementById("numBoxes").value = 100;
        boxNum = 100;
    }
    if(boxNum < 0){
        alert('You know you can\'t do that!');
        document.getElementById("numBoxes").value = 1;
        boxNum = 1;
    }
    
    //lets user change the speed of box
    let myXSpeed = randomNumber(-500,500);
    let myYSpeed = randomNumber(-500,500);
    for(let i = myLength; i <= boxNum; i++){
        gameObjects.push( new Square(context, getEmptyX(), getEmptyY(), myXSpeed, myYSpeed));
    }
    
    // removes boxes
    if(boxNum >= 1){
        gameObjects.pop();
    }

    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;
    
    // Loop over all game objects
    for (let i = 0; i < gameObjects.length; i++) {
        gameObjects[i].update(secondsPassed);
    }
    
    //clears canvas to re position boxes
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Do the same to draw
    for (let i = 0; i < gameObjects.length; i++) {
        gameObjects[i].draw();
    }

    window.requestAnimationFrame(gameLoop);
}

//creates first gameObject to initiate simulation
let gameObjects; 
function createWorld(){
    gameObjects = [new Square(context, 30, 50, 50, -50)];
}

//gets an empty x spot so user can add boxes
function getEmptyX(){
    let xMax = 800 - 50;
    let xMin = 0 + 50;
    let isFound = false;
    let xVal;
    //loops thorugh till found a spot
    while(!isFound){
        xVal = randomNumber(xMin, xMax);
        isFound = true;
        //loops through all boxes to see if open spot
        for (let i = 0; i < gameObjects.length; i++) {
           let checkX = gameObjects[i].x;
           let checkXWidth = gameObjects[i].width;
           if(xVal >= checkX && xVal + xVal <= checkXWidth){
                isFound = false;
           }

        }
    }
    return xVal;
}

//gets exmpty y spot so users can add boxes
function getEmptyY(){
    let yMax = 400 - 50;
    let yMin = 0 + 50;
    let isFound = false;
    let yVal;
    //loops thorugh till found a spot
    while(!isFound){
        yVal = randomNumber(yMin, yMax);
        isFound = true;
        //loops through all boxes to see if open spot
        for (let i = 0; i < gameObjects.length; i++) {
           let checkY = gameObjects[i].y;
           let checkYHeight = gameObjects[i].height;
           if(yVal >= checkY && yVal + yVal <= checkYHeight){
                isFound = false;
           }

        }
    }
    return yVal;
}

//sees if boxes are at border
function borderHit(x, y, w, h){
    if (w + x >= 800 || y + h >= 400 || x <= 0|| y  <= 0){
        return true;
    }
    else{
        return false;
    }
}
//sees if boxes are intersecting
function rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2) {
    // Check x and y for overlap
    if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2){
        return false;
    }
    return true;
}
//random number generartor
function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
  }

//function from website top of file
function detectCollisions(){
    let obj1;
    let obj2;

    // Reset collision state of all objects
    for (let i = 0; i < gameObjects.length; i++) {
        gameObjects[i].isColliding = false;
    }

    // Start checking for collisions
    for (let i = 0; i < gameObjects.length; i++)
    {
        obj1 = gameObjects[i];
        for (let j = i + 1; j < gameObjects.length; j++)
        {
            obj2 = gameObjects[j];
            // Compare object1 with object2
            if (rectIntersect(obj1.x, obj1.y, obj1.width, obj1.height, obj2.x, obj2.y, obj2.width, obj2.height)){
                obj1.isColliding = true;
                obj2.isColliding = true;

                let vCollision = {x: obj2.x - obj1.x, y: obj2.y - obj1.y};
                let distance = Math.sqrt((obj2.x-obj1.x)*(obj2.x-obj1.x) + (obj2.y-obj1.y)*(obj2.y-obj1.y));
                let vCollisionNorm = {x: vCollision.x / distance, y: vCollision.y / distance};
                let vRelativeVelocity = {x: obj1.vx - obj2.vx, y: obj1.vy - obj2.vy};
                let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;
                if (speed < 0){
                    break;
                }
                obj1.vx -= (speed * vCollisionNorm.x);
                obj1.vy -= (speed * vCollisionNorm.y);
                obj2.vx += (speed * vCollisionNorm.x);
                obj2.vy += (speed * vCollisionNorm.y);
             
            }
        }
        
        //makes it so it will bounce off borders with random speed and velocity
        if(borderHit(obj1.x, obj1.y, obj1.width, obj1.height)){
                
                //Got lazy on the exact numbers
                let mySpeed = document.getElementById("boxSpeed").value;

                let randXSpeed = randomNumber(-mySpeed, mySpeed);
                let randYSpeed = randomNumber(-mySpeed, mySpeed);

                //makes sure it hits border and bounces in side box
                if(obj1.x > 700){
                    randXSpeed = randomNumber(-1, -mySpeed);
                }
                if(obj1.y > 300){
                    randYSpeed = randomNumber(-1, -mySpeed);
                }
                if(obj1.x < 100){
                    randXSpeed = randomNumber(1, mySpeed);
                }
                if(obj1.y < 100){
                    randYSpeed = randomNumber(1, mySpeed);
                }
                obj1.vx = randXSpeed;
                obj1.vy = randYSpeed;


        }
    }
}




