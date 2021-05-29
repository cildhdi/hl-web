import { createModel } from 'hox';
import { useLocalStorage } from 'react-use';

export const useFrameMod = createModel(() => useLocalStorage('frameModV2', 1));
