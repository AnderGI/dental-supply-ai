/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import console from 'console';
import { NextFunction, Request, Response, Router } from 'express';
import { body, validationResult } from 'express-validator';
import httpStatus from 'http-status';

import BusinessPostController from '../../../controllers/business/scrape-google-maps/BusinessPostController';
import BusinessPostRequest from '../../../controllers/business/scrape-google-maps/BusinessPostRequest';
import container from '../../../dependency-injection';

const requestSchema = [
	// Validar el campo 'name'
	body('industry')
		.notEmpty()
		.withMessage('Industry is required')
		.isString()
		.withMessage('Industry must be a string')
		.isLength({ min: 1 })
		.withMessage('Industry cannot be empty'),

	// Validar el campo 'email'
	body('gmail').isEmail().withMessage('Must be a valid email address').normalizeEmail(), // Para normalizar el correo (convertirlo en minúsculas)

	// Validar el campo 'company'
	body('city')
		.notEmpty()
		.withMessage('City is required')
		.isString()
		.withMessage('City must be a string')
		.isLength({ min: 1 })
		.withMessage('City cannot be empty')
];
export const register = (router: Router): void => {
	const controller = container.get<BusinessPostController>(
		'apps.backoffice.BusinessPostController'
	);

	router.post(
		'/businesses',
		requestSchema,
		(req: Request, res: Response, next: NextFunction) => {
			const result = validationResult(req);
			if (result.isEmpty()) {
				next();

				return;
			}

			const errors = result.array().map(_ => {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				return { msg: _.msg, param: _.param };
			});

			return res.status(httpStatus.BAD_REQUEST).json({ errors });
		},
		(req: Request, res: Response) => {
			console.log('llega al router');
			const { industry, gmail, city } = req.body;
			controller.run({ industry, gmail, city } as BusinessPostRequest, res);

			return;
		}
	);
};
