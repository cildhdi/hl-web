import { createModel } from 'hox';
import { useLocalStorage } from 'react-use';

export const useOldApi = createModel(() => useLocalStorage('useOldApi', false));
