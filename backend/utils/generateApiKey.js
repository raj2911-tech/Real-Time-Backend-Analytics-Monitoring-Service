import crypto from "crypto";

export function generateApiKey() {
  const randomPart = crypto.randomBytes(8).toString("hex");
  return `sk_${randomPart}`;
}

