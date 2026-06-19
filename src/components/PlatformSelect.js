export function PlatformSelect(platforms = [], selectedId = '') {
  const options = platforms
    .map((platform) => {
      const selected = String(platform.id) === String(selectedId) ? 'selected' : '';
      return `<option value="${platform.id}" ${selected}>${platform.name}</option>`;
    })
    .join('');

  return `
    <div class="platform-select">
      <label for="platform">Platform</label>
      <select id="platform" name="platform" data-platform-select>
        <option value="">All platforms</option>
        ${options}
      </select>
    </div>
  `;
}
