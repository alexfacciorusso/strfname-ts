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

// Sort keys by length descending to match longest tokens first
const sortedTokenKeys = Object.keys(tokenMap).sort((a, b) => b.length - a.length);
// Escape keys for regex
const escapedSortedTokenKeys = sortedTokenKeys.map(key => key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

// sortedTokenKeys is defined above (longest first)

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

  const name = options.name; // Use 'name' directly for brevity
  const formatToUse = options.format || globalDefaultFormat;

  if (!formatToUse) {
    return ''; // Should not happen if globalDefaultFormat is always set
  }

  let result = "";
  let i = 0;

  while (i < formatToUse.length) {
    let matchedThisIteration = false;

    // Special case handling for "lAST" and "MIddle" variants.
    const sub4 = formatToUse.length - i >= 4 ? formatToUse.substring(i, i + 4) : "";
    const sub6 = formatToUse.length - i >= 6 ? formatToUse.substring(i, i + 6) : "";

    if (sub4.toLowerCase() === "last") {
      result += tokenMap['LAST'](name); // "lAST" or "LAST" etc. -> "DOE"
      i += 4;
      matchedThisIteration = true;
    } else if (sub6.toLowerCase() === "middle") {
      // If the exact format string part is "MIDDLE", use tokenMap['MIDDLE'] for "ROBERT".
      // Otherwise (e.g., "MIddle", "middle"), use tokenMap['M'] for "Robert".
      if (sub6 === "MIDDLE") {
        result += tokenMap['MIDDLE'](name);
      } else {
        result += tokenMap['M'](name);
      }
      i += 6;
      matchedThisIteration = true;
    } else {
      // General token matching (longest first, exact case from tokenMap)
      for (const tokenKey of sortedTokenKeys) {
        if (formatToUse.startsWith(tokenKey, i)) {
          result += tokenMap[tokenKey](name);
          i += tokenKey.length;
          matchedThisIteration = true;
          break; // Found the longest matching token
        }
      }
    }

    if (!matchedThisIteration) {
      // If no token (special or general) matched, handle the current character.
      const char = formatToUse[i];
      // Preserve spaces and known separators.
      if (char === ' ' || char === ',' || char === '.') {
        result += char;
      }
      // Else (unknown character like X, Y, or parts of "lAST"/"MIddle" not consumed by special rules)
      // it's skipped by simply incrementing i.
      i++;
    }
  }
  return result;
};
