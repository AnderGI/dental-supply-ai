import { Request, Response, Router } from 'express';
import httpStatus from 'http-status';

export const register = (router: Router): void => {
	router.put('/clients/:id', (req: Request, res: Response) => {
		return res.status(httpStatus.ACCEPTED).send();
	});
};
