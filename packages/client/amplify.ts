export function getClientId(): string {
  return process.env.NODE_ENV === "production"
    ? "TODO"
    : "30r12k765sf0hmn6lt8g3srv6u";
}

export function getUserPoolId(): string {
  return process.env.NODE_ENV === "production" ? "TODO" : "us-east-1_z2oQ0gpqP";
}
