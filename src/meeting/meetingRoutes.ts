import Router from '@koa/router';

import { meetingPost } from './api/meetingPost.js';
import { meetingAllGet } from '../meeting/api/meetingAllGet.js';
import { meetingStatsGet } from '../meeting/api/meetingStatsGet.js';

const meetingRoutes = new Router();

meetingRoutes.get('/', meetingAllGet);

meetingRoutes.post('/', meetingPost);

meetingRoutes.get('/stats', meetingStatsGet);

export { meetingRoutes };
