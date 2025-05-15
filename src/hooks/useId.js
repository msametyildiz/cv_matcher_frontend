import { useState } from 'react';

// Counter for generating unique IDs
let counter = 0;

// A simple implementation of useId for React versions before 18
export function useId(prefix = '') {
  const [id] = useState(() => {
    counter += 1;
    return `${prefix}${counter}`;
  });
  
  return id;
}
