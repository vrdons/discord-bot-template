export function checkFailed(err: Error) {
  return (
    err.message.includes("fetch failed") ||
    err.name.includes("fetch failed") ||
    err.message.includes("ShardingReadyTimeout") ||
    err.name.includes("ShardingReadyTimeout")
  );
}
