import { Request, Response } from 'express';

export const login = (req: Request, res: Response): void => {
    const { username, password } = req.body;

    if (username !== 'admin' || password !== '123') {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
    }

    res.cookie('token', 'admin-token', {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 3600000
    });

    res.json({ success: true });
};

export const logout = (_req: Request, res: Response): void => {
    res.clearCookie('token');
    res.json({ success: true });
};

export const getMe = (req: Request, res: Response): void => {
    const token = req.cookies?.token;
    res.json({ isAdmin: token === 'admin-token' });
};