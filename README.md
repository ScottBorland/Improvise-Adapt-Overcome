# Improvise-Adapt-Overcome
A light p5.js evolution simulator.

Evolution Simulator            17/08/18
My project is a Javascript program written using the p5 library for web development that simulates evolution by random mutations. I have programmed simple plant, primary consumer (which is referred to as 'prey' in the code), and secondary consumer (which is referred to as 'predator in the code) objects which are represented as simple shapes. The coloured squares represent the plants, the circles represent the primary consumers which eat the plants and the triangles represent the secondary consumers which eat the primary consumers.

After it has downloaded, open the 'improvise, adapt, overcome' folder on your pc and simply double click the index.html file. This should open a window in your default browser within which the simulation should be running. You can refresh the webpage to restart the program.

The checkbox above the simulation toggles developer mode which allows you to view the attributes of the prey and the predators which are represented as follows:
On the prey object, the prey's 'food vision' which is the radius within which it reacts to the presence of food is represented by the blue circle. The prey's 'predator vision' is represented by the orange-brown circle and the alpha value (the transparency) of this circle represents the prey's hunger, which is dependent on the sum total of the prey's other attributes. The larger the hunger value is, the less transparent the object is. The hunger value affects the speed at which an object health decreases over time to represent starvation. The health of both objects, which is affected by their hunger is represented by the colour of the object which linearly interpolates (referred to in Javascript documentation as 'lerp' between (0, 255, 0) and (255, 0, 0) based on the object's health. In other words, when the object has maximum health it is green, when it has no health (and is about to die) it is red, and otherwise it is somewhere in-between the two. The 'food attraction' of the prey and the 'prey attraction' of the predator are the scaling factor of the force pushing them towards their food. If these values are negative, the prey runs away from the food and the predator runs away from the prey. These values are represented by the direction and length of the green lines. If they are behind the object they have negative values and vice versa. The length of the line represents the scalar value of the attribute. The red line on the prey objects represent their 'attraction' to predators (which is usually negative). The predator objects have one vision attribute represented by the blue circle but have an 'attack distance' which represents the distance at which they will attack a prey object which they are not already pursuing whereas the vision attribute represents the distance within which the predator will continue pursuing the prey.

Within the simulation, left-clicking spawns a prey object, right-clicking spawns a predator object, and pressing the scroll wheel spawns a plant.

The source code for the classes is contained in four separate scripts: plant.js, predator.js, prey.js and sketch.js. You can also view the index.html script. To view the scripts, right-click on them, select 'open with...' and choose a text editor to view them in (I recommend WordPad). I will outline the function of the scripts and key functions but I recommend glancing over the whole thing(if only to appreciate how much time I spent on it!)

You are welcome to ignore any of the coding jargon but I hope you will find some of the prey and predator functions interesting as they demonstrate a practical use for the physics concepts of vectors,forces and accelerations.

The index.html script simply references the javascript scripts and tells the browser to run them and download the p5 library.

The sketch.js script is the main script as it sets up the window and instantiates the initial objects:

function setup() {
    debug = createCheckbox();
    createCanvas(640, 360);
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

as well as calling the functions for each object every frame by looping through the object lists and calling the functions on each object of that iteration:

function draw() {
...    for(var i = predators.length -1; i >= 0; i--){
        predators[i].display();
        predators[i].update();
        predators[i].behaviours();
        predators[i].boundaries();
        predators[i].clone();
        var newPredator = predators[i].clone();
        if(newPredator != null){
            predators.push(newPredator);
        }    

The mousePressed function allows the user to spawn objects by clicking the mouse. The difficulty with this function was that I was unable to disable the default mouse behaviour in certain browsers so when you right-click, the setting pop-up usually appears.

The spawnPlant function ensures that plants which have been spawned do not overlap and if they do, it adjusts the position of the offending plant.

The plant class only consists of a few variables and a display function to ,unsurprisingly, display it. I originally planned to use some pixel art from the internet which is why some of the code is commented out as in the end, I decided to keep the style consistent and made a diamond out of four triangles and coloured them with a tetradic colour scheme [1].

The prey class is far more exciting and contains several functions as well as variables unique to each instance of prey. In the prey script there is also a multitude of different variables to allow me to more easily micro-manage the interactions of objects.
Rather than storing the prey's different attributes as separate variables, I stored them as a list called 'dna' so that when I cloned the objects (i.e. when they 'reproduced') I pass the list of dna to them as an argument.
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
    }
If the prey was instantiated with a list of dna as an argument, then it would know it was a clone and would apply mutations to its attributes to randomly tweak them.
else {
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

The prey also contains functions to replicate physics behaviours. The update() function acts as a very basic physics engine:
this.update = function(){
        this.health -= this.hunger;
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.dna[0]);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
    }
Although it is not realistic to multiply acceleration by 0 every frame, it is a simplification to prevent forces acceleration from increasing exponentially. This.dna[0] refers to the object's maximum speed which its velocity is limited to. Velocity, position and acceleration are all 2D vectors in this program.
There is also a function to apply forces, but it is also simplified as it does not take mass into consideration, so it simply uses F = A.
 this.applyForce = function(force){
        this.acceleration.add(force);
    }
The most important function is the steer() function which calculates the velocity needed to steer an object towards its targets based not only on the targets position but also on the object's current speed.
this.seek = function(target){
        var desired = p5.Vector.sub(target, this.position);
        desired.setMag(this.dna[0]);
        var steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(this.maxforce);
        return steer;
    }
The this.eat function determines what the closest target is to the object and whether it is visible  (within the vision radius) and if so, it uses the this.seek function to return the velocity needed to move towards the target. It also deletes the target if it is within 'eating range' of the object and increases the object's health by the nutrition value of the target.
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
The this.flee() function does the same but for predators that are within the predatorVision radius.

The this.behaviours () function uses the this.eat and this.flee functions to return vectors and then multiplies them by the relevant scalers (food attraction or predator attraction) before applying them as forces.

The this.boundaries () function just ensures that the prey remain on the screen.

The this.show() function displays the prey as ellipse and if the debug checkbox is checked, it displays the gizmos.

The predator.js script contains a lot of the same or similar functions rather than a this.eat () function, it has a this.hunt () function which is more complex as the predator only attacks the prey if it is within the attackDistance radius but continues hunting it as long as it remains within the vision radius.



Because the simulation is influenced by randomness such as the starting the attributes of the attributes, when they will clone and how their offspring will have mutated, the simulation often ends with one species becoming extinct. Although extremely dysfunctional animals are quickly eradicated (such as predators which are repelled by prey so starve to death), the evolution of the remaining animals does not follow a linear path and is often yields undesirable results. This is the problem with evolution by random mutation because species are prone to quickly becoming extinct if they are not fortunate enough to evolve the necessary characteristics. Furthermore, organisms would also develop unnecessary characteristics and features that they wouldn't need but because they were lucky enough to survive, possibly just because they were in the right place in the right plan, these characteristics would be passed on to future generations and could negatively impact them and cause the species to become extinct.

The evolution described in 'On the Theory of Evolution' by Charles Darwin which explores the concept of evolution by natural selection is more efficient than the evolution in my simulation, but it also contains a significant amount of chance. Richard Dawkins, the famous British scientist, tried to rectify a misunderstanding of Darwinism in his 1976 book, 'The Selfish Gene'. Dawkins argued that natural selection took place at the genetic level rather than at the species or individual level. Dawkins created his own computer program nicknamed 'the weasel program' which he released as an interactive CD-ROM with which users could create 'biomorphs' which were computer simulated examples of evolution first introduced in 'The Blind Watchmaker'. In Dawkins's program, rather than having moving objects responding to stimuli, he simply created static models which the user could view. This is likely because of the hardware limitations at the time. The fundamental difference between Dawkins's program and my program is that he influenced the characteristics of his species by changing their genes. Rather than randomly tweaking attributes, changing their genes meant that attributes were changed based on a desired output, for example, the prey class might have a gene for responding to predators and this would influence its predator vision and its predator attraction which both affect how it responds to predators.

In Dawkins's first book, 'The Selfish Gene', he introduced the concept of 'memes', coming from the Greek word 'mimeme' meaning to imitate. He originally defined 'memes' as the cultural equivalent of genes as ideas and concepts from popular culture, take on a life of their own with society and by being passed down to the minds of offspring, affect the progress of evolution. Therefore, in honour of Richard Dawkins, I have named my program after a popular internet meme: 'Improvise, adapt, overcome'.

If I were to make this project again, I would include different methods of movement and different methods of evolution, hopefully with the result that one would begin to see the emergence of different subspecies with defined patterns of characteristics. I would also include less variables as the vast number of them, particularly in the prey class, made displaying attributes in a visually appealing way very difficult and meant that it was harder to isolate the causes of certain behaviours.  


Reference  
https://coolors.co/ : Helped me create the tetradic colour scheme of the food
https://www.britannica.com/biography/Richard-Dawkins : Informed me about the life and work of Richard Dawkins
https://evolutionnews.org/2016/09/dawkinss_weasel/ : Gave detailed information on 'the weasel program'
'Sam's teach yourself Javascript in 24 hours' by Phil Ballard: This book took significantly more than 24 hours to work through, but it was an extremely useful introduction to web development and the JavaScript language.
p5js.org/reference : This was a useful reference for coding which included detailed examples of functions
https://www.youtube.com/user/shiffman : The Coding Train YouTube channel run by Daniel Shiffman has always been my primary resource for learning programming as the videos are informative and entertaining.

James Reid : A friend and former Trinity student who spent time critiquing my program, explained Dawkins's theory and his computer program to me and explained why my method of evolution was unlikely to produce optimal species.

Scott Borland 
