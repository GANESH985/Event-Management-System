import express from 'express';
import {
  createProfile,
  getProfiles,
  getProfile,
  updateProfile,
} from '../controllers/profileController.js';

const router = express.Router();

router.post('/', createProfile);
router.get('/', getProfiles);
router.get('/:id', getProfile);
router.put('/:id', updateProfile);

export default router;