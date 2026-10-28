import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
export const protect=async(req,res,next)=>{try{const token=req.headers.authorization?.startsWith('Bearer ')?req.headers.authorization.slice(7):null;if(!token)return res.status(401).json({message:'Authentication required'});const payload=jwt.verify(token,process.env.JWT_SECRET);req.user=await User.findById(payload.id);if(!req.user||!req.user.active)return res.status(401).json({message:'Account unavailable'});next()}catch(e){res.status(401).json({message:'Invalid or expired token'})}};
export const allowRoles=(...roles)=>(req,res,next)=>roles.includes(req.user.role)?next():res.status(403).json({message:'You do not have permission to perform this action'});
