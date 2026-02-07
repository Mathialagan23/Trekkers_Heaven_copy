export const formatCurrency = (amount, currency = 'INR') => {
  const val = Number(amount) || 0;
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  }
  // default INR
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);
};

const STORAGE_KEY = 'itineraryCurrencies_v1';

export const getItineraryCurrency = (itId) => {
  try {
    const map = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return map[itId] || 'INR';
  } catch (e) {
    return 'INR';
  }
};

export const setItineraryCurrency = (itId, currency) => {
  try {
    const map = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    map[itId] = currency;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch (e) {
    // ignore
  }
};

export const setTempCurrencyForCreate = (tempKeyCurrency) => {
  // Use localStorage temporary slot to store user's selected currency before itinerary exists
  try {
    localStorage.setItem('itinerary_new_currency', tempKeyCurrency);
  } catch (e) {}
};

export const getTempCurrencyForCreate = () => {
  try {
    return localStorage.getItem('itinerary_new_currency') || 'INR';
  } catch (e) { return 'INR'; }
};

export const clearTempCurrencyForCreate = () => {
  try { localStorage.removeItem('itinerary_new_currency'); } catch (e) {}
};