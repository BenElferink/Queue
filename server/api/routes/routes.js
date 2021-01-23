import express from 'express';
import { authenticateToken } from './../middleware/jsonWebToken.js';
import { newSession, requestSession, deleteSession, newUser } from '../controllers/controllers.js';

// initialize router
const router = express.Router();

/*
  request methods   --->   https://www.tutorialspoint.com/http/http_methods.htm
  1st param = extended url path
  2nd param = middlewares (optional)
  3rd param = request & response function (controller)
*/

router.post('/session/new', newSession);
router.get('/session/:id', requestSession);
router.delete('/session/:id', authenticateToken, deleteSession);
router.post('/session/:id/login', newUser);

export default router;
