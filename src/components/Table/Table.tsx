import './table.scss';

import { classNames } from '@/shared/classNames';

import type { TableProps } from '@/components';
import type { ReactNode, TableHTMLAttributes } from 'react';

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

  const classes = classNames(
    {
      'ui-table': true,
      [`ui-table--${size}`]: true,
      'ui-table--striped': !!striped,
      'ui-table--bordered': !!bordered,
      'ui-table--hover': !!hover,
    },
    className,
  );

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
    <table className={classes} {...rest}>
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
