// Shared UI formatting utilities

/**
 * Escapes HTML entities to prevent XSS attacks
 * @param {any} str 
 * @returns {string}
 */
export function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, (char) => {
    switch (char) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#39;';
      default: return char;
    }
  });
}

/**
 * Formats a numeric amount as Indian Rupees
 * @param {number} amount 
 * @returns {string}
 */
export function formatCurrency(amount) {
  const num = Number(amount) || 0;
  return `Rs. ${num.toLocaleString('en-IN')}`;
}

/**
 * Formats ISO date string to localized format
 * @param {string} isoString 
 * @returns {string}
 */
export function formatDateTime(isoString) {
  try {
    return new Date(isoString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return isoString;
  }
}
