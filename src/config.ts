export enum RoutePath {
  index = '/',
  tests = '/tests/:id',
}

export const SERVER = document.location.host.includes('localhost')
  ? 'http://localhost:5000'
  : 'https://hl.ketra.fun:6290';
