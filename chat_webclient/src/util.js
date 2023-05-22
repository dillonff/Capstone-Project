import React from 'react';


export function useMountedEffect(func, deps) {
    React.useEffect(_ => {
        let mounted = true;
        const getMounted = _ => mounted;
        const cleanup = func(getMounted);
        return _ => {
            mounted = false;
            if (cleanup) {
                cleanup();
            }
        }
    }, deps);
}

export function findById(id, items, defaultValue) {
    for (const item of items) {
        if (item.id === id) {
            return item;
        }
    }
    return defaultValue;
} 
