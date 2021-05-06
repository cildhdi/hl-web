import { createModel } from 'hox';
import { useLocalStorage } from 'react-use';

export const useServer = createModel(() =>
  useLocalStorage('useServer', '106.14.71.50:5000')
);
