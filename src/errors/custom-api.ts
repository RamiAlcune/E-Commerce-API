export class CustomAPIError extends Error {
  public statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name; // Set the error name to the class name
    this.statusCode = 500;
  }
}
