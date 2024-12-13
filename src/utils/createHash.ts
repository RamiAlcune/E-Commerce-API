import crypto from "crypto";
import { string } from "joi";

export const hashString = (text: string) => crypto.createHash("md5").update(text).digest("hex");
