import { Request, Response } from 'express';
import dataLogModel from '../models/dataLogModel';
import { HttpStatus } from '../utils/constants';


// @desc    Get all data logs (with limit for initial load)
// @route   GET /api/dataLog
export const getDataLogs = async (req: Request, res: Response) => {
    // Retrieve last 5000 records sorted by newest first
    const logs = await dataLogModel.find().sort({ timestamp: -1 }).limit(5000);
    return res.status(HttpStatus.OK).json({ message: 'Data logs retrieved successfully', success: true, count: logs.length, data: logs });
};


// @desc    Seed Data (To generate 5000+ records for the test)
// @route   POST /api/dataLog/seed
export const seedDataLogs = async (req: Request, res: Response) => {
    const logs = [];
    const severities = ['INFO', 'WARNING', 'ERROR'];
    const sources = ['Auth Service', 'Payment Gateway', 'AI Engine', 'Database'];

    for (let i = 0; i < 5000; i++) {
        logs.push({
            severity: severities[Math.floor(Math.random() * severities.length)],
            source: sources[Math.floor(Math.random() * sources.length)],
            message: `System event log #${i + 1} generated for testing virtualization.`,
            timestamp: new Date(Date.now() - i * 10000) // Spread out over time
        });
    }

    await dataLogModel.deleteMany({}); // Clear old
    await dataLogModel.insertMany(logs);

    return res.status(HttpStatus.CREATED).json({ success: true, message: '5000 logs seeded successfully' });
};