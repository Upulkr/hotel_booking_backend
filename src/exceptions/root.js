//meassage,status code,error coes,error

export class HttpException extends Error {
  message;
  errorCode;
  statuscode;
  errors;

  constructor(message, errorCode, statuscode, error) {
    super(message);
    this.message = message;
    this.errorCode = errorCode;
    this.statuscode = statuscode;
    this.errors = error;
  }
}

export const ErrorCode = {
  USER_NOT_FOUND: 1001,
  USER_ALREADY_EXISTS: 1002,
  INCORRECT_PASSWORD: 1003,
  UNPROCESSABLE_ENTITY:2001,
  INTERNAL_SERVER_ERROR:3001,
  BOOKING_ALREADY_EXISTS:4001,
};
