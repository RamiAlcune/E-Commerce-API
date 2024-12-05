const { StatusCodes } = require("http-status-codes");
const { CustomAPIError } = require("./custom-api");

export class BadRequestError extends CustomAPIError {
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}
