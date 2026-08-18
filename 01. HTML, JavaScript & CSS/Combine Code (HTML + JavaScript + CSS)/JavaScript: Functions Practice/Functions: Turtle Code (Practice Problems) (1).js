//Challenge 1
//The Dashed signal
forward(40);
penUp();
forward(20);
penDown();
forward(40);
penUp();
forward(20);
penDown();
forward(40);

//Challenge 2
//The Bump
left(90);
forward(40);
right(90);
forward(40);
right(90);
forward(40);
left(90);

//Challange 3
//The First Function
bump()
bump()
bump()

function bump() {
  left(90);
forward(40);
right(90);
forward(40);
right(90);
forward(40);
left(90);

}

//Challenge 4
//The Hop
bump();
hop()
bump()
hop()
bump()

function hop() {
  penUp()
  forward(60)
  penDown()
}

function bump() {
  left(90);
forward(40);
right(90);
forward(40);
right(90);
forward(40);
left(90);
}

//Challenge 5
//The Square
square();
square()
square()
square()
square()
right(90)

function square() {
  forward(50)
  left(90)

}

//Challenge 6
//The Triangle
triangle();
triangle()
triangle()
triangle()
right(120)

function triangle() {
  forward(50)
  left(120)
}

//Challenge 7
//The Skyline
skyline()
skyline()
skyline()

function skyline() {
  square();
  hop();
  triangle();
  hop();
}

function square() {
    forward(50);
    left(90);
    forward(50);
    left(90);
    forward(50);
    left(90);
    forward(50);
    left(90);
    forward(50);
}

function triangle() {
    forward(50);
    left(120);
    forward(50);
    left(120);
    forward(50);
    left(120);
    forward(50);
}

function hop() {
    penUp();
    forward(60);
    penDown();
}

//Challenge 8
//The Glitch
comb();
comb();
comb();

function comb() {
  left(90);
  forward(40);
  right(90);
  forward(40);
  right(90);
  forward(40);
  left(90)
}

//Challenge 9
//The Twin Temples
ziggurat();
ziggurat();

function ziggurat() {
  step();
  step();
  forward(40);
  right(90);
  forward(30)
  left(90)
  forward(30)
  right(90)
  forward(30)
  left(90)
  forward(30)
}

function step() {
  left(90)
  forward(30)
  right(90)
  forward(30)
}

//Challenge 10
//The Street
house();
house()
house()

function house() {
  square();
  left(90)
  forward(50)
  left(30)
  triangle()
  left(120)
  forward(50)
  left(30)
  forward(50)
  left(90)
  forward(50)
  hop()
}

function square() {
    forward(50);
    left(90);
    forward(50);
    left(90);
    forward(50);
    left(90);
    forward(50);
    left(90);
    forward(50);
}

function triangle() {
    forward(50);
    left(120);
    forward(50);
    left(120);
    forward(50);
    left(120);
    forward(50);
}

function hop() {
    penUp();
    forward(60);
    penDown();
}

//Challenge 11
//The star
point();
point()
point()
point()
point()

function point() {
  forward(80)
  left(144)
}

//Challenge 11
//The Motherboard
forward(30)
penUp()
forward(15)
penDown()
forward(30)
penUp()
forward(15)
penDown()
forward(30)
bump()
bump()
hop()
square()
hop()
square()
hop()
point();
point()
point()
point();
point()

function point() {
  forward(80)
  left(144)

}

function bump() {
    left(90);
    forward(40);
    right(90);
    forward(40);
    right(90);
    forward(40);
    left(90);
}

function hop() {
    penUp();
    forward(60);
    penDown();
}

function square() {
    forward(50);
    left(90);
    forward(50);
    left(90);
    forward(50);
    left(90);
    forward(50);
    left(90);
    forward(50);
}

function triangle() {
    forward(50);
    left(120);
    forward(50);
    left(120);
    forward(50);
    left(120);
    forward(50);
}






