const { body } = require('express-validator');
const validateRequest = require('../middlewares/validatorMeddleware');

exports.createVehicleValidator = [
    body('registrationNumber')
        .trim()
        .notEmpty().withMessage('Registration number is required')
        .toUpperCase(),

    body('type')
        .trim()
        .notEmpty().withMessage('Type is required')
        .isIn(['truck', 'trailer']).withMessage('Type must be truck or trailer'),

    body('brand')
        .trim()
        .notEmpty().withMessage('Brand is required'),

    body('model')
        .trim()
        .notEmpty().withMessage('Model is required'),

    body('mileage')
        .optional()
        .isNumeric().withMessage('Mileage must be a number'),

    body('status')
        .optional()
        .isIn(['available', 'in_transit', 'maintenance', 'out_of_service']).withMessage('Invalid status'),

    validateRequest
];

exports.updateVehicleValidator = [
    body('registrationNumber')
        .optional()
        .trim()
        .toUpperCase(),

    body('type')
        .optional()
        .trim()
        .isIn(['truck', 'trailer']).withMessage('Type must be truck or trailer'),

    body('mileage')
        .optional()
        .isNumeric().withMessage('Mileage must be a number'),

    body('status')
        .optional()
        .isIn(['available', 'in_transit', 'maintenance', 'out_of_service']).withMessage('Invalid status'),

    validateRequest
];
