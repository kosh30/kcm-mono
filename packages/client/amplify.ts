export function getClientId(): string {
  return process.env.NODE_ENV === "production"
    ? "7reeltkn62gg4kt3elv5gapuof"
    : "30r12k765sf0hmn6lt8g3srv6u";
}

export function getUserPoolId(): string {
  return process.env.NODE_ENV === "production"
    ? "us-east-1_IIegZQY4q"
    : "us-east-1_z2oQ0gpqP";
}
