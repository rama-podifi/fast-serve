export class StandardError extends Error {
    public status_code: number;

    public error_code: string;

    public lastError?: Record<string, unknown> | null;

    constructor(statusCode: number, errorCode: string, message: string, lastError?: Record<string, unknown> | null) {
        super(message);
        this.status_code = statusCode;
        this.name = this.constructor.name;
        this.error_code = errorCode;
        this.lastError = lastError;
    }
}

export enum EErrorCodes {
    NOT_FOUND = 'NOT_FOUND',
    BAD_REQUEST = 'BAD_REQUEST'
}
