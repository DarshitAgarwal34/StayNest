import express from 'express';

import { getAdminOverview } from '../controllers/admin.controller.js';
import { roleBasedAccess, verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(verifyToken, roleBasedAccess('admin'));

router.get('/overview', getAdminOverview);

export default router;
