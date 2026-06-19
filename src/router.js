import { Header } from './components/Header';
import { PageList } from './pages/PageList';
import { PageDetail } from './pages/PageDetail';

let rootElement = null;

export function navigateTo(path) {
  if (window.location.pathname + window.location.search === path) return;
  window.history.pushState({}, '', path);
  renderRoute();
}

export function initRouter(root) {
  rootElement = root;

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[data-link]');
    if (!link) return;

    const url = new URL(link.href);
    if (url.origin !== window.location.origin) return;

    event.preventDefault();
    navigateTo(`${url.pathname}${url.search}`);
  });

  window.addEventListener('popstate', renderRoute);
  renderRoute();
}

function getRoute() {
  const pathname = window.location.pathname;
  const segments = pathname.split('/').filter(Boolean);
  const params = new URLSearchParams(window.location.search);

  if (segments[0] === 'game' && segments[1]) {
    return { name: 'detail', slug: decodeURIComponent(segments[1]) };
  }

  if (segments[0] === 'search' && segments[1]) {
    return { name: 'list', filter: 'search', value: decodeURIComponent(segments.slice(1).join('/')) };
  }

  const supportedFilters = ['platform', 'genre', 'tag', 'developer', 'publisher'];
  if (supportedFilters.includes(segments[0]) && segments[1]) {
    return { name: 'list', filter: segments[0], value: decodeURIComponent(segments[1]) };
  }

  if (params.get('search')) {
    return { name: 'list', filter: 'search', value: params.get('search') };
  }

  return { name: 'list', filter: 'home', value: null };
}

async function renderRoute() {
  if (!rootElement) return;

  const route = getRoute();
  rootElement.innerHTML = `${Header()}<main id="page" class="page"></main>`;
  const page = rootElement.querySelector('#page');

  if (route.name === 'detail') {
    await PageDetail(page, route.slug);
    return;
  }

  await PageList(page, route);
}
