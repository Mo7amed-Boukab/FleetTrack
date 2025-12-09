const { body } = require('express-validator');
const validateRequest = require('../middlewares/validatorMeddleware');

exports.createTripValidator = [
    body('driver')
        .notEmpty().withMessage('Driver is required')
        .isMongoId().withMessage('Invalid driver ID'),

    body('truck')
        .notEmpty().withMessage('Truck is required')
        .isMongoId().withMessage('Invalid truck ID'),

    body('trailer')
        .optional()
        .isMongoId().withMessage('Invalid trailer ID'),

    body('departure.location')
        .notEmpty().withMessage('Departure location is required'),

    body('departure.date')
        .notEmpty().withMessage('Departure date is required')
        .isISO8601().toDate().withMessage('Invalid departure date'),

    body('arrival.location')
        .notEmpty().withMessage('Arrival location is required'),

    validateRequest
];

exports.updateTripValidator = [
    body('status')
        .optional()
        .isIn(['planned', 'in_progress', 'completed', 'cancelled']).withMessage('Invalid status'),

    body('fuelConsumed')
        .optional()
        .isNumeric().withMessage('Fuel consumed must be a number'),

    body('departure.mileage')
        .optional()
        .isNumeric().withMessage('Departure mileage must be a number'),

    body('arrival.mileage')
        .optional()
        .isNumeric().withMessage('Arrival mileage must be a number'),

    body('arrival.date')
        .optional()
        .isISO8601().toDate().withMessage('Invalid arrival date'),

    validateRequest
];
