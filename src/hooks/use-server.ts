import { createModel } from 'hox';
import { useLocalStorage } from 'react-use';

export const useServer = createModel(() =>
  useLocalStorage('useServer', 'http://106.14.71.50:5000')
);
