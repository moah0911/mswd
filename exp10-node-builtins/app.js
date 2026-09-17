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
