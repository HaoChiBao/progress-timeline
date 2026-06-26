export function getLiveblocksSecretKey() {
  const key = process.env.LIVEBLOCKS_SECRET_KEY;
  if (!key) {
    throw new Error("Missing LIVEBLOCKS_SECRET_KEY environment variable.");
  }
  return key;
}
