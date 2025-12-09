const { body } = require('express-validator');
const validateRequest = require('../middlewares/validatorMeddleware');

// exports.registerValidator = [
//     body('fullname')
//         .trim()
//         .notEmpty().withMessage('Full name is required')
//         .isLength({ min: 3 }).withMessage('Full name must be at least 3 characters long'),

//     body('email')
//         .trim()
//         .notEmpty().withMessage('Email is required')
//         .isEmail().withMessage('Please include a valid email'),

//     body('password')
//         .notEmpty().withMessage('Password is required')
//         .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

//     body('telephone')
//         .trim()
//         .notEmpty().withMessage('Telephone is required'),

//     body('role')
//         .optional()
//         .isIn(['admin', 'chauffeur']).withMessage('Invalid role'),

//     validateRequest
// ];

exports.loginValidator = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please include a valid email'),

    body('password')
        .notEmpty().withMessage('Password is required'),

    validateRequest
];
