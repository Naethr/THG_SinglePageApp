export function SearchBar(currentValue = '') {
  return `
    <form class="search-bar" data-search-form>
      <label for="search">Search games</label>
      <div class="search-bar__row">
        <input
          id="search"
          name="search"
          type="search"
          value="${escapeAttribute(currentValue)}"
          placeholder="Game title, series, keyword"
        />
        <button type="submit">Search</button>
      </div>
    </form>
  `;
}

function escapeAttribute(value) {
  return String(value || '').replaceAll('"', '&quot;');
}
