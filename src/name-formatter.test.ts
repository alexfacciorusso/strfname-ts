import { formatName, Name } from './name-formatter';

describe('formatName', () => {
  const name: Name = {
    firstName: 'John',
    middleName: 'Robert',
    lastName: 'Doe',
  };

  const nameNoMiddle: Name = {
    firstName: 'Jane',
    lastName: 'Doe',
  };

  test('should return empty string for null name or format', () => {
    expect(formatName(null as any, 'F L')).toBe('');
    expect(formatName(name, null as any)).toBe('');
  });

  test('should format F L', () => {
    expect(formatName(name, 'F L')).toBe('John Doe');
  });

  test('should format L, F M', () => {
    expect(formatName(name, 'L, F M')).toBe('Doe, John Robert');
  });

  test('should format f.l.m.', () => {
    expect(formatName(name, 'f.l.m.')).toBe('john.doe.robert.');
  });

  test('should format FIRST LAST MIDDLE', () => {
    expect(formatName(name, 'FIRST LAST MIDDLE')).toBe('JOHN DOE ROBERT');
  });

  test('should format I.J.K.', () => {
    expect(formatName(name, 'I.J.K.')).toBe('J.R.D.');
  });

  test('should format ijk', () => {
    expect(formatName(name, 'ijk')).toBe('jrd');
  });

  test('should handle missing middle name gracefully', () => {
    expect(formatName(nameNoMiddle, 'F M L')).toBe('Jane  Doe'); // Note the double space
    expect(formatName(nameNoMiddle, 'F J L')).toBe('Jane  Doe');
    expect(formatName(nameNoMiddle, 'I.J.K.')).toBe('J..D.');
  });

  test('should handle empty strings for name parts', () => {
    const emptyName: Name = { firstName: '', lastName: '' };
    expect(formatName(emptyName, 'F L')).toBe(' ');
    expect(formatName(emptyName, 'I.K.')).toBe('..');
  });

  test('should handle mixed case format strings', () => {
    expect(formatName(name, 'F lAST MIddle')).toBe('John DOE Robert');
  });

  test('should handle unknown tokens by ignoring them', () => {
    expect(formatName(name, 'F X L Y')).toBe('John  Doe ');
  });
});
