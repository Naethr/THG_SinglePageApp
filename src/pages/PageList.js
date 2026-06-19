import { fetchGames, fetchPlatforms, hasRawgApiKey, getMissingApiKeyMessage } from '../api/rawgClient';
import { ErrorMessage, EmptyMessage } from '../components/ErrorMessage';
import { GameCard } from '../components/GameCard';
import { Loader } from '../components/Loader';
import { PlatformSelect } from '../components/PlatformSelect';
import { SearchBar } from '../components/SearchBar';
import { navigateTo } from '../router';

const INITIAL_VISIBLE_COUNT = 9;
const VISIBLE_STEP = 9;
const MAX_VISIBLE_COUNT = 27;

export async function PageList(root, route) {
  root.innerHTML = Loader('Loading games');

  if (!hasRawgApiKey()) {
    root.innerHTML = ErrorMessage(getMissingApiKeyMessage());
    return;
  }

  try {
    const [gamesResponse, platformsResponse] = await Promise.all([
      fetchGames(buildGameParams(route)),
      fetchPlatforms().catch(() => ({ results: [] })),
    ]);

    const games = gamesResponse.results || [];
    const platforms = platformsResponse.results || [];
    renderList(root, route, games, platforms);
  } catch (error) {
    root.innerHTML = ErrorMessage(error.message);
  }
}

function renderList(root, route, games, platforms) {
  let visibleCount = INITIAL_VISIBLE_COUNT;

  const paint = () => {
    const visibleGames = games.slice(0, visibleCount);
    const title = getTitle(route);
    const selectedPlatform = route.filter === 'platform' ? route.value : '';
    const searchValue = route.filter === 'search' ? route.value : '';

    root.innerHTML = `
      <section class="list-hero">
        <p class="eyebrow">RAWG database</p>
        <h1>${title}</h1>
        <p>Browse upcoming and discoverable games with lightweight client-side navigation.</p>
      </section>

      <section class="toolbar" aria-label="Game filters">
        ${SearchBar(searchValue)}
        ${PlatformSelect(platforms, selectedPlatform)}
      </section>

      ${
        games.length
          ? `<section class="game-grid">${visibleGames.map(GameCard).join('')}</section>`
          : EmptyMessage('Try another search or filter.')
      }

      ${
        games.length > visibleCount && visibleCount < MAX_VISIBLE_COUNT
          ? '<div class="show-more-wrap"><button class="show-more" data-show-more>Show more</button></div>'
          : ''
      }
    `;

    bindListEvents(root, paint, () => {
      visibleCount = Math.min(visibleCount + VISIBLE_STEP, MAX_VISIBLE_COUNT);
    });
  };

  paint();
}

function bindListEvents(root, repaint, showMore) {
  const searchForm = root.querySelector('[data-search-form]');
  const platformSelect = root.querySelector('[data-platform-select]');
  const showMoreButton = root.querySelector('[data-show-more]');

  searchForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(searchForm);
    const query = String(formData.get('search') || '').trim();
    navigateTo(query ? `/search/${encodeURIComponent(query)}` : '/');
  });

  platformSelect?.addEventListener('change', (event) => {
    const id = event.target.value;
    navigateTo(id ? `/platform/${encodeURIComponent(id)}` : '/');
  });

  showMoreButton?.addEventListener('click', () => {
    showMore();
    repaint();
  });
}

function buildGameParams(route) {
  const params = {};

  if (route.filter === 'home') {
    const today = new Date();
    const nextYear = new Date(today);
    nextYear.setFullYear(today.getFullYear() + 1);

    params.dates = `${formatDate(today)},${formatDate(nextYear)}`;
    params.ordering = '-added';
  }

  if (route.filter === 'search') params.search = route.value;
  if (route.filter === 'platform') params.platforms = route.value;
  if (route.filter === 'genre') params.genres = route.value;
  if (route.filter === 'tag') params.tags = route.value;
  if (route.filter === 'developer') params.developers = route.value;
  if (route.filter === 'publisher') params.publishers = route.value;

  return params;
}

function getTitle(route) {
  if (route.filter === 'search') return `Search results for "${escapeHtml(route.value)}"`;
  if (route.filter === 'platform') return 'Games by platform';
  if (route.filter === 'genre') return 'Games by genre';
  if (route.filter === 'tag') return 'Games by tag';
  if (route.filter === 'developer') return 'Games by developer';
  if (route.filter === 'publisher') return 'Games by publisher';
  return 'Most anticipated upcoming games';
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
