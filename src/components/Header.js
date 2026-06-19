export function Header() {
  return `
    <header class="site-header">
      <a class="brand internal-link" href="/" data-link>
        <span class="brand__mark"></span>
        Game Explorer
      </a>
      <nav class="site-nav" aria-label="Primary navigation">
        <a class="internal-link" href="/" data-link>Upcoming games</a>
      </nav>
    </header>
  `;
}
