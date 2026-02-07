import { Request, Response, NextFunction } from 'express';
import { RATE_LIMIT_MAX_REQUESTS, RATE_LIMIT_WINDOW_MS } from '../config/envConfig';
import { HttpStatus } from '../utils/constants';

interface ClientRecord {
    requestCount: number;
    startTime: number;
}

// In-memory store
const rateLimitStore = new Map<string, ClientRecord>();

const WINDOW_MS = Number(RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000;
const MAX_REQUESTS = Number(RATE_LIMIT_MAX_REQUESTS) || 100;

export const customRateLimiter = (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const currentTime = Date.now();

    // Get existing record for this IP
    const record = rateLimitStore.get(ip);

    if (!record) {
        // New IP
        rateLimitStore.set(ip, { requestCount: 1, startTime: currentTime });
        return next();
    }

    // Check if window has passed
    if (currentTime - record.startTime > WINDOW_MS) {
        // Reset window
        record.startTime = currentTime;
        record.requestCount = 1;
        rateLimitStore.set(ip, record);
        return next();
    }

    // Within window, check limit
    if (record.requestCount >= MAX_REQUESTS) {
        return res.status(HttpStatus.TOO_MANY_REQUESTS).json({
            success: false,
            responseMessage: 'Too many requests, please try again later.',
            retryAfter: Math.ceil((record.startTime + WINDOW_MS - currentTime) / 1000)
        });
    }

    // Increment count
    record.requestCount++;
    rateLimitStore.set(ip, record);
    next();
};

// Periodic cleanup to prevent memory leaks (runs every 10 mins)
setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of rateLimitStore.entries()) {
        if (now - record.startTime > WINDOW_MS) {
            rateLimitStore.delete(ip);
        }
    }
}, 600000);