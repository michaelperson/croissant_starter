const BASE_URL = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  const response = await fetch(BASE_URL + path, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Erreur ' + response.status);
  return data;
}

export const api = {
  getProducts: (category) => {
    const query = category ? '?category=' + category : '';
    return request('/api/products' + query);
  },
  getProduct:   (id)          => request('/api/products/' + id),
  createOrder:  (orderData)   => request('/api/orders', { method: 'POST', body: JSON.stringify(orderData) }),
  getOrder:     (num)         => request('/api/orders/' + num),
  updateStatus: (num, status) => request('/api/orders/' + num + '/status', { method: 'PATCH', body: JSON.stringify({ status }) }),
  checkHealth:  ()            => request('/api/health'),
};