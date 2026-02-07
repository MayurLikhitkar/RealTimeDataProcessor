export interface LogEntry {
    _id: string;
    timestamp: string;
    severity: 'INFO' | 'WARNING' | 'ERROR';
    message: string;
    source: string;
}

export interface LogResponse {
    success: boolean;
    count: number;
    data: LogEntry[];
}