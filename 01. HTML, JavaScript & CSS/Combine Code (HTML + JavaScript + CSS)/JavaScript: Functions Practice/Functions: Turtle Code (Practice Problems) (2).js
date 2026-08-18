//Challenge 1
// A red line of 100, then a green line of 100.
penColor("red")
forward(100)
penColor("green")
forward(100)

//Challange 2
//Type R, G or B and the robot draws a line of 100 in that colour.
<input id="colorInput" value="R">
<button onclick="main()">RUN</button>

function main() {
  const colorHandle = document.querySelector('#colorInput');
  const c = colorHandle.value;
  line(c);
}

function line(color) {
  if (color === "R"){
    penColor("red")
  }
  if (color === "G"){
    penColor("green")
  }
  if (color === "B"){
    penColor("blue")
  }
  // One if per letter: R red, G green, B blue.
  // Then draw the line — 100 long.
forward(100);
}

//Challenge 3
//The letters and the ifs stay the same, and this time they colour the square you already know.
<input id="colorInput" value="R">
<button onclick="main()">RUN</button>

function main() {
  const colorHandle = document.querySelector('#colorInput');
  const c = colorHandle.value;
  square(c);
}

function square(color) {
  if (color === "R"){
    penColor("red")
  }
  if (color === "G"){
    penColor("green")
  }
  if (color === "B"){
    penColor("blue")
  }
  // The ifs from Challenge 2, then the square — every side 100.
forward(100);
left(90);
forward(100);
left(90);
forward(100);
left(90);
forward(100);
left(90);
forward(100); 
}

//Challenge 4
//Type S or T, and this time the if chooses WHICH function gets called.
<input id="shapeInput" value="S">
<button onclick="main()">RUN</button>

function main() {
  const shapeHandle = document.querySelector('#shapeInput');
  const s = shapeHandle.value;
  if (s ==="S"){
    square()
  }
  if (s==="T"){
    triangle()
  }
  // If s is 'S', call square. If s is 'T', call triangle.
}

function square() {
  forward(100);
  left(90);
  forward(100);
  left(90);
  forward(100);
  left(90);
  forward(100);
  left(90);
  forward(100);
}

function triangle() {
  forward(100);
  left(120);
  forward(100);
  left(120);
  forward(100);
  left(120);
  forward(100);
}

//Challenge 5
//The robot draws two squares with a space between them, and one letter colours both.
<input id="colorInput" value="R">
<button onclick="main()">RUN</button>

function main() {
  const colorHandle = document.querySelector('#colorInput');
  const c = colorHandle.value;
  square(c);
  space();
  square(c)
  // A square, a space, another square — both in the colour c.
}

function square(color) {
    if (color === 'R') {
        penColor('red');
    }

    if (color === 'G') {
        penColor('green');
    }

    if (color === 'B') {
        penColor('blue');
    }

    forward(100);
    left(90);
    forward(100);
    left(90);
    forward(100);
    left(90);
    forward(100);
    left(90);
    forward(100);
}

function space() {
    penUp();
    forward(40);
    penDown();
}

//Challenge 6
//This page has three boxes: a shape, a colour and a size. Main decides which function to call, and hands both values through.
<input id="shapeInput" value="S">
<input id="colorInput" value="R">
<input id="sizeInput" value="60">
<button onclick="main()">RUN</button>

function main() {
  const colorHandle = document.querySelector('#colorInput');
  const c = colorHandle.value;
  const sizeHandle = document.querySelector('#sizeInput');
  const x = Number(sizeHandle.value);
  const shapeHandle = document.querySelector('#shapeInput');
  const s = shapeHandle.value;
  if (s==="S"){
    square(c,x)
  }
  if (s==="T"){
    triangle(c,x)
  }
  // Read all three boxes, then decide: 'S' square, 'T' triangle —
  // in the colour and size that were typed.
}

// Build square(color, size) and triangle(color, size) yourself.
function square(color,size){
  if (color === "R"){
    penColor("red")
  }
  if (color === "G"){
    penColor("green")
  }
  if (color === "B"){
    penColor("blue")
  }
  forward(size);
  left(90);
  forward(size);
  left(90);
  forward(size);
  left(90);
  forward(size);
  left(90);
  forward(size);
}

function triangle(color,size){
  if (color === "R"){
    penColor("red")
  }
  if (color === "G"){
    penColor("green")
  }
  if (color === "B"){
    penColor("blue")
  }
  forward(size);
  left(120);
  forward(size);
  left(120);
  forward(size);
  left(120);
  forward(size);

}

//Challenge 7
//The board shows six growing lines. You build the machine that draws one, then work out both rules for yourself.
// Six calls to your own function. What changes each time, and how?
red();
left(90);
forward(10);
right(180);
forward(10);
left(90);
space();
green();
left(90);
forward(20);
right(180);
forward(20);
left(90);
space();
blue();
left(90);
forward(30);
right(180);
forward(30);
left(90);
space();
red();
left(90);
forward(40);
right(180);
forward(40);
left(90);
space();
green();
left(90);
forward(50);
right(180);
forward(50);
left(90);
space();
blue();
left(90);
forward(60);
right(180);
forward(60);
left(90);
space();

// Build line(color, size): one upright line, then step past it
// so the next one stands apart.
function red(){
  penColor("red")
}
function blue(){
  penColor("blue")
}
function green(){
  penColor("green")
}

function space(){
  penUp()
  forward(10);
  penDown()
}

//Challenge 8
//Type sizes and watch the ghost. Somewhere on the dial, the square changes its mind about what colour to be.
<input id="sizeInput" value="60">
<button onclick="main()">RUN</button>

function main() {
  const sizeHandle = document.querySelector('#sizeInput');
  const x = Number(sizeHandle.value);
  mystery(x);
}

function mystery(size) {
  // Watch the ghost as you type. Where does it change? Which way?
  if (size<=99){
    penColor("blue")
  }
  if (size>99){
    penColor("red")
  }
  forward(size);
  left(90);
  forward(size);
  left(90);
  forward(size);
  left(90);
  forward(size);
  left(90);
  forward(size);

}

