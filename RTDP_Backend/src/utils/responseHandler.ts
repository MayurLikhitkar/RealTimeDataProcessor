interface ApiResponse<T = unknown> {
    success: boolean;
    responseMessage: string;
    data: T | null;
    errorMessage: string;
    error: unknown;
}


export const successResponse = <T = unknown>(
    success: boolean,
    responseMessage: string,
    data: T | null = null,
    errorMessage: string = '',
    error: unknown = null
): ApiResponse<T> => ({ success, responseMessage, errorMessage, error, data });