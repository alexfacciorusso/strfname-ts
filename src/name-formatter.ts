/**
 * Defines the structure for a name object, including optional parts.
 */
export interface Name {
  firstName: string;
  middleName?: string; // Middle name is now optional
  lastName: string;
}

/**
 * Options for the formatName function.
 */
export interface FormatNameOptions {
  name: Name;
  format?: string;
}

/**
 * Default format string to be used if no format is provided.
 */
let globalDefaultFormat = "F L";

/**
 * Sets a new global default format string.
 * @param newDefaultFormat - The new default format string.
 */
export const setDefaultFormat = (newDefaultFormat: string): void => {
  globalDefaultFormat = newDefaultFormat;
};

/**
 * A map of format codes to their corresponding transformation functions.
 * This approach is highly extensible.
 */
const tokenMap: Record<string, (name: Name) => string> = {
  // First Name
  'F': (name) => name.firstName || '',
  'f': (name) => (name.firstName || '').toLowerCase(),
  'FIRST': (name) => (name.firstName || '').toUpperCase(),
  // Last Name
  'L': (name) => name.lastName || '',
  'l': (name) => (name.lastName || '').toLowerCase(),
  'LAST': (name) => (name.lastName || '').toUpperCase(),
  // Middle Name
  'M': (name) => name.middleName || '',
  'm': (name) => (name.middleName || '').toLowerCase(),
  'MIDDLE': (name) => (name.middleName || '').toUpperCase(),
  // First Initial
  'I': (name) => (name.firstName ? name.firstName.charAt(0).toUpperCase() : ''),
  'i': (name) => (name.firstName ? name.firstName.charAt(0).toLowerCase() : ''),
  // Middle Initial
  'J': (name) => (name.middleName ? name.middleName.charAt(0).toUpperCase() : ''),
  'j': (name) => (name.middleName ? name.middleName.charAt(0).toLowerCase() : ''),
  // Last Initial
  'K': (name) => (name.lastName ? name.lastName.charAt(0).toUpperCase() : ''),
  'k': (name) => (name.lastName ? name.lastName.charAt(0).toLowerCase() : ''),
};

// Generate the regex dynamically from the keys of the tokenMap.
// This makes the function more maintainable; add a token to the map,
// and it's automatically included in the regex.
const formatTokenRegex = new RegExp(Object.keys(tokenMap).join('|'), 'g');

/**
 * Formats a name object based on a provided format string or the global default.
 * This is the core function of the library.
 * @param options - An object conforming to the FormatNameOptions interface.
 * @returns The formatted name as a string.
 */
export const formatName = (options: FormatNameOptions): string => {
  if (!options || !options.name) {
    return '';
  }

  const formatToUse = options.format || globalDefaultFormat;

  if (!formatToUse) {
    return ''; // Should not happen if globalDefaultFormat is always set
  }

  return formatToUse.replace(formatTokenRegex, (match) => {
    // Find the corresponding function in the token map and execute it.
    // If a token is not found (which shouldn't happen with our regex),
    // it returns an empty string.
    const transform = tokenMap[match];
    return transform ? transform(options.name) : '';
  });
};
