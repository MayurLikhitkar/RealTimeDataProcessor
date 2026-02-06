import { Document, model, Schema } from 'mongoose';

export interface IDataLog extends Document {
    timestamp: Date;
    severity: 'INFO' | 'WARNING' | 'ERROR';
    message: string;
    source: string;
    metadata: Record<string, any>;
}

const dataLogSchema = new Schema<IDataLog>({
    timestamp: { type: Date, default: Date.now, index: -1 },
    severity: { type: String, enum: ['INFO', 'WARNING', 'ERROR'], required: true, index: 1 }, 
    message: { type: String, required: true },
    source: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed }
});

// Compound index for common query pattern
dataLogSchema.index({ severity: 1, timestamp: -1 });

const dataLogModel = model<IDataLog>('DataLog', dataLogSchema);

export default dataLogModel;