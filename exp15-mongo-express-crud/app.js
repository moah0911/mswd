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
    // validation
    try{
      await db.createCollection('students',{
        validator:{$jsonSchema:{bsonType:'object', required:['roll','name','branch','marks'],
          properties:{roll:{bsonType:'string'}, name:{bsonType:'string'}, branch:{bsonType:'string'}, marks:{bsonType:'int', minimum:0, maximum:100}}}}
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

// helpers
async function find(q){ return col ? await col.find(q).toArray() : memory.filter(s=> Object.entries(q).every(([k,v])=>{
  if(v.$gt!==undefined) return s[k]>v.$gt;
  if(v.$in) return v.$in.includes(s[k]);
  return s[k]==v;
}));}

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
