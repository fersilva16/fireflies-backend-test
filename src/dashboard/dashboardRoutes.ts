import express from 'express';
import { dashboardGet } from './api/dashboardGet.js';

const router = express.Router();

router.get('/', dashboardGet);

export { router as dashboardRoutes };
