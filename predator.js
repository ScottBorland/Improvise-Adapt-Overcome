//dna[0] = speed, dna[1] = size, dna[2] = prey attraction, dna[3] = attack distance
//dna[4] = vision

var PredatorMR = 0.02;
var PredatorCloneRate = 0.0007;

var predatorHungerScaler = 0.0002;
//var predatorHungerScaler = 0;

var speedMutationSize = 0.2;
var sizeMutationSize = 0;
var preyAttractionMutationSize = 0.8;
var attackDistanceMutationSize = 0.8;
var visionMutationSize = 0.2;

var speedImportance = 3;
var sizeImportance = 0;
var preyAttractionImportance = 0.8;
var attackDistanceImportance = 0.8;
var visionImportance = 1.3;

var attackDistanceScaler = 20;

function Predator(x, y, dna){
    this.position = createVector(x, y);
    this.acceleration = createVector(0, 0);
    this.velocity = p5.Vector.random2D();
    
    this.health = 1;
    
    this.attacking = false;
    
    this.maxforce = 20; 
     
    this.rotation = 0;
    
    this.dna = [];
    if(dna === undefined){
        //speed
        this.dna[0] = random(3, 9);
        //size
        this.dna[1] = 3;
        //prey attraction
        this.dna[2] = random(-1, 3);
        //'attack distance'
        this.dna[3] = random(5, 10);
        //vision
        this.dna[4] = random(5, 10);

    } else{
        // Mutation
        this.dna[0] = dna[0];
    if (random(1) < PredatorMR) {
        this.dna[0] += random(-speedMutationSize, speedMutationSize);
        this.dna[0] = constrain(this.dna[0], 2, 18);
    }
    this.dna[1] = dna[1];
    if (random(1) < PredatorMR) {
        this.dna[1] += random(-sizeMutationSize, sizeMutationSize);
        this.dna[1] = constrain(this.dna[1], 1, 5);
     }
    this.dna[2] = dna[2];
    if (random(1) < PredatorMR) {
        this.dna[2] += random(-preyAttractionMutationSize, preyAttractionMutationSize);
        this.dna[2] = constrain(this.dna[2], -1, 6);
    }
    this.dna[3] = dna[3];
    if (random(1) < PredatorMR) {
        this.dna[3] += random(-attackDistanceMutationSize, attackDistanceMutationSize);
        this.dna[3] = constrain(this.dna[3], 3, 20);
    }
    this.dna[4] = dna[4];
    if(random(1) < PredatorMR){
        this.dna[4] += random(-visionMutationSize, visionMutationSize);
        this.dna[4] = constrain(this.dna[4], 5, 15);
        }
    }
    this.stamina = this.dna[2];
    var total = (this.dna[0] * speedImportance) + (this.dna[1] * sizeImportance) + (Math.abs(this.dna[2]) * preyAttractionImportance) + (Math.abs(this.dna[3]) * attackDistanceImportance) + + (this.dna[4] * visionImportance);
    this.hunger = (total / this.dna.length - 1) * predatorHungerScaler;
    
    
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
    
    this.clone = function(){
        if(random(1) < PredatorCloneRate){
            return new Predator(this.position.x, this.position.y, this.dna);
        } else{
            return null;
        }
    }
    
    this.behaviours = function(){
        
        var steerPrey = this.hunt();

        steerPrey.mult(this.dna[2]);

        this.applyForce(steerPrey);
    }
    
    this.hunt = function(){
        //console.log(this.seek(closest));
        var record = Infinity;
        var closest = null;
        
        for(var i = prey.length -1; i >= 0; i--){
            var preyPos = createVector(prey[i].position.x, prey[i].position.y);
            var d = this.position.dist(preyPos);
            if(d < 20){
            prey.splice(i, 1);
            this.health += preyNutrition;
            return createVector(0, 0);
            }
        }
        
        if(!this.attacking){
        for(var i = prey.length -1; i >= 0; i--){
            var preyPos = createVector(prey[i].position.x, prey[i].position.y);
            var d = this.position.dist(preyPos);
            if(d < record && d < this.dna[3] * attackDistanceScaler){
            record = d;
            closest = prey[i];
            }
         if(closest != null){
            return this.seek(createVector(closest.position.x, closest.position.y)); 
             this.attacking = true;
            }  
        else{
            this.attacking = false;
            return createVector(0, 0);
            }
        }
        } else{
            if(closest == null){
                this.attacking = false;
                return createVector(0, 0);
            } else{
                /*if(d < 20){
                var index = prey.indexOf(closest);
                console.log(index);
                prey.splice(index, 1);
                this.health += preyNutrition;
                return createVector(0, 0);
                this.attacking = false;
            }else{*/    
            if(closest < this.dna[4] * visionScaler){
            return this.seek(createVector(closest.position.x, closest.position.y));
                }else{
                    this.attacking = false;
                    return createVector(0, 0);
                }
            }
        }
    }
    
    this.dead = function(){
        return(this.health < 0);
    }
    
    this.display = function(){
        var angle = this.velocity.heading() + PI / 2;
        
        push();
        translate(this.position.x, this.position.y);
        rotate(angle);
        
        if(debug.checked()){
            strokeWeight(3);
            

            noFill();
            stroke(0, 255, 0);
            line(0, 0, 0, -this.dna[2] * 25);
            
            stroke(195, 144, 219, 50);
            strokeWeight(2);
            ellipse(0, 0, this.dna[4] * visionScaler);
            
            stroke(0, 0, 255, 75);
            strokeWeight(1.5);
            ellipse(0, 0, this.dna[3] * attackDistanceScaler)
        }
        var gr = color(0, 255, 0);
        var rd = color(255, 0, 0);
        var col = lerpColor(rd, gr, this.health);
    
        fill(col);
        stroke(col);
        strokeWeight(col);

        beginShape();

        vertex(0, -this.dna[1] * 2);

        vertex(-this.dna[1], this.dna[1] * 2);

        vertex(this.dna[1], this.dna[1] * 2);

        endShape(CLOSE);

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












