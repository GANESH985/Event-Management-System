import express from 'express';
import {
  createEvent,
  getEvents,
  getEventsByProfile,
  updateEvent,
  getEventUpdateHistory,
} from '../controllers/eventController.js';

const router = express.Router();

router.post('/', createEvent);
router.get('/', getEvents);
router.get('/profile/:profileId', getEventsByProfile);
router.put('/:id', updateEvent);
router.get('/:id/history', getEventUpdateHistory);

export default router;