import express from 'express';

import { meetingAllGet } from '../meeting/api/meetingAllGet.js';
import { meetingStatsGet } from '../meeting/api/meetingStatsGet.js';

export const router = express.Router();

router.get('/', meetingAllGet);

router.get('/stats', meetingStatsGet);

export { router as meetingRoutes };
