// src/routes/activities.js

import express from 'express';
import { getRecentActivities } from '../controllers/activitiesController.js';

const router = express.Router();

router.get('/recent', getRecentActivities);

export default router;
