const BASE_URL = 'https://api.rawg.io/api';
const API_KEY = process.env.RAWG_API_KEY;
const MISSING_API_KEY_MESSAGE = 'Missing RAWG API key. Please define RAWG_API_KEY in your .env file.';

export function hasRawgApiKey() {
  return Boolean(API_KEY);
}

export function getMissingApiKeyMessage() {
  return MISSING_API_KEY_MESSAGE;
}

export async function rawgFetch(endpoint, params = {}) {
  if (!hasRawgApiKey()) {
    throw new Error(getMissingApiKeyMessage());
  }

  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set('key', API_KEY);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  });

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`RAWG request failed with status ${response.status}.`);
  }

  return response.json();
}

export function fetchGames(params = {}) {
  return rawgFetch('/games', {
    page_size: 27,
    ...params,
  });
}

export function fetchPlatforms() {
  return rawgFetch('/platforms', { page_size: 50 });
}

export function fetchGameDetail(slug) {
  return rawgFetch(`/games/${slug}`);
}

export function fetchGameScreenshots(id) {
  return rawgFetch(`/games/${id}/screenshots`, { page_size: 4 });
}

export function fetchGameStores(id) {
  return rawgFetch(`/games/${id}/stores`);
}

export function fetchGameMovies(id) {
  return rawgFetch(`/games/${id}/movies`);
}
