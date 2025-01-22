import Router from '@koa/router';

import { meetingAllGet } from '../meeting/api/meetingAllGet.js';
import { meetingStatsGet } from '../meeting/api/meetingStatsGet.js';

const meetingRoutes = new Router();

meetingRoutes.get('/', meetingAllGet);

meetingRoutes.get('/stats', meetingStatsGet);

export { meetingRoutes };
