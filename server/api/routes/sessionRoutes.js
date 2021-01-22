import express from 'express';
import { newSession } from './../controllers/sessionControllers.js';

// initialize router
const router = express.Router();

/*
  request methods   --->   https://www.tutorialspoint.com/http/http_methods.htm
  1st param = extended url path
  2nd param = middlewares (optional)
  3rd param = request & response function (controller)
*/

// current method: POST
// current path: http://localhost:8080/session/new
router.post('/new', newSession);

export default router;
