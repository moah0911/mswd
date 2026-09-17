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
