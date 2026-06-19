export function ErrorMessage(message) {
  return `
    <section class="message message--error" role="alert">
      <h2>Something went wrong</h2>
      <p>${escapeHtml(message)}</p>
    </section>
  `;
}

export function EmptyMessage(message) {
  return `
    <section class="message">
      <h2>No games found</h2>
      <p>${escapeHtml(message)}</p>
    </section>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
