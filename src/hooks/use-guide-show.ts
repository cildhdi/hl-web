import { createModel } from 'hox';
import { useState } from 'react';

export const useGuideShow = createModel(() => useState(false));
