type ClassValue = string | number | boolean | null | undefined | ClassArray | ClassObject;

interface ClassArray extends Array<ClassValue> {}

interface ClassObject {
  [key: string]: boolean | number | string | null | undefined;
}

function isTruthyValue(value: boolean | number | string | null | undefined): boolean {
  return value !== false && value !== null && value !== undefined && value !== 0 && value !== '';
}

export function classNames(...args: ClassValue[]): string {
  const classes: string[] = [];

  for (const arg of args) {
    if (arg === null || arg === undefined || arg === false) {
      continue;
    }

    if (typeof arg === 'string') {
      if (arg !== '') {
        classes.push(arg);
      }
    } else if (typeof arg === 'number') {
      if (arg !== 0 && !Number.isNaN(arg)) {
        classes.push(String(arg));
      }
    } else if (Array.isArray(arg)) {
      if (arg.length > 0) {
        const inner = classNames(...arg);
        if (inner !== '') {
          classes.push(inner);
        }
      }
    } else if (typeof arg === 'object') {
      for (const key in arg) {
        if (Object.prototype.hasOwnProperty.call(arg, key) && isTruthyValue(arg[key])) {
          classes.push(key);
        }
      }
    }
  }

  return classes.join(' ');
}
