// Input sanitization and validation utilities

/**
 * Trims and limits string length safely
 * @param {any} value 
 * @param {number} maxLength 
 * @returns {string}
 */
function cleanString(value, maxLength = 250) {
  return String(value ?? '').trim().slice(0, maxLength);
}

/**
 * Validates 10-digit Indian mobile number
 * @param {string} phone 
 * @returns {boolean}
 */
function isValidPhone(phone) {
  return /^\d{10}$/.test(String(phone ?? '').trim());
}

/**
 * Validates integer quantity between min and max
 * @param {any} val 
 * @param {number} min 
 * @param {number} max 
 * @returns {boolean}
 */
function isValidQuantity(val, min = 1, max = 20) {
  const num = Math.floor(Number(val));
  return !Number.isNaN(num) && num >= min && num <= max;
}

module.exports = {
  cleanString,
  isValidPhone,
  isValidQuantity
};
