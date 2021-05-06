import { createModel } from 'hox';
import { useState } from 'react';

export const useServerless = createModel(() => useState(true));
