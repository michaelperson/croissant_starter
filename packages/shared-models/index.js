/**
 * Statuts de commande possibles dans le système CroissantExpress
 */
const OrderStatuses = {
  PENDING: 'PENDING',
  PREPARING: 'PREPARING',
  READY: 'READY',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED'
};

const ProductCategories = {
  VIENNOISERIE: 'viennoiserie',
  PATISSERIE: 'patisserie',
  BOISSON: 'boisson',
  SALE: 'sale'
};

module.exports = {
  OrderStatuses,
  ProductCategories
};
