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

  test('should return empty string for null options or null name', () => {
    expect(formatName(null as any)).toBe('');
    expect(formatName({ name: null as any, format: 'F L' })).toBe('');
  });

  test('should use default format "F L" if format is not provided', () => {
    expect(formatName({ name: nameJohn })).toBe('John Doe');
  });

  test('should use explicitly provided format', () => {
    expect(formatName({ name: nameJohn, format: 'L, F M' })).toBe('Doe, John Robert');
  });

  test('should format f.l.m.', () => {
    expect(formatName({ name: nameJohn, format: 'f.l.m.' })).toBe('john.doe.robert.');
  });

  test('should format FIRST LAST MIDDLE', () => {
    expect(formatName({ name: nameJohn, format: 'FIRST LAST MIDDLE' })).toBe('JOHN DOE ROBERT');
  });

  test('should format I.J.K.', () => {
    expect(formatName({ name: nameJohn, format: 'I.J.K.' })).toBe('J.R.D.');
  });

  test('should format ijk', () => {
    expect(formatName({ name: nameJohn, format: 'ijk' })).toBe('jrd');
  });

  test('should handle missing middle name gracefully with explicit format', () => {
    expect(formatName({ name: nameJane, format: 'F M L' })).toBe('Jane  Doe'); // Note the double space
    expect(formatName({ name: nameJane, format: 'F J L' })).toBe('Jane  Doe');
    expect(formatName({ name: nameJane, format: 'I.J.K.' })).toBe('J..D.');
  });

  test('should handle missing middle name gracefully with default format', () => {
    setDefaultFormat('F M L');
    expect(formatName({ name: nameJane })).toBe('Jane  Doe');
    setDefaultFormat('I.J.K.');
    expect(formatName({ name: nameJane })).toBe('J..D.');
  });

  test('should handle empty strings for name parts', () => {
    const emptyName: Name = { firstName: '', lastName: '' };
    expect(formatName({ name: emptyName, format: 'F L' })).toBe(' ');
    expect(formatName({ name: emptyName, format: 'I.K.' })).toBe('..');
  });

  test('should handle mixed case format strings', () => {
    expect(formatName({ name: nameJohn, format: 'F lAST MIddle' })).toBe('John DOE Robert');
  });

  test('should handle unknown tokens by ignoring them', () => {
    expect(formatName({ name: nameJohn, format: 'F X L Y' })).toBe('John  Doe ');
  });

  describe('setDefaultFormat', () => {
    test('should change the global default format', () => {
      setDefaultFormat('L, F');
      expect(formatName({ name: nameJohn })).toBe('Doe, John');
    });

    test('new default format should apply to subsequent calls without format', () => {
      // Original default is "F L"
      // Set new default
      setDefaultFormat('I.K.'); // Note: No space
      expect(formatName({ name: nameJohn })).toBe('J.D.'); // Uses the new default "I.K." -> John Doe -> J.D.

      // Test with another name and another default
      setDefaultFormat('f m l');
      expect(formatName({ name: nameJane })).toBe('jane  doe'); // Uses new default "f m l" -> Jane Doe -> jane  doe
    });

    test('explicit format in options should override new global default', () => {
      setDefaultFormat('L, F');
      expect(formatName({ name: nameJohn, format: 'F M L' })).toBe('John Robert Doe');
    });

    test('should handle empty string as a default format, effectively returning empty for default calls', () => {
      setDefaultFormat('');
      expect(formatName({ name: nameJohn })).toBe('');
    });
  });
});
