import { createModel } from 'hox';
import { useState } from 'react';

export const useStartDelay = createModel(() => useState(2));
