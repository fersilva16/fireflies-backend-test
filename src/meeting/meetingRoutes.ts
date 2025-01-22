import Router from '@koa/router';

import { meetingGet } from './api/meetingGet.js';
import { meetingPost } from './api/meetingPost.js';
import { meetingTranscriptPut } from './api/meetingTranscriptPut.js';
import { meetingAllGet } from '../meeting/api/meetingAllGet.js';
import { meetingStatsGet } from '../meeting/api/meetingStatsGet.js';

const meetingRoutes = new Router();

meetingRoutes.get('/', meetingAllGet);

meetingRoutes.post('/', meetingPost);

meetingRoutes.get('/:id', meetingGet);

meetingRoutes.put('/:id/transcript', meetingTranscriptPut);

meetingRoutes.get('/stats', meetingStatsGet);

export { meetingRoutes };
