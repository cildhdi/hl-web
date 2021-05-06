import { createModel } from 'hox';
import { useLocalStorage } from 'react-use';

export const useServerless = createModel(() =>
  useLocalStorage('useServerless', false)
);
