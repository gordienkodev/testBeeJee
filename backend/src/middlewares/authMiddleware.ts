import { Request, Response, NextFunction } from 'express';

export const checkAuth = (req: Request, res: Response, next: NextFunction): void => {
    if (req.cookies.token !== 'admin-token') {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    next();
};