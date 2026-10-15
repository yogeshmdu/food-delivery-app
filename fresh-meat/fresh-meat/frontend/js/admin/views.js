// Admin UI view components
import { escapeHtml, formatCurrency } from '../common/formatters.js';

export const STATUS_TRANSITIONS = {
  placed: null,
  accepted: ['packing', 'Start packing'],
  packing: ['out_for_delivery', 'Out for delivery'],
  out_for_delivery: ['delivered', 'Mark delivered']
};

export const KANBAN_COLUMNS = [
  { title: 'New', color: '#1B3AA8', statuses: ['placed'] },
  { title: 'In kitchen', color: '#FFC72C', statuses: ['accepted', 'packing'] },
  { title: 'Out for delivery', color: '#0F1B5C', statuses: ['out_for_delivery'] },
  { title: 'Done', color: '#9AA3C7', statuses: ['delivered', 'rejected'] }
];

/**
 * Render admin login screen
 * @param {string} errorMsg 
 */
export function renderLoginView(errorMsg = '') {
  return `
    <div class="login">
      <b>Admin Key Required</b>
      ${errorMsg ? `<div style="color: var(--color-status-danger); font-size: 13px;">${escapeHtml(errorMsg)}</div>` : ''}
      <input id="k" type="password" placeholder="Enter admin key (default: admin123)">
      <button class="b" id="go">Unlock Panel</button>
    </div>`;
}

/**
 * Render single order card in Kanban board
 * @param {object} order 
 */
export function renderOrderCard(order) {
  const nextTransition = STATUS_TRANSITIONS[order.status];
  const itemsText = order.items
    .map(i => `${escapeHtml(i.name)} ${escapeHtml(i.unit)} x${i.qty}`)
    .join(', ');

  let actionButtonsHtml = '';

  if (order.status === 'placed') {
    actionButtonsHtml = `
      <div class="btns">
        <button class="b o" data-i="${escapeHtml(order.id)}" data-s="rejected">Reject</button>
        <button class="b" data-i="${escapeHtml(order.id)}" data-s="accepted">Accept</button>
      </div>`;
  } else if (nextTransition) {
    actionButtonsHtml = `
      <div class="btns">
        <button class="b" data-i="${escapeHtml(order.id)}" data-s="${escapeHtml(nextTransition[0])}">${escapeHtml(nextTransition[1])}</button>
      </div>`;
  }

  return `
    <div class="oc">
      <div class="t">
        <span>#${escapeHtml(order.id)}</span>
        <span>${formatCurrency(order.total)}</span>
      </div>
      <small><b>${escapeHtml(order.customer.name)}</b> &bull; ${escapeHtml(order.customer.phone)}</small>
      <small>${escapeHtml(order.customer.address)}</small>
      <div>${itemsText}</div>
      <small>${escapeHtml(order.slot)} &bull; ${escapeHtml(order.payment)}</small>
      ${actionButtonsHtml}
    </div>`;
}

/**
 * Render complete Kanban board with 4 columns
 * @param {Array} orders 
 */
export function renderKanbanBoard(orders) {
  const columnsHtml = KANBAN_COLUMNS.map(col => {
    const columnOrders = orders.filter(o => col.statuses.includes(o.status));
    const cardsHtml = columnOrders.length > 0
      ? columnOrders.map(renderOrderCard).join('')
      : '<div class="empty">No orders</div>';

    return `
      <div class="col">
        <h3>
          <i style="background-color: ${col.color};"></i>
          ${col.title} (${columnOrders.length})
        </h3>
        ${cardsHtml}
      </div>`;
  }).join('');

  return `<div class="cols">${columnsHtml}</div>`;
}

/**
 * Render inventory products management table
 * @param {Array} products 
 */
export function renderProductsTable(products) {
  return `
    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th>Category</th>
          <th>Unit</th>
          <th>Price (Rs.)</th>
          <th>In stock</th>
        </tr>
      </thead>
      <tbody>
        ${products.map(p => `
          <tr>
            <td><b>${escapeHtml(p.name)}</b></td>
            <td>${escapeHtml(p.cat)}</td>
            <td>${escapeHtml(p.unit)}</td>
            <td>
              <input class="pr" type="number" min="1" value="${p.price}" data-p="${p.id}" aria-label="Product price">
            </td>
            <td>
              <input type="checkbox" ${p.inStock ? 'checked' : ''} data-s="${p.id}" aria-label="Product in stock">
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>`;
}
