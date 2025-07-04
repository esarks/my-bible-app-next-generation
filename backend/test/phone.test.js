const { normalizePhone } = require('../utils/phone');

describe('normalizePhone', () => {
  const validCases = [
    { input: '+17278040148', expected: '+17278040148' },
    { input: '17278040148', expected: '+17278040148' },
    { input: '727-804-0148', expected: '+17278040148' },
    { input: '(727) 804-0148', expected: '+17278040148' },
    { input: '7278040148', expected: '+17278040148' },
  ];

  validCases.forEach(({ input, expected }) => {
    test(`normalizes ${input} to ${expected}`, () => {
      expect(normalizePhone(input)).toBe(expected);
    });
  });

  const invalidCases = ['abc', '12345', '+1 (123) 456-7890'];

  invalidCases.forEach((input) => {
    test(`throws for invalid number ${input}`, () => {
      expect(() => normalizePhone(input)).toThrow();
    });
  });
});
