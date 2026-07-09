JAVASCRIPT QUESTIONS:
-
1. Predict What Happens
(CODE TO BE SHOW ON USER SCREEN MENTIONED BELOW) 

let points = 10;

points = points + 5;
points = points * 2;

alert(points);

Q.What will the alert box show?
A. 15
B. 20
C. 30
D. 1052

ANSWER: C. 30
WHY? First, 10 +5 = 15, then 15x2 = 30
-
2. Choose the Correct Fix
The code below is supposed to create a Student class and show the student's name in an alert.
(CODE TO BE SHOW ON USER SCREEN MENTIONED BELOW) 

class Student {
  constructor(name, age) {
    name = this.name;
    age = this.age;
  }
}

let student1 = new Student("Ananya", 15);
alert(student1.name);

Q. What should be changed inside the constructor?
A.this.name = name;
  this.age = age;
B.name.this = name;
  age.this = age;
C.Student.name = name;
  Student.age = age;
D.let name = this.name;
  let age = this.age;

ANSWER: A
WHY? this.name = name stores the given value isnide that specific object

-----------------------------------------------------------------------

HTML QUESTIONS:
-
3. Spot the Mistake
(CODE TO BE SHOW ON USER SCREEN MENTIONED BELOW) 

<img href="puppy.png" alt="A puppy">

Q. What is wrong with this HTML?
A. The <img> tag should use src, not href
B. The <img> tag must have a closing tag
C. The alt attribute should be removed
D. Nothing is wrong

ANSWER: A
CORRECT VERSION: <img src="puppy.png" alt="A puppy">
-
4.Choose the Best HTML Structure
Which option correctly creates a form with an email input and a submit button?
(CODE TO BE SHOW ON USER SCREEN MENTIONED BELOW)
A.

<form>
  <input type="email" placeholder="Enter email">
  <button type="submit">Submit</button>
</form>

B.

<form>
  <email>Enter email</email>
  <button>Submit</button>
</form>

C.

<input form="email">
<button form="submit">Submit</button>

D.

<form>
  <input type="text-email">
  <submit>Submit</submit>
</form>

ANSWER: A
WHY?  <input type="email"> is the correct way to make an email input field.
-----------------------------------------------------------------------

CSS QUESTIONS:
-
5. Predict the Final Styling
(CODE TO BE SHOW ON USER SCREEN MENTIONED BELOW)
Look at the HTML:
<p class="text highlight" id="main-text">Welcome to my website!</p>

Look at the css:
.text {
  color: blue;
  font-size: 16px;
}

.highlight {
  color: green;
  background-color: yellow;
}

#main-text {
  color: purple;
}

Q.What will the paragraph look like?

A. Blue text, 16px font size, no background colour
B. Green text, 16px font size, yellow background
C. Purple text, 16px font size, yellow background
D. Purple text, no font size, no background colour

ANSWER: C
WHY? The paragraph gets font-size: 16px from .text, background-color: yellow from .highlight, and color: purple from #main-text.
The ID selector wins over the class selectors for the text colour.
-
6. Find the correct Selector
(CODE TO BE SHOW ON USER SCREEN MENTIONED BELOW)
Look at the HTML:

<h1 id="main-title">Welcome</h1>
<p class="intro">This is my website.</p>

Q.Which CSS correctly styles only the paragraph?

A.

#intro {
  color: blue;
}

B.

.intro {
  color: blue;
}

C.

main-title {
  color: blue;
}

D.

p intro {
  color: blue;
}

ANSWER: B
WHY? The paragraph has a class called intro, so CSS uses .intro.
-----------------------------------------------------------------------

WILDCARD QUESTION:
7. Inetractive Webpage Questions
A student wants the button to change the paragraph text when it is clicked.
(CODE TO BE SHOW ON USER SCREEN MENTIONED BELOW)


<p id="message">Hello!</p>
<button onclick="changeText()">Click Me</button>

<script>
  function changeText() {
    document.getElementById("message").textContent = "You clicked the button!";
  }
</script>

Q.What happens when the button is clicked?

A. The paragraph changes to "You clicked the button!"
B. The button disappears
C. The page background changes colour
D. The code gives an error because JavaScript cannot change text

ANSWER: A
WHY? document.getElementById("message") finds the paragraph, and .textContent changes the text inside it.