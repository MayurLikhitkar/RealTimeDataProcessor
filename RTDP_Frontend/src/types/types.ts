export interface ApiResponse {
    success: boolean;
    responseMessage: string;
    errorMessage: string;
    error: unknown;
}

export interface LogEntry {
    _id: string;
    timestamp: string;
    severity: 'INFO' | 'WARNING' | 'ERROR';
    message: string;
    source: string;
}

export interface LogResponse extends ApiResponse {
    count: number;
    data: LogEntry[];
}