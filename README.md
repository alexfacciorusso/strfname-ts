# `strfname`

A simple, intuitive TypeScript library for formatting personal names using format strings, based on the **NFN (Name Format Notation)** standard.

## Installation

```bash
npm install strfname
# or
yarn add strfname
# or
pnpm add strfname
```

## Usage

Import the `formatName` function and pass it an options object containing the name and an optional format string.

```typescript
import { formatName, Name, setDefaultFormat } from 'strfname';

const name: Name = {
  firstName: 'Ada',
  middleName: 'King',
  lastName: 'Lovelace',
};

// Format a name using a specific format string
console.log(formatName({ name, format: 'F L' }));   // "Ada Lovelace"
console.log(formatName({ name, format: 'L, F' }));   // "Lovelace, Ada"
console.log(formatName({ name, format: 'F J. L' })); // "Ada K. Lovelace"

// Missing parts are handled gracefully
const simpleName: Name = {
  firstName: 'Jane',
  lastName: 'Smith',
};
console.log(formatName({ name: simpleName, format: 'L, F M' })); // "Smith, Jane"

// You can also set a global default format
setDefaultFormat('L, F');

console.log(formatName({ name })); // "Lovelace, Ada"
```

## NFN Format Codes

| Code | Description | Example (for Ada King Lovelace) |
| :---- | :---- | :---- |
| F | First Name (Title Case) | Ada |
| f | first name (lowercase) | ada |
| L | Last Name (Title Case) | Lovelace |
| l | last name (lowercase) | lovelace |
| M | Middle Name (Title Case) | King |
| m | middle name (lowercase) | king |
| I | First Initial (Uppercase) | A |
| i | first initial (lowercase) | a |
| J | Middle Initial (Uppercase) | K |
| j | middle initial (lowercase) | k |
| K | Last Initial (Uppercase) | L |
| k | last initial (lowercase) | l |

## NFN Examples

### Western Names

By combining the codes, you can construct any desired format.

Given Name: Ada King Lovelace

| Format String | Resulting Output |
| :---- | :---- |
| F L | Ada Lovelace |
| L, F | Lovelace, Ada |
| L, F M | Lovelace, Ada King |
| F J. L | Ada K. Lovelace |
| I.J.K. | A.K.L. |

### International Usage

NFN is flexible enough to handle various global naming conventions by storing the appropriate parts of the name in the firstName and lastName fields.

| Convention | Example Name Data | Format String | Resulting Output |
| :---- | :---- | :---- | :---- |
| Chinese (Family Name First) | firstName: "Míng", lastName: "Yáo" | L F | Yáo Míng |
| Hungarian (Family Name First) | firstName: "Viktor", lastName: "Orbán" | L F | Orbán Viktor |
| Spanish (Compound Surname) | firstName: "Gabriel", lastName: "García Márquez" | F L | Gabriel García Márquez |
| Icelandic (Patronymic) | firstName: "Björk", lastName: "Guðmundsdóttir" | F L | Björk Guðmundsdóttir |
| Arabic (Patronymic) | firstName: "Mohammed", lastName: "bin Salman" | F L | Mohammed bin Salman |

## **License**

This library is licensed under the MIT License. The NFN specification itself is free to use and adapt.
