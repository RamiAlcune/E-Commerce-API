// Create a global types file, e.g., `types.d.ts`
import "express";
import { UserReqI } from "./models/UsersModel";

declare module "express" {
  interface Request {
    user?: ReqUserI;
    // Add other user-related fields as necessary
  }
}
