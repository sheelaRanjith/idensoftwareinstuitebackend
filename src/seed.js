import dotenv from 'dotenv';import {fileURLToPath} from 'node:url';import {dirname,resolve} from 'node:path';
import {connectDB} from './config/db.js';import {User,Student,Trainer,Course,Batch,FeePayment,Attendance} from './models/index.js';
dotenv.config({path:resolve(dirname(fileURLToPath(import.meta.url)),'../.env')});
await connectDB();
if(!process.env.ADMIN_PASSWORD||process.env.ADMIN_PASSWORD.length<12)throw new Error('Set ADMIN_PASSWORD to a value of at least 12 characters in .env');
if(await User.exists({role:'admin'})){console.log('Seed data already exists; skipping to preserve existing institute records.');process.exit(0)}
const admin=await User.create({name:process.env.ADMIN_NAME||'Institute Admin',email:process.env.ADMIN_EMAIL||'admin@example.com',password:process.env.ADMIN_PASSWORD,role:'admin'});
const [u1,u2,t1]=await Promise.all([User.create({name:'Aarav Sharma',email:'aarav@example.com',password:'Student123!',phone:'+91 98765 43210',role:'student'}),User.create({name:'Maya Patel',email:'maya@example.com',password:'Student123!',phone:'+91 98765 43211',role:'student'}),User.create({name:'Rohan Mehta',email:'rohan@example.com',password:'Trainer123!',role:'trainer'})]);
const trainer=await Trainer.create({user:t1._id,specialization:'Full Stack Development'});
const [web,data]=await Promise.all([Course.create({name:'MERN Stack Development',description:'Build production-ready web applications with MongoDB, Express, React and Node.js.',duration:'24 weeks',fee:48000}),Course.create({name:'Data Analytics with Python',description:'Practical analytics, Python and dashboard foundations.',duration:'16 weeks',fee:32000})]);
const batch=await Batch.create({name:'MERN — Cohort 08',course:web._id,trainer:trainer._id,startDate:new Date('2026-10-01'),endDate:new Date('2027-03-18'),schedule:'Mon, Wed, Fri · 6:30 PM',status:'active'});trainer.batches.push(batch._id);await trainer.save();
const [s1,s2]=await Promise.all([Student.create({user:u1._id,course:web._id,batch:batch._id,totalFee:web.fee,enrollmentDate:new Date('2026-10-05')}),Student.create({user:u2._id,course:data._id,totalFee:data.fee,enrollmentDate:new Date('2026-10-12')})]);batch.students=[s1._id];await batch.save();
await FeePayment.create({student:s1._id,amount:18000,method:'upi',recordedBy:admin._id,notes:'First installment'});await FeePayment.create({student:s2._id,amount:32000,method:'bank transfer',recordedBy:admin._id});
for(let i=1;i<=8;i++)await Attendance.create({student:s1._id,batch:batch._id,date:new Date(Date.UTC(2026,9,i*2)),status:i===4?'absent':'present',markedBy:admin._id});
console.log('Seed complete. Admin:',process.env.ADMIN_EMAIL,'Demo student: aarav@example.com / Student123!');process.exit(0);
