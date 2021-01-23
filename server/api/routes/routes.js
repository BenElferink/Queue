import express from 'express';
import { authenticateToken } from './../middleware/jsonWebToken.js';
import {
  newSession,
  newUser,
  requestSession,
  deleteSession,
  addToQueue,
  moveToHistory,
} from '../controllers/controllers.js';

// initialize router
const router = express.Router();

/*
  request methods   --->   https://www.tutorialspoint.com/http/http_methods.htm
  1st param = extended url path
  2nd param = middlewares (optional)
  3rd param = request & response function (controller)
*/

// host routes
router.post('/session/new', newSession);
router.delete('/session/:id', authenticateToken, deleteSession);
router.put('/session/:id/quest/:qid', authenticateToken, moveToHistory);

// user routes
router.get('/session/:id', requestSession);
router.post('/session/:id/login', newUser);
router.post('/session/:id/quest', authenticateToken, addToQueue);

export default router;
