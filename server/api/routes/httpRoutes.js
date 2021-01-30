import express from 'express';
import { requestRoom } from '../controllers/httpHandlers.js';

// initialize router
const router = express.Router();

/*
  request methods   --->   https://www.tutorialspoint.com/http/http_methods.htm
  1st param = extended url path
  2nd param = middlewares (optional)
  3rd param = request & response function (controller)
*/

router.get('/room/:id', requestRoom);

export default router;
