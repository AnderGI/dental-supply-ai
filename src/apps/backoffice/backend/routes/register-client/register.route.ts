import { NextFunction, Request, Response, Router } from 'express';
import { param, validationResult } from 'express-validator';
import httpStatus from 'http-status';

const requestSchema = [param('id').isUUID().withMessage('The id param must be a valid UUID')];

export const register = (router: Router): void => {
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
			return res.status(httpStatus.ACCEPTED).send();
		}
	);
};
