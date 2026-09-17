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
