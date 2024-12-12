import { StatusCodes } from "http-status-codes";
import { CustomAPIError } from "../errors/custom-api";
export class UnauthenticatedError extends CustomAPIError {
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}
