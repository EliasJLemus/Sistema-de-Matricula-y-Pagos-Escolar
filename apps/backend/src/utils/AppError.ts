export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public detail?: string;

  constructor(message: string, statusCode = 500, detail?: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.detail = detail;

    Error.captureStackTrace(this, this.constructor);
  }
}
