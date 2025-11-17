import './table.scss';

import type { ReactNode, TableHTMLAttributes } from 'react';
import type { TableProps } from './Table.types';

export function Table<T = Record<string, unknown>>(
  props: TableProps<T> & TableHTMLAttributes<HTMLTableElement>,
) {
  const {
    columns,
    data = [],
    striped = false,
    bordered = false,
    hover = false,
    rowKey = 'id',
    onRowClick,
    emptyText = 'No data',
    className,
    size = 'medium',
    ...rest
  } = props;

  const baseClass = [
    'ui-table',
    `ui-table--${size}`,
    striped ? 'ui-table--striped' : '',
    bordered ? 'ui-table--bordered' : '',
    hover ? 'ui-table--hover' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const classList = [baseClass, className].filter(Boolean).join(' ');

  const getRowKey = (record: T, index: number) => {
    if (typeof rowKey === 'function') return rowKey(record);
    if (typeof rowKey === 'string' && record) {
      const recordObj = record as Record<string, unknown>;
      const value = recordObj[rowKey];
      if (typeof value === 'string' || typeof value === 'number') return value;
    }
    return index;
  };

  return (
    <table className={classList} {...rest}>
      <thead>
        <tr>
          {columns.map((col, colIdx) => (
            <th key={col.key ?? `${String(col.dataIndex ?? '')}-${colIdx}`}>{col.title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data && data.length > 0 ? (
          data.map((row, idx) => (
            <tr
              key={String(getRowKey(row, idx))}
              onClick={() => onRowClick && onRowClick(row, idx)}
            >
              {columns.map((col, colIdx) => {
                const val: unknown = col.dataIndex
                  ? (row as Record<string, unknown>)[String(col.dataIndex)]
                  : undefined;
                return (
                  <td
                    key={col.key ?? `${String(col.dataIndex ?? '')}-${colIdx}`}
                    style={{ textAlign: col.align }}
                  >
                    {col.render ? col.render(val, row, idx) : (val as ReactNode)}
                  </td>
                );
              })}
            </tr>
          ))
        ) : (
          <tr>
            <td className='ui-table__empty' colSpan={columns.length}>
              {emptyText}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
