import { useState, useCallback } from 'react';

const useSelection = (initialSelection = []) => {
  const [selected, setSelected] = useState(initialSelection);

  const isSelected = useCallback((id) => {
    return selected.includes(id);
  }, [selected]);

  const toggle = useCallback((id) => {
    setSelected(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  }, []);

  const select = useCallback((ids) => {
    if (Array.isArray(ids)) {
      setSelected(prev => {
        const newSelection = [...prev];
        ids.forEach(id => {
          if (!newSelection.includes(id)) {
            newSelection.push(id);
          }
        });
        return newSelection;
      });
    } else {
      setSelected(prev => {
        if (prev.includes(ids)) {
          return prev;
        }
        return [...prev, ids];
      });
    }
  }, []);

  const unselect = useCallback((ids) => {
    if (Array.isArray(ids)) {
      setSelected(prev => prev.filter(id => !ids.includes(id)));
    } else {
      setSelected(prev => prev.filter(id => id !== ids));
    }
  }, []);

  const selectAll = useCallback((ids) => {
    setSelected(ids);
  }, []);

  const clear = useCallback(() => {
    setSelected([]);
  }, []);

  return {
    selected,
    isSelected,
    toggle,
    select,
    unselect,
    selectAll,
    clear
  };
};

export default useSelection;
