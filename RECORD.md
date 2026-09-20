# MEAN Stack Web Development — VII Semester SEC Laboratory Record

**Course:** Skill Enhancement Course — VII Semester | **Branch / Section:** ___________ | **Name:** ___________ | **Roll No:** ___________

> Complete record with full source code. Covers all 15 experiments as per syllabus. Only one Node/Express server runs at a time on port `3000`.
> View this file in **Markdown Preview**
> Note: Local absolute paths removed as requested; generic filenames used. (VS Code: `Ctrl+Shift+V`) for proper code highlighting.

---

## Table of Contents

1. [Exp 01 — jQuery Selectors and Content Manipulation](#exp01)
2. [Exp 02 — Change Webpage Style using jQuery](#exp02)
3. [Exp 03 — jQuery DOM Manipulation and Traversing](#exp03)
4. [Exp 04 — Event Handling using jQuery](#exp04)
5. [Exp 05 — Student Registration & Information Table using Bootstrap](#exp05)
6. [Exp 06 — Data Binding and AngularJS Directives](#exp06)
7. [Exp 07 — AngularJS Built-in Filters](#exp07)
8. [Exp 08 — Student Registration Form using AngularJS](#exp08)
9. [Exp 09 — AngularJS Service and Routing](#exp09)
10. [Exp 10 — Node.js Built-in Modules](#exp10)
11. [Exp 11a — Arithmetic Operations Module](#exp11a)
12. [Exp 11b — Student Details Module](#exp11b)
13. [Exp 12 — Event Emitter and Streams](#exp12)
14. [Exp 13 — Node.js Web Server](#exp13)
15. [Exp 14 — Express.js Student Application](#exp14)
16. [Exp 15 — MongoDB + Express.js Database Application](#exp15)
17. [Appendix — How to Run All](#appendix)

**CDNs:** `jquery@3.7.1` · `bootstrap@5.3.3` · `angularjs@1.8.2` + `angular-route@1.8.2`
**Runtime:** `Node v22` · `Express 4.18.2` · `EJS 3.1.9` · `MongoDB Driver 6.5.0`
**Base Directory:** not disclosed (local)

---

<a id="exp01"></a>

## Experiment 01: jQuery Selectors and Content Manipulation

**Aim**

a) Create HTML page with student details (name, roll, branch, marks).
b) Use jQuery selectors to change text, HTML content and attributes.
c) Display modified details.

**File:** `index.html` (local file)

**Theory**

- `$("#id")` selects by ID, `$(".class")` by class.
- `.text()` changes plain text, `.html()` changes HTML, `.attr()` changes attribute.

**Full Code**

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Exp1 - jQuery Selectors</title>
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
</head>
<body>
<h2>Student Details</h2>
<div id="details">
<p id="name">Name: Rahul Sharma</p>
<p class="roll">Roll No: CS001</p>
<p id="branch">Branch: CSE</p>
<p id="marks">Marks: 78</p>
<a id="profile" href="#">Profile</a>
</div>

<button id="btnText">Change Text</button>
<button id="btnHtml">Change HTML</button>
<button id="btnAttr">Change Attribute</button>

<div id="output"></div>

<script>
$(function(){
  $("#btnText").click(function(){
    $("#name").text("Name: Rahul Sharma (Updated)");
    $(".roll").text("Roll No: CS001 - Modified");
    $("#branch").text("Branch: Computer Science");
    $("#output").text("Text changed using selectors #name, .roll, #branch");
  });
  $("#btnHtml").click(function(){
    $("#marks").html("<b>Marks: 85</b> (Improved)");
    $("#output").html("HTML content changed for #marks using <b>.html()</b>");
  });
  $("#btnAttr").click(function(){
    $("#profile").attr("href","https://example.com/student/CS001");
    $("#profile").text("View Profile (link updated)");
    $("#output").text("Attribute href changed to: " + $("#profile").attr("href"));
  });
});
</script>
</body>
</html>
```

**How it Works**

1. `btnText` → `.text()` on `#name`, `.roll`, `#branch`.
2. `btnHtml` → `.html()` on `#marks` injects `<b>`.
3. `btnAttr` → `.attr("href",...)` updates link and reads back.

**How to Run**

```bash
xdg-open index.html
# or: npx serve .
```

Click buttons and check `#output`.

---

<a id="exp02"></a>

## Experiment 02: Change Webpage Style using jQuery

**Aim**

a) Page with headings, paragraphs, buttons, student table.
b) Change background, font color, size, border via jQuery.
c) Add/remove CSS classes dynamically.

**File:** `index.html` (local file)

**Full Code**

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Exp2 - Change Style using jQuery</title>
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<style>
.highlight{background:yellow;border:2px solid red;padding:5px}
.card{border:1px solid #ccc;padding:10px;margin:10px 0}
</style>
</head>
<body>
<h1 id="heading">Student Information</h1>
<p id="para">This is a paragraph about students.</p>
<div id="box" class="card">Sample Box Content</div>

<table id="studentTable" border="1" cellpadding="8">
<tr><th>Roll</th><th>Name</th><th>Marks</th></tr>
<tr><td>CS01</td><td>Amit</td><td>85</td></tr>
<tr><td>CS02</td><td>Priya</td><td>72</td></tr>
</table>

<br>
<button id="btnBg">Change Background</button>
<button id="btnFont">Change Font</button>
<button id="btnAdd">Add Class</button>
<button id="btnRemove">Remove Class</button>

<script>
$(function(){
  $("#btnBg").click(function(){
    $("body").css("background-color","#e3f2fd");
    $("#heading").css({"color":"#0d47a1","font-size":"32px"});
    $("#para").css({"color":"#333","font-size":"18px"});
    $("#studentTable").css("border","3px solid #1976d2");
  });
  $("#btnFont").click(function(){
    $("#para").css({"font-family":"Courier New","font-size":"20px","color":"green"});
  });
  $("#btnAdd").click(function(){
    $("#box").addClass("highlight");
  });
  $("#btnRemove").click(function(){
    $("#box").removeClass("highlight");
  });
});
</script>
</body>
</html>
```

**How to Run**

```bash
xdg-open index.html
```

---

<a id="exp03"></a>

## Experiment 03: jQuery DOM Manipulation and Traversing

**Aim**

List of students — `append()`, `remove()`, `text()`, `parent()`, `children()`, `first()`, `last()`, `prev()`, `next()`.

**File:** `index.html` (local file)

**Full Code**

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Exp3 - DOM Manipulation & Traversing</title>
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<style>.selected{background:yellow}</style>
</head>
<body>
<h2>Student List</h2>
<ul id="studentList">
<li>Rahul</li>
<li class="selected">Priya</li>
<li>Amit</li>
</ul>

<input id="newName" placeholder="New student name">
<button id="btnAdd">Add (append)</button>
<button id="btnRemove">Remove Selected</button>
<button id="btnRename">Rename Selected</button>
<hr>
<button id="btnParent">Show Parent/Children</button>
<button id="btnFirstLast">First/Last</button>
<button id="btnSiblings">Prev/Next Sibling</button>

<div id="output"></div>

<script>
$(function(){
  $("#btnAdd").click(function(){
    let n=$("#newName").val()||"NewStudent";
    $("#studentList").append("<li>"+n+"</li>");
    $("#output").text("Added: "+n+" using append()");
  });
  $("#btnRemove").click(function(){
    $(".selected").remove();
    $("#output").text("Removed selected using remove()");
  });
  $("#btnRename").click(function(){
    $(".selected").text("Priya (Updated)");
    $("#output").text("Modified using text()");
  });
  $("#btnParent").click(function(){
    let parent=$(".selected").parent().prop("tagName");
    let children=$("#studentList").children().length;
    $("#output").html("Parent: "+parent+"<br>Children count: "+children+" using parent() & children()");
  });
  $("#btnFirstLast").click(function(){
    $("#output").html("First: "+$("#studentList li").first().text()+"<br>Last: "+$("#studentList li").last().text());
  });
  $("#btnSiblings").click(function(){
    let prev=$(".selected").prev().text()||"None";
    let next=$(".selected").next().text()||"None";
    $("#output").html("Prev: "+prev+"<br>Next: "+next+" using prev() & next()");
  });
  $(document).on("click","li",function(){
    $("li").removeClass("selected");
    $(this).addClass("selected");
  });
});
</script>
</body>
</html>
```

**How to Run**

```bash
xdg-open index.html
```

Click any `<li>` to change selection, then test buttons.

---

<a id="exp04"></a>

## Experiment 04: Event Handling using jQuery

**Aim**

a) click → background, b) mouseenter/leave message, c) keypress typed text, d) hide/show.

**File:** `index.html` (local file)

**Full Code**

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Exp4 - Event Handling</title>
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<style>#hoverBox{width:200px;height:60px;border:1px solid #999}</style>
</head>
<body>
<h2>Event Handling</h2>

<button id="btnColor">Change Background</button>

<div id="hoverBox">Hover Me</div>
<p id="hoverMsg"></p>

<input id="textInput" placeholder="Type something">
<p>Typed: <span id="typed"></span></p>

<div id="details">
<p><b>Name:</b> Amit</p><p><b>Roll:</b> CS01</p><p><b>Marks:</b> 85</p>
</div>
<button id="btnHide">Hide Details</button>
<button id="btnShow">Show Details</button>

<script>
$(function(){
  $("#btnColor").click(function(){
    $("body").css("background-color","#fff9c4");
  });
  $("#hoverBox").mouseenter(function(){
    $("#hoverMsg").text("Mouse entered the box").css("color","green");
  }).mouseleave(function(){
    $("#hoverMsg").text("Mouse left the box").css("color","red");
  });
  $("#textInput").on("keypress keyup",function(){
    $("#typed").text($(this).val());
  });
  $("#btnHide").click(function(){ $("#details").hide(); });
  $("#btnShow").click(function(){ $("#details").show(); });
});
</script>
</body>
</html>
```

**How to Run**

```bash
xdg-open index.html
```

---

<a id="exp05"></a>

## Experiment 05: Bootstrap — Registration Page & Information Table

**Aim**

- Registration: Name, Roll, DOB, Gender, Branch, Year, Email, Mobile, Address, Submit/Reset with grid, card, alert, forms, buttons.
- Table: Roll, Name, Branch, Marks, %, Result with `table-striped/bordered/hover`, contextual `table-success/danger`, 5 records, responsive.

**File 1:** `registration.html`

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Exp5 - Student Registration</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
<div class="container py-4">
<h2 class="text-center mb-4">Student Registration Form</h2>

<div class="alert alert-info">Please fill all mandatory fields</div>

<div class="card shadow">
<div class="card-body">
<form>
<div class="row g-3">
<div class="col-md-6"><label class="form-label">Student Name</label><input class="form-control" required></div>
<div class="col-md-6"><label class="form-label">Roll Number</label><input class="form-control" required></div>
<div class="col-md-6"><label class="form-label">Date of Birth</label><input type="date" class="form-control"></div>
<div class="col-md-6"><label class="form-label">Gender</label><select class="form-select"><option>Male</option><option>Female</option><option>Other</option></select></div>
<div class="col-md-6"><label class="form-label">Branch</label><select class="form-select"><option>CSE</option><option>IT</option><option>ECE</option></select></div>
<div class="col-md-6"><label class="form-label">Year</label><select class="form-select"><option>1</option><option>2</option><option>3</option><option>4</option></select></div>
<div class="col-md-6"><label class="form-label">Email</label><input type="email" class="form-control"></div>
<div class="col-md-6"><label class="form-label">Mobile Number</label><input class="form-control"></div>
<div class="col-12"><label class="form-label">Address</label><textarea class="form-control" rows="2"></textarea></div>
<div class="col-12 text-center">
<button type="submit" class="btn btn-primary">Submit</button>
<button type="reset" class="btn btn-secondary">Reset</button>
</div>
</div>
</form>
</div>
</div>
</div>
</body>
</html>
```

**File 2:** `table.html`

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Exp5 - Student Table</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
<div class="container py-4">
<h2 class="bg-primary text-white p-3 rounded text-center">Student Information</h2>
<div class="table-responsive">
<table class="table table-striped table-bordered table-hover">
<thead class="table-dark">
<tr><th>Roll No</th><th>Name</th><th>Branch</th><th>Marks</th><th>Percentage</th><th>Result</th></tr>
</thead>
<tbody>
<tr class="table-success"><td>CS01</td><td>Amit</td><td>CSE</td><td>85</td><td>85%</td><td>Pass</td></tr>
<tr class="table-success"><td>CS02</td><td>Priya</td><td>IT</td><td>78</td><td>78%</td><td>Pass</td></tr>
<tr class="table-danger"><td>CS03</td><td>Rahul</td><td>CSE</td><td>32</td><td>32%</td><td>Fail</td></tr>
<tr class="table-success"><td>CS04</td><td>Neha</td><td>ECE</td><td>91</td><td>91%</td><td>Pass</td></tr>
<tr class="table-danger"><td>CS05</td><td>Vikram</td><td>IT</td><td>28</td><td>28%</td><td>Fail</td></tr>
</tbody>
</table>
</div>
</div>
</body>
</html>
```

**How to Run**

```bash
xdg-open index.html  # open local file
xdg-open index.html  # open local file
```

Resize window to test `table-responsive`.

---

<a id="exp06"></a>

## Experiment 06: Data Binding and AngularJS Directives

**Aim**

Accept name/branch/marks, display via binding, total/avg via expression, Pass/Fail via `ng-if`.

**File:** `index.html` (local file)

**Full Code**

```html
<!DOCTYPE html>
<html ng-app="myApp">
<head>
<meta charset="UTF-8">
<title>Exp6 - Angular Data Binding</title>
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>
</head>
<body ng-controller="StudentCtrl">
<h2>Student Information</h2>
Name: <input ng-model="name" placeholder="Enter name"><br>
Branch: <input ng-model="branch" placeholder="Enter branch"><br>
Marks1: <input type="number" ng-model="m1">
Marks2: <input type="number" ng-model="m2">
Marks3: <input type="number" ng-model="m3">

<hr>
<p>Name: <span ng-bind="name"></span></p>
<p>Branch: {{branch}}</p>
<p>Total: {{ (m1||0)+(m2||0)+(m3||0) }}</p>
<p>Average: {{ ((m1||0)+(m2||0)+(m3||0)/3) | number:2 }}</p>
<!-- correct average expression -->
<p>Average (fixed): {{ ((m1||0)+(m2||0)+(m3||0))/3 | number:2 }}</p>
<p ng-if="((m1||0)+(m2||0)+(m3||0))/3 >=40">Pass</p>
<p ng-if="((m1||0)+(m2||0)+(m3||0))/3 <40 && (m1||m2||m3)">Fail</p>

<script>
angular.module("myApp",[]).controller("StudentCtrl",function($scope){
  $scope.name="Amit"; $scope.branch="CSE"; $scope.m1=80; $scope.m2=75; $scope.m3=85;
});
</script>
</body>
</html>
```

**How to Run**

```bash
xdg-open index.html  # open local file
```

Type in inputs to see live binding.

---

<a id="exp07"></a>

## Experiment 07: AngularJS Built-in Filters

**Aim**

`uppercase`, `lowercase`, `currency` with original vs filtered.

**File:** `index.html` (local file)

**Full Code**

```html
<!DOCTYPE html>
<html ng-app="myApp">
<head>
<meta charset="UTF-8">
<title>Exp7 - Angular Filters</title>
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>
</head>
<body ng-controller="Ctrl">
<h2>Built-in Filters</h2>
Name: <input ng-model="name">
Fee: <input type="number" ng-model="fee">

<table>
<tr><th>Type</th><th>Original</th><th>Filtered</th></tr>
<tr><td>Uppercase</td><td>{{name}}</td><td>{{name | uppercase}}</td></tr>
<tr><td>Lowercase</td><td>{{name}}</td><td>{{name | lowercase}}</td></tr>
<tr><td>Currency</td><td>{{fee}}</td><td>{{fee | currency}}</td></tr>
<tr><td>Currency (INR)</td><td>{{fee}}</td><td>{{fee | currency:"₹"}}</td></tr>
</table>

<script>
angular.module("myApp",[]).controller("Ctrl",function($scope){
  $scope.name="Rahul Sharma"; $scope.fee=50000;
});
</script>
</body>
</html>
```

**How to Run**

```bash
xdg-open index.html  # open local file
```

---

<a id="exp08"></a>

## Experiment 08: Student Registration Form using AngularJS

**Aim**

`ng-model` form, display below, mandatory check, valid/invalid messages.

**File:** `index.html` (local file)

**Full Code**

```html
<!DOCTYPE html>
<html ng-app="myApp">
<head>
<meta charset="UTF-8">
<title>Exp8 - Angular Registration Form</title>
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>
</head>
<body ng-controller="Ctrl">
<h2>Student Registration</h2>
<form name="regForm" novalidate>
Name*: <input name="name" ng-model="s.name" required><span class="error" ng-show="regForm.name.$touched && regForm.name.$invalid"> Required</span><br><br>
Roll*: <input name="roll" ng-model="s.roll" required><span class="error" ng-show="regForm.roll.$touched && regForm.roll.$invalid"> Required</span><br><br>
Email: <input type="email" name="email" ng-model="s.email"><span class="error" ng-show="regForm.email.$invalid && regForm.email.$dirty"> Invalid email</span><br><br>
Branch: <input ng-model="s.branch"><br><br>
</form>

<div ng-show="regForm.$valid">All mandatory fields entered - Valid</div>
<div ng-show="regForm.$invalid">Please fill mandatory fields - Invalid</div>

<hr>
<h3>Entered Details:</h3>
<p>Name: {{s.name}}</p>
<p>Roll: {{s.roll}}</p>
<p>Email: {{s.email}}</p>
<p>Branch: {{s.branch}}</p>

<script>
angular.module("myApp",[]).controller("Ctrl",function($scope){ $scope.s={}; });
</script>
</body>
</html>
```

**How to Run**

```bash
xdg-open index.html  # open local file
```

Leave mandatory empty to see Invalid, fill to see Valid.

---

<a id="exp09"></a>

## Experiment 09: AngularJS Service and Routing

**Aim**

Views Home, Student List, Student Details, Login with routing + service.

**File:** `index.html` (local file)

**Full Code**

```html
<!DOCTYPE html>
<html ng-app="myApp">
<head>
<meta charset="UTF-8">
<title>Exp9 - Service & Routing</title>
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular-route.min.js"></script>
</head>
<body>
<h2>Student Info App</h2>
<nav>
<a href="#!/">Home</a>
<a href="#!/students">Student List</a>
<a href="#!/student/1">Student Details</a>
<a href="#!/login">Login</a>
</nav>
<hr>
<div ng-view></div>

<script type="text/ng-template" id="home.html"><h3>Home</h3><p>Welcome to Student Information System</p></script>
<script type="text/ng-template" id="students.html">
<h3>Student List</h3>
<ul><li ng-repeat="s in students">{{s.roll}} - {{s.name}} ({{s.branch}})</li></ul>
</script>
<script type="text/ng-template" id="details.html"><h3>Student Details</h3><p ng-if="student">Roll: {{student.roll}}<br>Name: {{student.name}}<br>Branch: {{student.branch}}<br>Marks: {{student.marks}}</p><p ng-if="!student">Student not found</p></script>
<script type="text/ng-template" id="login.html"><h3>Login</h3><input placeholder="Username"><br><br><input type="password" placeholder="Password"><br><br><button>Login</button></script>

<script>
angular.module("myApp",["ngRoute"])
.service("studentService",function(){
  var data=[
    {id:1, roll:"CS01", name:"Amit", branch:"CSE", marks:85},
    {id:2, roll:"CS02", name:"Priya", branch:"IT", marks:78},
    {id:3, roll:"CS03", name:"Rahul", branch:"ECE", marks:92}
  ];
  this.getAll=function(){return data;};
  this.getById=function(id){return data.find(s=>s.id==id);};
})
.config(function($routeProvider){
  $routeProvider
  .when("/",{templateUrl:"home.html"})
  .when("/students",{templateUrl:"students.html", controller:"ListCtrl"})
  .when("/student/:id",{templateUrl:"details.html", controller:"DetailCtrl"})
  .when("/login",{templateUrl:"login.html"})
  .otherwise({redirectTo:"/"});
})
.controller("ListCtrl",function($scope, studentService){ $scope.students=studentService.getAll(); })
.controller("DetailCtrl",function($scope,$routeParams,studentService){ $scope.student=studentService.getById($routeParams.id); });
</script>
</body>
</html>
```

**How to Run**

```bash
xdg-open index.html  # open local file
```

Click nav links to test routing.

---

<a id="exp10"></a>

## Experiment 10: Node.js Built-in Modules

**Aim**

`fs`, `http`, `path`, `os`, `events` (welcome event).

**File:** `index.html` (local file)

```javascript
const fs=require('fs');
const http=require('http');
const path=require('path');
const os=require('os');
const EventEmitter=require('events');

// 1. fs
fs.writeFileSync('students.txt','Name: Amit, Roll: CS01, Marks:85\nName: Priya, Roll: CS02, Marks:78');
console.log('fs: File created');
console.log('fs: Content ->', fs.readFileSync('students.txt','utf8'));

// 3. path
const p='/home/user/docs/student.pdf';
console.log('path: filename =', path.basename(p));
console.log('path: ext =', path.extname(p));

// 4. os
console.log('os: platform =', os.platform(), 'arch =', os.arch(), 'totalMem =', Math.round(os.totalmem()/1024/1024)+' MB');

// 5. events
const emitter=new EventEmitter();
emitter.on('welcome',()=>console.log('events: welcome event triggered! Hello Student'));
emitter.emit('welcome');

// 2. http
const server=http.createServer((req,res)=>{
  res.writeHead(200,{'Content-Type':'text/html'});
  res.end('<h1>Welcome to Student App</h1><p>Node http server running</p>');
});
server.listen(3000,()=>console.log('http: Server running at http://localhost:3000'));
```

**How to Run**

```bash
node app.js
# Browse http://localhost:3000
# Ctrl+C to stop
```

---

<a id="exp11a"></a>

## Experiment 11a: Arithmetic Operations Module

**File 1:** `exp11a-node-calculator/calculator.js`

```javascript
exports.add=(a,b)=>a+b;
exports.sub=(a,b)=>a-b;
exports.mul=(a,b)=>a*b;
exports.div=(a,b)=>b!==0 ? a/b : 'Cannot divide by zero';
```

**File 2:** `exp11a-node-calculator/app.js`

```javascript
const calc=require('./calculator');
const a=20, b=5;
console.log(`a=${a}, b=${b}`);
console.log('Add:', calc.add(a,b));
console.log('Sub:', calc.sub(a,b));
console.log('Mul:', calc.mul(a,b));
console.log('Div:', calc.div(a,b));
```

**How to Run**

```bash
node app.js
# Add:25 Sub:15 Mul:100 Div:4
```

---

<a id="exp11b"></a>

## Experiment 11b: Student Details Module

**File 1:** `exp11b-node-student-module/student.js`

```javascript
exports.total=(m1,m2,m3)=>m1+m2+m3;
exports.percentage=(m1,m2,m3)=>(m1+m2+m3)/3;
exports.result=(m1,m2,m3)=> (m1+m2+m3)/3 >=40 ? 'Pass' : 'Fail';
```

**File 2:** `exp11b-node-student-module/app.js`

```javascript
const student=require('./student');
const name="Amit", m1=85, m2=78, m3=92;
console.log(`Name: ${name}, Marks: ${m1}, ${m2}, ${m3}`);
console.log('Total:', student.total(m1,m2,m3));
console.log('Percentage:', student.percentage(m1,m2,m3).toFixed(2)+'%');
console.log('Result:', student.result(m1,m2,m3));
```

**How to Run**

```bash
node app.js
# Total:255 Percentage:85.00% Result:Pass
```

---

<a id="exp12"></a>

## Experiment 12: Event Emitter and Streams

**File:** `index.html` (local file)

```javascript
const fs=require('fs');
const EventEmitter=require('events');

const emitter=new EventEmitter();

// large file simulation
const data=`CS01,Amit,CSE,85
CS02,Priya,IT,78
CS03,Rahul,ECE,92
CS04,Neha,CSE,65
CS05,Vikram,IT,45
`.repeat(20);
fs.writeFileSync('students.txt', data);

// a) custom event
emitter.on('studentAdded', (student)=>{
  console.log('Event: studentAdded ->', student);
});
emitter.emit('studentAdded', {roll:'CS06', name:'New Student'});

// c) readable stream
const stream=fs.createReadStream('students.txt', {encoding:'utf8', highWaterMark: 64});
console.log('--- Reading chunks via stream ---');
stream.on('data', chunk=>{
  console.log('Chunk:', chunk.slice(0,60).replace(/\n/g,' | ')+' ...');
});
stream.on('end', ()=>console.log('Stream ended'));
```

**How to Run**

```bash
node app.js
```

---

<a id="exp13"></a>

## Experiment 13: Node.js Web Server

**File:** `index.html` (local file)

```javascript
const http=require('http');

const students=[
  {roll:'CS01', name:'Amit', branch:'CSE', marks:85},
  {roll:'CS02', name:'Priya', branch:'IT', marks:78},
  {roll:'CS03', name:'Rahul', branch:'ECE', marks:92}
];

const server=http.createServer((req,res)=>{
  if(req.url==='/'){
    res.writeHead(200,{'Content-Type':'text/html'});
    res.end('<h1>Welcome to Student Information System</h1><p>Home Page</p>');
  } else if(req.url==='/students'){
    res.writeHead(200,{'Content-Type':'text/html'});
    let html='<h2>Student List</h2><ul>'+students.map(s=>`<li>${s.roll} - ${s.name}</li>`).join('')+'</ul>';
    res.end(html);
  } else if(req.url==='/student'){
    res.writeHead(200,{'Content-Type':'text/html'});
    let s=students[0];
    res.end(`<h2>Student Details</h2><p>Roll: ${s.roll}<br>Name: ${s.name}<br>Branch: ${s.branch}<br>Marks: ${s.marks}</p>`);
  } else if(req.url==='/api/student'){
    res.writeHead(200,{'Content-Type':'application/json'});
    res.end(JSON.stringify(students[0]));
  } else {
    res.writeHead(404,{'Content-Type':'text/plain'});
    res.end('Not Found');
  }
});

server.listen(3000,()=>console.log('Server at http://localhost:3000  try /, /students, /student, /api/student'));
```

**How to Run**

```bash
node server.js
curl http://localhost:3000/
curl http://localhost:3000/students
curl http://localhost:3000/api/student
```

---

<a id="exp14"></a>

## Experiment 14: Express.js Student Application

**Structure**

```
exp14-express-student-app/
  app.js
  package.json
  public/style.css
  public/script.js
  public/logo.png
  views/home.ejs
  views/students.ejs
  views/about.ejs
```

**File:** `exp14-express-student-app/package.json`

```json
{
  "name": "exp14-express-student-app",
  "version": "1.0.0",
  "main": "app.js",
  "dependencies": {
    "express": "^4.18.2",
    "ejs": "^3.1.9"
  }
}
```

**File:** `exp14-express-student-app/app.js`

```javascript
const express=require('express');
const path=require('path');
const app=express();

app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));

// middleware - logs request
app.use((req,res,next)=>{
  console.log(`${req.method} ${req.url}`);
  next();
});

let students=[
  {roll:'CS01', name:'Amit', branch:'CSE', marks:85},
  {roll:'CS02', name:'Priya', branch:'IT', marks:78}
];

app.get('/',(req,res)=> res.render('home'));
app.get('/about',(req,res)=> res.render('about'));
app.get('/students',(req,res)=> res.render('students',{students}));
app.post('/students',(req,res)=>{
  const {roll,name,branch,marks}=req.body;
  students.push({roll,name,branch,marks:Number(marks)});
  res.redirect('/students');
});

app.listen(3000,()=> console.log('Exp14 at http://localhost:3000'));
```

**File:** `exp14-express-student-app/public/style.css`

```css
body{font-family:Arial}
```

**File:** `exp14-express-student-app/public/script.js`

```javascript
console.log('Static JS loaded');
```

**File:** `exp14-express-student-app/views/home.ejs`

```html
<!DOCTYPE html>
<html>
<head><title>Home</title><link rel="stylesheet" href="/style.css"></head>
<body>
<h1>Home</h1><p>Welcome to Student App</p>
<nav><a href="/">Home</a> | <a href="/students">Students</a> | <a href="/about">About</a></nav>
<img src="/logo.png" alt="logo" width="20">
<script src="/script.js"></script>
</body></html>
```

**File:** `exp14-express-student-app/views/students.ejs`

```html
<!DOCTYPE html>
<html>
<head><title>Students</title><link rel="stylesheet" href="/style.css"></head>
<body>
<h1>Students</h1>
<nav><a href="/">Home</a> | <a href="/students">Students</a> | <a href="/about">About</a></nav>
<ul>
<% students.forEach(s=>{ %>
<li><%= s.roll %> - <%= s.name %> (<%= s.branch %>) - <%= s.marks %></li>
<% }) %>
</ul>
<form method="POST" action="/students">
<input name="roll" placeholder="Roll" required>
<input name="name" placeholder="Name" required>
<input name="branch" placeholder="Branch" required>
<input name="marks" type="number" placeholder="Marks" required>
<button type="submit">Add</button>
</form>
<script src="/script.js"></script>
</body></html>
```

**File:** `exp14-express-student-app/views/about.ejs`

```html
<!DOCTYPE html>
<html>
<head><title>About</title><link rel="stylesheet" href="/style.css"></head>
<body>
<h1>About</h1><p>Student Management System using Express.js</p>
<nav><a href="/">Home</a> | <a href="/students">Students</a> | <a href="/about">About</a></nav>
<script src="/script.js"></script>
</body></html>
```

**How to Run**

```bash
npm install
node app.js
# http://localhost:3000  http://localhost:3000/students  http://localhost:3000/style.css
```

---

<a id="exp15"></a>

## Experiment 15: MongoDB + Express.js

**File:** `exp15-mongo-express-crud/package.json`

```json
{
  "name": "exp15-mongo-crud",
  "version": "1.0.0",
  "main": "app.js",
  "dependencies": {
    "express": "^4.18.2",
    "mongodb": "^6.5.0"
  }
}
```

**File:** `exp15-mongo-express-crud/app.js`

```javascript
const express=require('express');
const {MongoClient}=require('mongodb');
const app=express();
app.use(express.json());

const URL='mongodb://localhost:27017';
const DB='studentDB';
let db, col;
let memory=[]; // fallback if Mongo not available

async function init(){
  try{
    const client=new MongoClient(URL);
    await client.connect();
    db=client.db(DB);
    try{
      await db.createCollection('students',{
        validator:{$jsonSchema:{
          bsonType:'object',
          required:['roll','name','branch','marks'],
          properties:{
            roll:{bsonType:'string'},
            name:{bsonType:'string'},
            branch:{bsonType:'string'},
            marks:{bsonType:'int', minimum:0, maximum:100}
          }
        }}
      });
    }catch(e){}
    col=db.collection('students');
    await col.createIndex({roll:1},{unique:true});
    console.log('Mongo connected');
  }catch(e){
    console.log('Mongo not available, using memory fallback:', e.message);
    col=null;
  }
}
init();

async function find(q){
  return col ? await col.find(q).toArray() : memory.filter(s=> Object.entries(q).every(([k,v])=>{
    if(v.$gt!==undefined) return s[k]>v.$gt;
    if(v.$in) return v.$in.includes(s[k]);
    return s[k]==v;
  }));
}

// a) Insert
app.post('/students', async(req,res)=>{
  const s=req.body;
  if(col) try{ await col.insertOne({...s, marks:parseInt(s.marks)}); return res.json({msg:'Inserted'});}catch(e){return res.status(400).json(e.message);}
  else { memory.push({...s, marks:parseInt(s.marks)}); res.json({msg:'Inserted (memory)'}); }
});

// b) Retrieve
app.get('/students', async(req,res)=> res.json(await find({})));
app.get('/students/branch/:branch', async(req,res)=> res.json(await find({branch:req.params.branch})));

// c) Update
app.put('/students/:roll', async(req,res)=>{
  if(col){ await col.updateOne({roll:req.params.roll},{$set:req.body}); res.json({msg:'Updated'});}
  else { let i=memory.findIndex(s=>s.roll==req.params.roll); if(i>=0) Object.assign(memory[i],req.body); res.json({msg:'Updated (memory)'});}
});

// d) Delete
app.delete('/students/:roll', async(req,res)=>{
  if(col){ await col.deleteOne({roll:req.params.roll}); res.json({msg:'Deleted'});}
  else { memory=memory.filter(s=>s.roll!=req.params.roll); res.json({msg:'Deleted (memory)'});}
});

// e) Filtering
app.get('/students/filter/gt70', async(req,res)=> res.json(await find({marks:{$gt:70}})));
app.get('/students/filter/cse-or-it', async(req,res)=> res.json(await find({branch:{$in:['CSE','IT']}})));

// f) Aggregation
app.get('/agg/avg', async(req,res)=>{
  if(col){ let r=await col.aggregate([{$group:{_id:null, avg:{$avg:'$marks'}}}]).toArray(); return res.json(r[0]||{avg:0});}
  let avg=memory.reduce((a,s)=>a+s.marks,0)/(memory.length||1); res.json({avg});
});
app.get('/agg/highest-per-branch', async(req,res)=>{
  if(col){ let r=await col.aggregate([{$group:{_id:'$branch', max:{$max:'$marks'}}}]).toArray(); return res.json(r);}
  let m={}; memory.forEach(s=> m[s.branch]=Math.max(m[s.branch]||0,s.marks)); res.json(Object.entries(m).map(([k,v])=>({_id:k,max:v})));
});
app.get('/agg/count-branch', async(req,res)=>{
  if(col){ let r=await col.aggregate([{$group:{_id:'$branch', count:{$sum:1}}}]).toArray(); return res.json(r);}
  let c={}; memory.forEach(s=> c[s.branch]=(c[s.branch]||0)+1); res.json(Object.entries(c).map(([k,v])=>({_id:k,count:v})));
});

app.listen(3000,()=> console.log('Exp15 at http://localhost:3000  (fallback memory if Mongo down)'));
```

**Routes**

| Task | Method & Path |
|------|---------------|
| Insert | `POST /students` |
| Retrieve all | `GET /students` |
| By branch | `GET /students/branch/CSE` |
| Update | `PUT /students/CS01` |
| Delete | `DELETE /students/CS01` |
| >70 | `GET /students/filter/gt70` |
| CSE or IT | `GET /students/filter/cse-or-it` |
| Avg | `GET /agg/avg` |
| Max per branch | `GET /agg/highest-per-branch` |
| Count branch-wise | `GET /agg/count-branch` |
| Validation | `$jsonSchema` |
| Index | `createIndex({roll:1},{unique:true})` |

**How to Run**

```bash
npm install
node app.js
curl -X POST -H "Content-Type: application/json" -d '{"roll":"CS01","name":"Amit","branch":"CSE","marks":85}' http://localhost:3000/students
curl http://localhost:3000/students
curl http://localhost:3000/students/filter/gt70
curl http://localhost:3000/agg/avg
curl -X DELETE http://localhost:3000/students/CS01
```

---

<a id="appendix"></a>

## Appendix — How to Run All

**Static (no install) — Exp 01-09**

```bash
xdg-open index.html  # open local file
xdg-open index.html  # open local file
xdg-open index.html  # open local file
# internet required for CDN
```

**Node (no install) — Exp 10-13**

```bash
node exp10-node-builtins/app.js
node exp11a-node-calculator/app.js
node exp11b-node-student-module/app.js
node exp12-node-events-streams/app.js
node exp13-node-webserver/server.js
# Ctrl+C after each to free port 3000
```

**Express/Mongo — Exp 14-15**

```bash
# http://localhost:3000
cd ../exp15-mongo-express-crud && npm install && node app.js
```

**Troubleshooting**

- CDN fails → check internet.
- Port 3000 in use → `lsof -i :3000` then `kill <pid>`.
- Mongo down → Exp15 uses memory fallback automatically.

---

*End of Record — All experiments minimal, runnable, full source included. Open in Markdown Preview for correct code colours.*
