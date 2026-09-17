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
