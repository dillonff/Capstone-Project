import React from 'react';

import {
  GlobalModalsContext
} from '../AppContext';

export function GlobalModals({
  globalModals
}) {
  console.warn(globalModals);
  return <div>
    {globalModals}
  </div>
}

