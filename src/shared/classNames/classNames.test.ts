import { classNames } from './index.ts';

describe('classNames', () => {
  it('Обрабатывает строковые аргументы', () => {
    expect(classNames('btn', 'btn-primary')).toBe('btn btn-primary');
    expect(classNames('')).toBe('');
  });

  it('Обрабатывает числовые аргументы', () => {
    expect(classNames(1, 2, 3)).toBe('1 2 3');
    expect(classNames(0)).toBe('');
  });

  it('Обрабатывает объектные аргументы', () => {
    expect(
      classNames({
        btn: true,
        'btn-primary': true,
        'btn-disabled': false,
      }),
    ).toBe('btn btn-primary');

    expect(
      classNames({
        active: 1,
        hidden: 0,
        visible: 'truthy',
      }),
    ).toBe('active visible');
  });

  it('Обрабатывает массивы аргументов', () => {
    expect(classNames(['btn', 'btn-primary'])).toBe('btn btn-primary');
    expect(classNames(['btn', { 'btn-primary': true }, ['btn-large']])).toBe(
      'btn btn-primary btn-large',
    );
    expect(classNames([])).toBe('');
  });

  it('Обрабатывает смешанные аргументы разных типов', () => {
    expect(
      classNames(
        'btn',
        { 'btn-primary': true, 'btn-large': false },
        ['extra-class', { hidden: null }],
        undefined,
        null,
        false,
        true,
        0,
        1,
      ),
    ).toBe('btn btn-primary extra-class 1');
  });

  it('Фильтрует ложные значения', () => {
    expect(classNames('btn', null, undefined, false, '', 0, { valid: true, invalid: false })).toBe(
      'btn valid',
    );
  });

  it('Возвращает пустую строку для всех ложных значений', () => {
    expect(classNames(null, undefined, false, '')).toBe('');
    expect(classNames({ test: false })).toBe('');
    expect(classNames([])).toBe('');
  });

  it('Обрабатывает вложенные массивы и объекты', () => {
    expect(
      classNames(['level1', ['level2', { 'level2-active': true }], { 'level1-active': true }]),
    ).toBe('level1 level2 level2-active level1-active');
  });

  it('Обрабатывает сложный реальный сценарий', () => {
    const isActive = true;
    const isDisabled = false;
    const size = 'large';

    const result = classNames(
      'button',
      {
        'button--active': isActive,
        'button--disabled': isDisabled,
        [`button--${size}`]: size,
      },
      ['additional-class', { 'hidden-on-mobile': false }],
    );

    expect(result).toBe('button button--active button--large additional-class');
  });

  //  https://www.npmjs.com/package/classnames ---> Дока
  it('Соответствует примерам из официальной документации', () => {
    expect(classNames('foo', 'bar')).toBe('foo bar');

    expect(classNames('foo', { bar: true })).toBe('foo bar');

    expect(classNames({ 'foo-bar': true })).toBe('foo-bar');
    expect(classNames({ 'foo-bar': false })).toBe('');

    expect(classNames({ foo: true }, { bar: true })).toBe('foo bar');
    expect(classNames({ foo: true, bar: true })).toBe('foo bar');

    expect(classNames('foo', { bar: true, duck: false }, 'baz', { quux: true })).toBe(
      'foo bar baz quux',
    );

    expect(classNames(null, false, 'bar', undefined, 0, 1, { baz: null }, '')).toBe('bar 1');

    const arr = ['b', { c: true, d: false }];
    expect(classNames('a', arr)).toBe('a b c');
  });

  it('Правильно обрабатывает граничные случаи', () => {
    expect(classNames(0, '0')).toBe('0');

    expect(classNames(NaN)).toBe('');

    expect(classNames({})).toBe('');

    expect(classNames([[]])).toBe('');
  });
});
