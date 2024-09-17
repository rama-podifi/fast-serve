import { NextFunction, Request, Response } from 'express';
import { StandardError } from '../../shared/error';

export function errorHandler(err: any, _: Request, res: Response, next: NextFunction) {
    if ((err as StandardError).status_code) {
        console.error(err);
        return res.status(err.status_code).send({ error_code: err.error_code, message: err.message });
    }

    console.error(err);
    return res.status(500).send({ error_code: 'INTERNAL_ERROR', message: 'There is an error on our system' });
}
