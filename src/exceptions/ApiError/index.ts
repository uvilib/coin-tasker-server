export enum HttpCode {
  success = 200,
  badRequest = 400,
  unauthorized = 401,
  notFound = 404,
  internalServerError = 500,
}

type ApiErrorArgs = {
  httpCode: HttpCode;
  description?: string;
  name?: string;
};

export type ApiErrorRes = {
  httpCode: HttpCode;
  description?: string;
};

export class ApiError {
  public readonly httpCode;
  public readonly description;

  constructor({
    httpCode,
    description,
  }: {
    httpCode: number;
    description?: string | string[];
  }) {
    this.httpCode = httpCode;
    this.description = description;
  }
}
