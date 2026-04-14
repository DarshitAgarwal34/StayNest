import ServiceModel from '../models/service.model.js';
import UserModel from '../models/user.model.js';
import { broadcastNotificationToAllUsers } from '../utils/notificationBroadcaster.js';

export const createService = async (req, res, next) => {
  try {
    const provider = await UserModel.findById(req.user.user_id);

    if (!provider || provider.role !== 'service_provider') {
      return res.status(403).json({
        success: false,
        message: 'Only service providers can create services.',
      });
    }

    const service = await ServiceModel.create({
      provider_id: req.user.user_id,
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      location: req.body.location,
    });

    const io = req.app.get('io');
    if (io) {
      await broadcastNotificationToAllUsers(io, {
        type: 'service',
        content: `A new service was listed: ${service.title}.`,
        excludeUserId: req.user.user_id,
      });
    }

    res.status(201).json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

export const getServiceById = async (req, res, next) => {
  try {
    const service = await ServiceModel.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllServices = async (req, res, next) => {
  try {
    const services = await ServiceModel.findAll();

    res.status(200).json({
      success: true,
      data: services,
    });
  } catch (error) {
    next(error);
  }
};

export const updateService = async (req, res, next) => {
  try {
    const existingService = await ServiceModel.findById(req.params.id);

    if (!existingService) {
      return res.status(404).json({
        success: false,
        message: 'Service not found.',
      });
    }

    const updatedService = await ServiceModel.update(req.params.id, req.body);

    res.status(200).json({
      success: true,
      data: updatedService,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    const deletedService = await ServiceModel.delete(req.params.id);

    if (!deletedService) {
      return res.status(404).json({
        success: false,
        message: 'Service not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully.',
      data: deletedService,
    });
  } catch (error) {
    next(error);
  }
};
