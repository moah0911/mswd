const student=require('./student');
const name="Amit", m1=85, m2=78, m3=92;
console.log(`Name: ${name}, Marks: ${m1}, ${m2}, ${m3}`);
console.log('Total:', student.total(m1,m2,m3));
console.log('Percentage:', student.percentage(m1,m2,m3).toFixed(2)+'%');
console.log('Result:', student.result(m1,m2,m3));
