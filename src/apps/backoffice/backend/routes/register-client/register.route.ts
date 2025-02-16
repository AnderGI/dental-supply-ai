/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextFunction, Request, Response, Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import httpStatus from 'http-status';

import ClientPutController from '../../controllers/register-client/ClientPutController';
import ClientPutRequest from '../../controllers/register-client/ClientPutRequest';
import container from '../../dependency-injection';

const requestSchema = [
	param('id').isUUID().withMessage('The id param must be a valid UUID'),

	// Validar el campo 'name'
	body('name')
		.notEmpty()
		.withMessage('Name is required')
		.isString()
		.withMessage('Name must be a string')
		.isLength({ min: 1 })
		.withMessage('Name cannot be empty'),

	// Validar el campo 'email'
	body('email').isEmail().withMessage('Must be a valid email address').normalizeEmail(), // Para normalizar el correo (convertirlo en minúsculas)

	// Validar el campo 'phone' para que sea exactamente 9 dígitos
	body('phone')
		.notEmpty()
		.withMessage('Phone number is required')
		.isString()
		.withMessage('Phone number must be a string')
		.matches(/^\d{9}$/)
		.withMessage('Phone number must be exactly 9 digits'),

	// Validar el campo 'company'
	body('company')
		.notEmpty()
		.withMessage('Company name is required')
		.isString()
		.withMessage('Company must be a string'),

	// Validar el campo 'position'
	body('position')
		.notEmpty()
		.withMessage('Position is required')
		.isString()
		.withMessage('Position must be a string')
];
export const register = (router: Router): void => {
	const controller = container.get<ClientPutController>('apps.backoffice.ClientPutController');

	router.put(
		'/clients/:id',
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
			const { id } = req.params;
			const { name, email, phone, company, position } = req.body;
			controller.run({ id, name, email, phone, company, position } as ClientPutRequest, res);

			return;
		}
	);
};
