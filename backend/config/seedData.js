// Données de démonstration utilisées quand Cosmos DB n'est pas configuré
const products = [
  { id: 'p1', name: 'Croissant Beurre',       description: 'Le classique, feuilletage pur beurre AOP',          price: 1.50, category: 'viennoiserie', emoji: '🥐', allergens: ['gluten', 'lait', 'oeufs'], available: true },
  { id: 'p2', name: 'Pain au Chocolat',        description: 'Double barre de chocolat Valrhona',                 price: 1.80, category: 'viennoiserie', emoji: '🍫', allergens: ['gluten', 'lait', 'oeufs'], available: true },
  { id: 'p3', name: 'Croissant Matcha',        description: 'Nouveauté : feuilletage au thé matcha du Japon',    price: 2.20, category: 'viennoiserie', emoji: '🍵', allergens: ['gluten', 'lait', 'oeufs'], available: true },
  { id: 'p4', name: 'Baguette Tradition',      description: 'Farine de blé française, fermentation lente 24h',   price: 1.20, category: 'pain',         emoji: '🥖', allergens: ['gluten'],                  available: true },
  { id: 'p5', name: 'Sandwich Jambon-Beurre',  description: 'Baguette tradition, jambon Paris, beurre Échiré',   price: 4.50, category: 'sandwich',     emoji: '🥪', allergens: ['gluten', 'lait'],          available: true },
  { id: 'p6', name: 'Café Crème',              description: 'Espresso double, mousse de lait onctueuse',          price: 3.20, category: 'boisson',      emoji: '☕', allergens: ['lait'],                    available: true },
  { id: 'p7', name: 'Tarte aux Fraises',       description: 'Crème pâtissière vanille, fraises Gariguette',      price: 5.50, category: 'dessert',      emoji: '🍓', allergens: ['gluten', 'lait', 'oeufs'], available: true },
  { id: 'p8', name: 'Croissant Amande',        description: 'Crème frangipane, amandes effilées torréfiées',     price: 2.00, category: 'viennoiserie', emoji: '🌰', allergens: ['gluten', 'lait', 'oeufs', 'fruits à coque'], available: true },
];

const stores = [
  { id: 's1', name: 'Paris - République',   city: 'Paris',    address: '12 Place de la République, 75011' },
  { id: 's2', name: 'Paris - Montmartre',   city: 'Paris',    address: '8 Rue Lepic, 75018' },
  { id: 's3', name: 'Lyon - Bellecour',     city: 'Lyon',     address: '3 Place Bellecour, 69002' },
  { id: 's4', name: 'Bruxelles - Centre',   city: 'Bruxelles',address: '15 Grand-Place, 1000' },
  { id: 's5', name: 'New York - SoHo',      city: 'New York', address: '78 Spring Street, NY 10012' },
];

module.exports = { products, stores };
