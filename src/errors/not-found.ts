const { StatusCodes } = require("http-status-codes");
const { CustomAPIError } = require("./custom-api");

export class NotFoundError extends CustomAPIError {
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}
