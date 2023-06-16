const mapping: Record<string, string> = {
  companies: 'company',
  'content-items': 'content_item',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
