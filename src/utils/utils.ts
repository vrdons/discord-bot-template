export function checkFailed(err: Error) {
  return err.message.includes("fetch failed") || err.name.includes("fetch failed");
}
export function checkAccess(id: string) {
  let access = process.env.ACCESS_ID;
  if (!access) access = "";
  const list = access.split(",");
  return list.includes(id);
}
