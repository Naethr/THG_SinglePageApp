import {
  fetchGameDetail,
  fetchGameMovies,
  fetchGameScreenshots,
  fetchGameStores,
  getMissingApiKeyMessage,
  hasRawgApiKey,
} from '../api/rawgClient';
import { ErrorMessage } from '../components/ErrorMessage';
import { Loader } from '../components/Loader';

export async function PageDetail(root, slug) {
  root.innerHTML = Loader('Loading game details');

  if (!hasRawgApiKey()) {
    root.innerHTML = ErrorMessage(getMissingApiKeyMessage());
    return;
  }

  try {
    const detail = await fetchGameDetail(slug);
    const [screenshots, stores, movies] = await Promise.all([
      fetchGameScreenshots(detail.id).catch(() => ({ results: [] })),
      fetchGameStores(detail.id).catch(() => ({ results: [] })),
      fetchGameMovies(detail.id).catch(() => ({ results: [] })),
    ]);

    root.innerHTML = renderDetail(detail, screenshots.results || [], stores.results || [], movies.results || []);
  } catch (error) {
    root.innerHTML = ErrorMessage(error.message);
  }
}

function renderDetail(game, screenshots, stores, movies) {
  const description = toPlainText(game.description_raw || game.description || '');
  const movie = movies.find((item) => item.data && (item.data.max || item.data['480']));

  return `
    <article class="detail-page">
      <section class="detail-hero">
        <div class="detail-hero__content">
          <a class="internal-link detail-back" href="/" data-link>Back to list</a>
          <h1>${escapeHtml(game.name)}</h1>
          ${game.released ? `<p class="detail-date">Released ${escapeHtml(game.released)}</p>` : ''}
          ${renderRating(game)}
        </div>
        ${
          game.background_image
            ? `<img class="detail-hero__image" src="${game.background_image}" alt="${escapeHtml(game.name)} main artwork" />`
            : ''
        }
      </section>

      ${description ? section('Description', `<p>${escapeHtml(description)}</p>`) : ''}

      <section class="detail-grid">
        ${linkSection('Developers', game.developers, 'developer')}
        ${linkSection('Publishers', game.publishers, 'publisher')}
        ${linkSection('Genres', game.genres, 'genre')}
        ${linkSection('Tags', sliceItems(game.tags, 12), 'tag')}
        ${platformSection(game.platforms)}
      </section>

      ${game.website ? section('Official website', externalLink(game.website, game.website)) : ''}
      ${movie ? section('Trailer', renderVideo(movie)) : ''}
      ${renderScreenshots(screenshots)}
      ${renderStores(stores)}
    </article>
  `;
}

function renderRating(game) {
  if (!game.rating && !game.ratings_count) return '';

  return `
    <div class="detail-rating">
      ${game.rating ? `<span>${escapeHtml(game.rating)}/5 average rating</span>` : ''}
      ${game.ratings_count ? `<span>${escapeHtml(game.ratings_count)} ratings</span>` : ''}
    </div>
  `;
}

function section(title, content) {
  return `
    <section class="detail-section">
      <h2>${title}</h2>
      ${content}
    </section>
  `;
}

function linkSection(title, items, routeName) {
  if (!Array.isArray(items) || !items.length) return '';

  const links = items
    .filter((item) => item.id && item.name)
    .map((item) => `<a class="internal-link chip" href="/${routeName}/${item.id}" data-link>${escapeHtml(item.name)}</a>`)
    .join('');

  return links ? section(title, `<div class="chip-list">${links}</div>`) : '';
}

function platformSection(platforms) {
  if (!Array.isArray(platforms) || !platforms.length) return '';

  const links = platforms
    .map((entry) => entry.platform)
    .filter((platform) => platform && platform.id && platform.name)
    .map((platform) => `<a class="internal-link chip" href="/platform/${platform.id}" data-link>${escapeHtml(platform.name)}</a>`)
    .join('');

  return links ? section('Platforms', `<div class="chip-list">${links}</div>`) : '';
}

function renderScreenshots(screenshots) {
  const images = screenshots.slice(0, 4).filter((item) => item.image);
  if (!images.length) return '';

  return section(
    'Screenshots',
    `<div class="screenshot-grid">
      ${images.map((item) => `<img src="${item.image}" alt="Game screenshot" loading="lazy" />`).join('')}
    </div>`,
  );
}

function renderStores(stores) {
  const links = stores.filter((store) => store.url);
  if (!links.length) return '';

  return section(
    'Where to buy',
    `<div class="external-list">
      ${links.map((store) => externalLink(store.url, store.store?.name || store.url)).join('')}
    </div>`,
  );
}

function renderVideo(movie) {
  const src = movie.data.max || movie.data['480'];
  return `
    <video class="detail-video" controls preload="metadata">
      <source src="${src}" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  `;
}

function externalLink(href, label) {
  return `<a class="external-link" href="${href}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`;
}

function sliceItems(items, count) {
  return Array.isArray(items) ? items.slice(0, count) : [];
}

function toPlainText(value) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(String(value), 'text/html');
  return doc.body.textContent.trim();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
