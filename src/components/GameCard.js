export function GameCard(game, index = 0) {
  const image = game.background_image || '';
  const platforms = extractPlatforms(game).join(', ') || 'Platforms unavailable';
  const genres = names(game.genres).join(', ');
  const publishers = names(game.publishers).join(', ');

  return `
    <article class="game-card" style="--index: ${index}">
      <a href="/game/${game.slug}" data-link aria-label="Open ${escapeHtml(game.name)}">
        <div class="game-card__media">
          ${
            image
              ? `<img src="${image}" alt="${escapeHtml(game.name)} cover" loading="lazy" />`
              : '<div class="game-card__fallback">No image</div>'
          }
          <div class="game-card__meta" aria-hidden="true">
            ${metaLine('Released', game.released)}
            ${publishers ? metaLine('Publishers', publishers) : ''}
            ${genres ? metaLine('Genres', genres) : ''}
            ${metaLine('Rating', formatRating(game.rating))}
            ${metaLine('Votes', game.ratings_count)}
          </div>
        </div>
        <div class="game-card__body">
          <h2>${escapeHtml(game.name)}</h2>
          <p>${escapeHtml(platforms)}</p>
        </div>
      </a>
    </article>
  `;
}

function metaLine(label, value) {
  if (value === undefined || value === null || value === '') return '';
  return `<p><span>${label}</span>${escapeHtml(value)}</p>`;
}

function extractPlatforms(game) {
  if (!Array.isArray(game.platforms)) return [];
  return game.platforms
    .map((entry) => entry.platform && entry.platform.name)
    .filter(Boolean);
}

function names(items) {
  return Array.isArray(items) ? items.map((item) => item.name).filter(Boolean) : [];
}

function formatRating(value) {
  return Number.isFinite(value) ? `${value}/5` : '';
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
