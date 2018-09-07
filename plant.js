var plantImg;

/*function preload() {
  plantImg = loadImage('assets/Plant.png');
}*/

function Plant(x, y, nutrition, size){
    this.x = x;
    this.y = y;
    this.nutrition = nutrition;
    this.s = size;

    /*this.display = function(){
        image(plantImg, this.x, this.y, this.s, this.s);
    }*/
    
    this.display = function(){
        /*beginShape(TRIANGLE_FAN);
        vertex(57.5, 50);
        vertex(57.5, 15);
        vertex(92, 50);
        vertex(57.5, 85);
        vertex(22, 50);
        vertex(57.5, 15);
        endShape();*/
        
        push();
        translate(this.x, this.y);
        
        noStroke();
        strokeWeight(1);
        
        //I decided to use a tetradic colour harmony that uses red, purple, yellow-green and blue-green
        
        fill(255, 52, 7);
        triangle(0, 0, 0, this.s, this.s, 0);
        fill(218, 6, 229);
        triangle(0, 0, this.s, 0, 0, -this.s);
        fill(197, 242, 75);
        triangle(0, 0, 0, -this.s, -this.s, 0);
        fill(10, 255, 201);
        triangle(0, 0, -this.s, 0, 0, this.s);
        
        pop();
    }
}
