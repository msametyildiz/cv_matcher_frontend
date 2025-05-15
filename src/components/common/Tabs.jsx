import React, { useState } from 'react';
import { useId } from '../../hooks/useId';

export function TabGroup({ children, defaultIndex = 0 }) {
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex);
  const id = useId('tabs-');
  
  // Find the list and panels from children
  let list = null;
  let panels = null;
  
  React.Children.forEach(children, child => {
    if (child.type === TabList) {
      list = React.cloneElement(child, { 
        selectedIndex, 
        onChange: setSelectedIndex,
        id 
      });
    } else if (child.type === TabPanels) {
      panels = React.cloneElement(child, { 
        selectedIndex,
        id 
      });
    }
  });
  
  return (
    <div className="tab-group">
      {list}
      {panels}
    </div>
  );
}

export function TabList({ children, selectedIndex, onChange, id }) {
  return (
    <div className="flex space-x-2 rounded-xl bg-blue-50 p-1" role="tablist">
      {React.Children.map(children, (child, index) => {
        return React.cloneElement(child, {
          selected: index === selectedIndex,
          onClick: () => onChange(index),
          id: `${id}-tab-${index}`,
          controls: `${id}-panel-${index}`,
          index
        });
      })}
    </div>
  );
}

export function Tab({ children, selected, onClick, id, controls, index }) {
  return (
    <button
      id={id}
      role="tab"
      aria-selected={selected}
      aria-controls={controls}
      tabIndex={selected ? 0 : -1}
      onClick={onClick}
      className={`w-full rounded-lg py-2 px-4 text-sm font-medium leading-5 ${
        selected
          ? 'bg-white shadow text-blue-700'
          : 'text-blue-600 hover:bg-white/[0.12] hover:text-blue-700'
      }`}
    >
      {children}
    </button>
  );
}

export function TabPanels({ children, selectedIndex, id }) {
  return (
    <div className="mt-2">
      {React.Children.map(children, (child, index) => {
        return React.cloneElement(child, {
          selected: index === selectedIndex,
          id: `${id}-panel-${index}`,
          labelledby: `${id}-tab-${index}`,
          index
        });
      })}
    </div>
  );
}

export function TabPanel({ children, selected, id, labelledby }) {
  if (!selected) return null;
  
  return (
    <div
      id={id}
      role="tabpanel"
      aria-labelledby={labelledby}
      tabIndex={0}
    >
      {children}
    </div>
  );
}
