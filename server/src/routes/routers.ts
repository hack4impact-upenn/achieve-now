/*
Edit this file to edit which routers are used by the server.
In order to add a router, please 
1) Import it into the file
2) Come up with a prefix for routes which direct to the router. 
The prefix should be of the form '/api/ROUTERNAME'
3) Add an entry with the prefix and imported router to prefixToRouterMap
*/
import { Router } from 'express';
import adminRouter from './admin.route';
import authRouter from './auth.route';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import thumbnailRouter from './thumbnail.route';
import blockRouter from './block.route';
import studentRouter from './student.route';
import userRouter from './user.route';
import resourceRouter from './resource.route';

const prefixToRouterMap: { prefix: string; router: Router }[] = [
  {
    prefix: '/api/auth',
    router: authRouter,
  },
  {
    prefix: '/api/admin',
    router: adminRouter,
  },
  {
    prefix: '/api/student',
    router: studentRouter,
  },
  {
    prefix: '/api/user',
    router: userRouter,
  },
  {
    prefix: '/api/resources',
    router: resourceRouter,
  },
  {
    prefix: '/api/block',
    router: blockRouter,
  },
];

export default prefixToRouterMap;
