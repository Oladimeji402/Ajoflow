/** Fail-closed auth for internal cron routes. Requires CRON_SECRET always. */
export function isCronAuthorized(request: Request): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return false;

  const authorization = request.headers.get("authorization");
  return authorization === `Bearer ${cronSecret}`;
}
