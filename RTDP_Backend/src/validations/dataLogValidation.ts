import { body } from 'express-validator';
import validate from './validate';

export const registerValidation = [
    body('severity').isIn(['INFO', 'WARNING', 'ERROR']).withMessage('Invalid severity level'),
    body('message').isString().notEmpty().trim().escape(),
    body('source').isString().notEmpty().trim().escape(),

    validate
];