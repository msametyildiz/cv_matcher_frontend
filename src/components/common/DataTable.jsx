import React from 'react';

const DataTable = ({ 
  columns, 
  data, 
  onRowClick, 
  selectable = false, 
  selected = [], 
  onSelect, 
  isLoading = false,
  emptyMessage = "No data available"
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">{emptyMessage}</div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {selectable && (
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  checked={data.length > 0 && selected.length === data.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onSelect(data.map(item => item.id));
                    } else {
                      onSelect([]);
                    }
                  }}
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={column.width ? { width: column.width } : {}}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr 
              key={row.id || rowIndex} 
              className={`${onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}`}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {selectable && (
                <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    checked={selected.includes(row.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        onSelect([...selected, row.id]);
                      } else {
                        onSelect(selected.filter(id => id !== row.id));
                      }
                    }}
                  />
                </td>
              )}
              {columns.map((column) => (
                <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
