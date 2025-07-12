import { formatName, Name, setDefaultFormat, FormatNameOptions } from './name-formatter';

describe('formatName', () => {
  const nameJohn: Name = {
    firstName: 'John',
    middleName: 'Robert',
    lastName: 'Doe',
  };

  const nameJane: Name = {
    firstName: 'Jane',
    lastName: 'Doe',
  };

  // Reset default format before each test to ensure isolation
  beforeEach(() => {
    setDefaultFormat("F L"); // Default to "F L" for most tests unless overridden
  });

  test('should use default format "F L" if format is not provided', () => {
    expect(formatName({ ...nameJohn })).toBe('John Doe');
  });

  test('should use explicitly provided format', () => {
    expect(formatName({ ...nameJohn, format: 'L, F M' })).toBe('Doe, John Robert');
  });

  test('should format f.l.m.', () => {
    expect(formatName({ ...nameJohn, format: 'f.l.m.' })).toBe('john.doe.robert.');
  });

  test('should format I.J.K.', () => {
    expect(formatName({ ...nameJohn, format: 'I.J.K.' })).toBe('J.R.D.');
  });

  test('should format ijk', () => {
    expect(formatName({ ...nameJohn, format: 'ijk' })).toBe('jrd');
  });

  test('should handle missing middle name gracefully with explicit format', () => {
    expect(formatName({ ...nameJane, format: 'F M L' })).toBe('Jane  Doe'); // Note the double space
    expect(formatName({ ...nameJane, format: 'F J L' })).toBe('Jane  Doe');
    expect(formatName({ ...nameJane, format: 'I.J.K.' })).toBe('J..D.');
  });

  test('should handle missing middle name gracefully with default format', () => {
    setDefaultFormat('F M L');
    expect(formatName({ ...nameJane })).toBe('Jane  Doe');
    setDefaultFormat('I.J.K.');
    expect(formatName({ ...nameJane })).toBe('J..D.');
  });

  test('should handle undefined strings for name parts', () => {
    const undefinedName: Name = { firstName: undefined, lastName: undefined };
    expect(formatName({ ...undefinedName, format: 'F L' })).toBe(' ');
  });

  test('should handle null strings for name parts', () => {
    const nullName: Name = { firstName: null, lastName: null };
    expect(formatName({ ...nullName, format: 'F L' })).toBe(' ');
  });

  test('should handle empty strings for name parts', () => {
    const emptyName: Name = { firstName: '', lastName: '' };
    expect(formatName({ ...emptyName, format: 'F L' })).toBe(' ');
    expect(formatName({ ...emptyName, format: 'I.K.' })).toBe('..');
  });

  describe('setDefaultFormat', () => {
    test('should change the global default format', () => {
      setDefaultFormat('L, F');
      expect(formatName({ ...nameJohn })).toBe('Doe, John');
    });

    test('new default format should apply to subsequent calls without format', () => {
      // Original default is "F L"
      // Set new default
      setDefaultFormat('I.K.'); // Note: No space
      expect(formatName({ ...nameJohn })).toBe('J.D.'); // Uses the new default "I.K." -> John Doe -> J.D.

      // Test with another name and another default
      setDefaultFormat('f m l');
      expect(formatName({ ...nameJane })).toBe('jane  doe'); // Uses new default "f m l" -> Jane Doe -> jane  doe
    });

    test('explicit format in options should override new global default', () => {
      setDefaultFormat('L, F');
      expect(formatName({ ...nameJohn, format: 'F M L' })).toBe('John Robert Doe');
    });

    test('should handle empty string as a default format, effectively returning empty for default calls', () => {
      setDefaultFormat('');
      expect(formatName({ ...nameJohn })).toBe('');
    });
  });
});
