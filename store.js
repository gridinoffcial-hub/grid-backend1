// data/store.js
// Simple JSON file store — no database needed for starting out.
// When you grow, swap this for MongoDB or a real database.

const fs   = require('fs');
const path = require('path');

const ORDERS_FILE  = path.join(__dirname, 'orders.json');
const CONTACT_FILE = path.join(__dirname, 'contacts.json');

// ── helpers ──────────────────────────────────────

function readFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) return [];
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// ── Orders ────────────────────────────────────────

function getAllOrders() {
  return readFile(ORDERS_FILE);
}

function getOrderById(id) {
  const orders = getAllOrders();
  return orders.find(o => o.id === id) || null;
}

function saveOrder(order) {
  const orders = getAllOrders();
  orders.unshift(order); // newest first
  writeFile(ORDERS_FILE, orders);
  return order;
}

function updateOrderStatus(id, status, note = '') {
  const orders = getAllOrders();
  const idx = orders.findIndex(o => o.id === id);
  if (idx === -1) return null;
  orders[idx].status    = status;
  orders[idx].updatedAt = new Date().toISOString();
  if (note) orders[idx].adminNote = note;
  writeFile(ORDERS_FILE, orders);
  return orders[idx];
}

function deleteOrder(id) {
  const orders = getAllOrders();
  const filtered = orders.filter(o => o.id !== id);
  if (filtered.length === orders.length) return false;
  writeFile(ORDERS_FILE, filtered);
  return true;
}

// ── Contacts ─────────────────────────────────────

function getAllContacts() {
  return readFile(CONTACT_FILE);
}

function saveContact(contact) {
  const contacts = getAllContacts();
  contacts.unshift(contact);
  writeFile(CONTACT_FILE, contacts);
  return contact;
}

// ── Stats ────────────────────────────────────────

function getStats() {
  const orders   = getAllOrders();
  const contacts = getAllContacts();
  return {
    totalOrders   : orders.length,
    newOrders     : orders.filter(o => o.status === 'new').length,
    inProgress    : orders.filter(o => o.status === 'in_progress').length,
    completed     : orders.filter(o => o.status === 'completed').length,
    totalContacts : contacts.length,
    todayOrders   : orders.filter(o => {
      const d = new Date(o.createdAt);
      const t = new Date();
      return d.toDateString() === t.toDateString();
    }).length,
  };
}

module.exports = {
  getAllOrders, getOrderById, saveOrder, updateOrderStatus, deleteOrder,
  getAllContacts, saveContact,
  getStats,
};
