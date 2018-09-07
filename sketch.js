prey = [];
predators = [];
plants = [];
plantPositions = [];

var plantNutrition = 0.2;
var plantSize = 5;
var preyNutrition = 0.4;

var numberOfPlants = 20;

var debug;

function setup() {
    
    debug = createCheckbox();
    
    createCanvas(1920, 1080);


    for(var i = 0; i < 10; i++){
        var x = random(width);
        var y = random(height);
        prey[i] = new Prey(x, y,);
    }
    
    for(var i = 0; i < 3; i++){
        var x = random(width);
        var y = random(height);
        predators[i] = new Predator(x, y);
    }

    for(var i = numberOfPlants; i > 0; i--){
        spawnPlant();
    }
}

function draw() {

    //background(59, 206, 62);
    background(51);

    //spawn Plants
    if(random(1) < 0.08){
        spawnPlant();
    }
    
    for(var i = plants.length -1; i >= 0; i--){
        plants[i].display();
    }
    
    for(var i = predators.length -1; i >= 0; i--){
        predators[i].display();
        predators[i].update();
        predators[i].behaviours();
        predators[i].boundaries();
        predators[i].clone();
        
        var newPredator = predators[i].clone();
        if(newPredator != null){
            predators.push(newPredator);
        }
        if(predators[i].dead()){
            predators.splice(i, 1);
        }
    }
    
    for(var i = prey.length -1; i >= 0; i--){
        prey[i].boundaries();
        prey[i].behaviours();
        prey[i].update();
        prey[i].clone();
        prey[i].show();
        
        var newPrey = prey[i].clone();

        if (newPrey != null) {
        prey.push(newPrey);
        }
    
    
    if(prey[i].dead()){
        var x = prey[i].position.x;
        var y = prey[i].position.y;
        spawnPlant(createVector(x, y));
        prey.splice(i, 1);
        }
    }  
    
    if(prey.length < 2){
        var x = random(width);
        var y = random(height);
        newPrey = new Prey(x, y);
        prey.push(newPrey);
    }
    
}

function mousePressed(){
    if(mouseButton === LEFT){
        var x = mouseX;
        var y = mouseY;
        newPrey = new Prey(mouseX, mouseY);
        prey.push(newPrey);
    } else if(mouseButton === RIGHT){
        var x = mouseX; 
        var y = mouseY;
        newPredator = new Predator(mouseX, mouseY);
        predators.push(newPredator);
    } else if(mouseButton === CENTER){
        var x = mouseX;
        var y = mouseY;
        position = createVector(mouseX, mouseY);
        spawnPlant(position);
    }
    event.preventDefault();
}

function spawnPlant(position){
    if(position === undefined){
    var x = random(width);
    var y = random(height);
    }else{
        var x = position.x;
        var y = position.y;
    }
    
    if(x < plantSize){
        x+= random(plantSize, width - plantSize);
    }
    if(x > width - plantSize){
        x-= random(plantSize, width - plantSize);
    }
    if(y < plantSize){
        y+= random(plantSize, height - plantSize);
    }
    if(y > height - plantSize){
        y-= random(plantSize, height - plantSize);
    }
    var neighbours = 0;
    for(var i = 0; i < plantPositions.length; i++){
        if(x - plantPositions[i].x < plantSize && x - plantPositions[i].x > -plantSize){
            if(y - plantPositions[i].y < plantSize && y - plantPositions[i].y > -plantSize){
                neighbours++;
            }
        }
    }

    if(neighbours == 0){
    plants[i] = new Plant(x, y, plantNutrition, plantSize);
    plantPositions.push(createVector(x, y));
    }
}
