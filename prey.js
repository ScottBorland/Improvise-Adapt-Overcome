//dna[0] = speed, dna[1] = size, dna[2] = food attraction, dna[3] = predator attraction, dna[4] = food vision, dna[5] = predator vision

//These variables are kept external so that they are easy to tweak and so the dna values are in a similar range so are easier to compare
var visionScaler = 20;
//increasing this makes prey starve faster
var hungerScaler = 0.0002;

//frequecy of reproduction
var cloneRate = 0.0015;
//frequency of mutations
var mr = 0.1;

//increasing this gives smaller prey less health
var sizeHealthScaler = 1;
//increasing this makes smaller prey faster
var sizeSpeedScaler = 1;

var speedImportance = 3;
var sizeImportance = 0.5;
var foodAttractionImportance = 0.8;
var predatorAttractionImportance = 0.8;
var visionImportance = 1.3;

var speedMutationSize = 0.2;
var sizeMutationSize = 0.2;
var foodAttractionMutationSize = 0.5;
var predatorAttractionMutationSize = 0.5;
var visionMutationSize = 0.2;

function Prey(x, y, dna){
    this.position = createVector(x, y);
    this.acceleration = createVector(0, 0);
    this.velocity = p5.Vector.random2D();

    this.maxforce = 2;

    this.rotation = 0;

    this.dna = [];
    if(dna === undefined){
        //speed
        this.dna[0] = random(1,5);
        //size
        this.dna[1] = random(1,5);
        //food attraction
        this.dna[2] = random(0, 2.5);
        //predator attraction
        this.dna[3] = random(-2.5, 2.5);
        //food vision
        this.dna[4] = random(1,5);
        //predator vision
        this.dna[5] = random(1, 5);
    } else {
    // Mutation
    this.dna[0] = dna[0];
    if (random(1) < mr) {
        this.dna[0] += random(-speedMutationSize, speedMutationSize);
        this.dna[0] = constrain(this.dna[0], 1, 5);
    }
    this.dna[1] = dna[1];
    if (random(1) < mr) {
        this.dna[1] += random(-sizeMutationSize, sizeMutationSize);
        this.dna[1] = constrain(this.dna[1], 1, 5);
     }
    this.dna[2] = dna[2];
    if (random(1) < mr) {
        this.dna[2] += random(-foodAttractionMutationSize, foodAttractionMutationSize);
        this.dna[2] = constrain(this.dna[2], -2.5, 2.5);
    }
    this.dna[3] = dna[3];
    if (random(1) < mr) {
        this.dna[3] += random(-predatorAttractionMutationSize, predatorAttractionMutationSize);
        this.dna[3] = constrain(this.dna[3], -2.5, 2.5);
    }
    this.dna[4] = dna[4];
    if(random(1) < mr){
        this.dna[4] += random(-visionMutationSize, visionMutationSize);
        this.dna[4] = constrain(this.dna[4], 1, 5);
    }
    this.dna[5] = dna[5];
    if(random(1) < mr){
        this.dna[5] += random(-visionMutationSize, visionMutationSize);
        this.dna[5] = constrain(this.dna[5], 1, 5);
    }
  }
    
    this.health = (this.dna[1] / 3) * sizeHealthScaler;
    this.dna[0] *= (3 * sizeSpeedScaler)/ this.dna[1];
    
     //This will need tweaking but for now:
    var total = (this.dna[0] * speedImportance) + (this.dna[1] * sizeImportance) + (Math.abs(this.dna[2]) * foodAttractionImportance) + (Math.abs(this.dna[3]) * predatorAttractionImportance) + (this.dna[4] * visionImportance);
    this.hunger = (total / this.dna.length -1) * hungerScaler;
    //console.log(this.health);

    this.update = function(){
        this.health -= this.hunger;
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.dna[0]);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
    }

    this.applyForce = function(force){
        this.acceleration.add(force);
    }

    this.seek = function(target){
        var desired = p5.Vector.sub(target, this.position);
        desired.setMag(this.dna[0]);
        var steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(this.maxforce);
        return steer;
    }

    this.behaviours = function(){
        var steerPlant = this.eat();
        var steerPred = this.flee();

        steerPlant.mult(this.dna[2]);
        steerPred.mult(this.dna[3]);

        this.applyForce(steerPlant);
        this.applyForce(steerPred);
    }
    
      this.clone = function() {
    if (random(1) < cloneRate) {
      return new Prey(this.position.x, this.position.y, this.dna);
    } else {
      return null;
    }
  }

    this.eat = function(){
        var record = Infinity;
        var closest = null;
        for(var i = plants.length - 1; i >= 0; i--){
            var d = this.position.dist(plantPositions[i]);
            if(d < this.dna[1] * 2){
                this.health += plants[i].nutrition;
                plants.splice(i, 1);
                plantPositions.splice(i, 1);
            } else {
                if(d < record && d < this.dna[4] * visionScaler){
                    record = d;
                    closest = plantPositions[i];
                }
            }
        }
        if (closest != null){
            return this.seek(closest);
        } else{
        return createVector(0, 0);
        }
    }
    
    this.flee = function(){
        var recordP = Infinity;
        var closestP = null;
        for(var i = predators.length -1; i >= 0; i--){
            var predatorPos = createVector(predators[i].position.x, predators[i].position.y);
            var d = this.position.dist(predatorPos);
            if(d < recordP && d < this.dna[5] * visionScaler){
                recordP = d;
                var v1= createVector(predators[i].position.x, predators[i].position.y);
                closestP = v1;
            }
        }
        if(closestP != null){
            return this.seek(closestP);
        }else{
            return createVector(0, 0);
        }
    }
    
    this.dead = function(){
        return (this.health < 0);
    }

    this.show = function(){
        var angle = this.velocity.heading() + PI / 2;

        push();
        translate(this.position.x, this.position.y);
        rotate(angle);

        
        if(debug.checked()){
            
            strokeWeight(3);

            stroke(0, 255, 0);

            noFill();

            line(0, 0, 0, -this.dna[2] * 25);

            strokeWeight(2);

            /*Calculating the maximum and minimum bounds for the hunger variable to allow me to use the map() function to convert it to a value between 10 and 255
            which I will use as an alpha (brightness) value for the colour of the ellipse */
            var hungerMin = (1 * speedImportance + 1 * sizeImportance + 1 * visionImportance / this.dna.length) * hungerScaler;
            var hungerMax = (5 * speedImportance + 5 * sizeImportance + 2.5 * foodAttractionImportance + 2.5 * predatorAttractionImportance + 5 * visionImportance / this.dna.length) * hungerScaler;
            //For display purposed, the vision ellipses thickness(strokeWeight) and alpha (brightness) are relative to its hunger so the larger the hunger, the thicker and more visible the ellipse is
            if(this.hunger < hungerMin){
                //console.log('hungerMin is incorrect');
            } else if(this.hunger > hungerMax){
                console.log('hungerMax is incorrect');
            }
            var hungerAlpha = map(this.hunger, hungerMin, hungerMax, 100, 255,);
            var hungerWeight = map(this.hunger, hungerMin, hungerMax, 0.5, 10);
            
            hungerColor = color(255, 174, 0, hungerAlpha - 50);
            stroke(hungerColor);
            strokeWeight(hungerWeight);

            ellipse(0, 0, this.dna[4] * visionScaler + 50);
            
            predVisionColour = color(0, 76, 255,);
            stroke(predVisionColour);
            
            ellipse(0, 0, this.dna[5] * visionScaler + 50);

            stroke(255, 0, 0, 100);
            strokeWeight(2);
            line(0, 0, 0, -this.dna[3] * 25);
        }
        
        var gr = color(0, 255, 0);
        var rd = color(255, 0, 0);
        var col = lerpColor(rd, gr, this.health);
    
        fill(col);
        stroke(col);
        strokeWeight(col);
        
        ellipse(0, 0, this.dna[1] * 1.5, this.dna[1] * 1.5);

        /*beginShape();

        vertex(0, -this.dna[1] * 2);

        vertex(-this.dna[1], this.dna[1] * 2);

        vertex(this.dna[1], this.dna[1] * 2);

        endShape(CLOSE);*/

        pop();
    }

    this.boundaries = function(){
        var d = 0;
        var desired = null;
        if(this.position.x < d){
            desired = createVector(this.dna[0], this.velocity.y);
        } else if(this.position.x > width - d){
            desired = createVector(-this.dna[0], this.velocity.y);
        }
        if(this.position.y < d){
            desired = createVector(this.velocity.x, this.dna[0]);
        } else if(this.position.y > height -d){
            desired = createVector(this.velocity.x, -this.dna[0]);
        }

        if(desired !== null){
            desired.normalize();
            desired.mult(this.dna[0]);
            var steer = p5.Vector.sub(desired, this.velocity);
            steer.limit(this.maxforce);
            this.applyForce(steer);
        }

    }

}
