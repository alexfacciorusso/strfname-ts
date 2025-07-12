export interface Name {
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
}

/**
 * Options for the formatName function.
 */
export interface FormatNameOptions extends Name {
  format?: string | null;
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
  // Last Name
  'L': (name) => name.lastName || '',
  'l': (name) => (name.lastName || '').toLowerCase(),
  // Middle Name
  'M': (name) => name.middleName || '',
  'm': (name) => (name.middleName || '').toLowerCase(),
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

const formatTokenRegex = new RegExp(Object.keys(tokenMap).join('|'), 'g');

/**
 * Formats a name object based on a provided format string or the global default.
 * This is the core function of the library.
 * @param options - An object conforming to the FormatNameOptions interface.
 * @returns The formatted name as a string.
 * @see setDefaultFormat
 */
export const formatName = (options: FormatNameOptions): string => {
  if (!options) {
    return '';
  }

  const formatToUse = options.format || globalDefaultFormat;

  if (!formatToUse) {
    return ''; // Should not happen if globalDefaultFormat is always set
  }

  return formatToUse.replace(formatTokenRegex, (match) => {
    const transform = tokenMap[match];
    return transform ? transform(options) : '';
  });
};
