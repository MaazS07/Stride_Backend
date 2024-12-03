import Joi from 'joi';

export const partnerValidation = {
  create: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().required(),
    areas: Joi.array().items(Joi.string()).required(),
    shift: Joi.object({
      start: Joi.string().required(),
      end: Joi.string().required()
    }).required(),
    status: Joi.string().valid('active', 'inactive').optional(),
    currentLoad: Joi.number().default(0),
    metrics: Joi.object({
      rating: Joi.number().default(5.0),
      completedOrders: Joi.number().default(0),
      cancelledOrders: Joi.number().default(0)
    }).default()
  })
};

export const orderValidation = {
  create: Joi.object({
    customer: Joi.object({
      name: Joi.string().required(),
      phone: Joi.string().required(),
      address: Joi.string().required(),
    }).required(),
    area: Joi.string().required(),
    items: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        quantity: Joi.number().min(1).required(),
        price: Joi.number().min(0).required(),
      })
    ).required(),
    scheduledFor: Joi.string().isoDate().required(),
  }),
};