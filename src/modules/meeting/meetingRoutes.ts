import Router from '@koa/router';

import { meetingGet } from './api/meetingGet';
import { meetingPost } from './api/meetingPost';
import { meetingSummarizePost } from './api/meetingSummarizePost';
import { meetingTranscriptPut } from './api/meetingTranscriptPut';
import { meetingAllGet } from '../meeting/api/meetingAllGet';
import { meetingStatsGet } from '../meeting/api/meetingStatsGet';

const meetingRoutes = new Router();

meetingRoutes.get('/', meetingAllGet);

meetingRoutes.post('/', meetingPost);

meetingRoutes.get('/stats', meetingStatsGet);

meetingRoutes.get('/:id', meetingGet);

meetingRoutes.put('/:id/transcript', meetingTranscriptPut);

meetingRoutes.post('/:id/summarize', meetingSummarizePost);

export { meetingRoutes };
