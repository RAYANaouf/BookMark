import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';

export function getUserIdFromRequest(req: Request): number | undefined {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            const jwtSecret = process.env.JWT_SECRET;
            if (!jwtSecret) {
                throw new Error('JWT_SECRET is not defined in environment variables');
            }
            const payload = jwt.verify(token, jwtSecret);
            if (typeof payload === 'object' && payload !== null && 'userId' in payload) {
                return (payload as { userId: number }).userId;
            }
            return undefined;
        } catch (error) {
            return undefined;
        }
    }
    return undefined;
}
