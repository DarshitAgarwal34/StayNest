import express from 'express';

import {
  createService,
  deleteService,
  getAllServices,
  getServiceById,
  updateService,
} from '../controllers/service.controller.js';

import { roleBasedAccess, verifyToken } from '../middlewares/auth.middleware.js';

import { validate } from '../validators/validate.middleware.js';
import {
  createServiceSchema,
  updateServiceSchema,
} from '../validators/service.validator.js';

const router = express.Router();

router.get('/', getAllServices);
router.get('/:id', getServiceById);

router.post(
  '/',
  verifyToken,
  roleBasedAccess('service_provider', 'admin'),
  validate(createServiceSchema),
  createService
);

router.put(
  '/:id',
  verifyToken,
  roleBasedAccess('service_provider', 'admin'),
  validate(updateServiceSchema),
  updateService
);

router.delete(
  '/:id',
  verifyToken,
  roleBasedAccess('service_provider', 'admin'),
  deleteService
);

export default router;