export const SITE_URL = 'https://aodonghu.dev';

export function absoluteUrl(pathname: string): string {
  return new URL(pathname, SITE_URL).toString();
}
