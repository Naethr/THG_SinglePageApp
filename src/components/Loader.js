export function Loader(label = 'Loading') {
  return `
    <div class="loader" aria-live="polite" aria-busy="true">
      <span class="loader__bar"></span>
      <span class="loader__bar"></span>
      <span class="loader__bar"></span>
      <p>${label}</p>
    </div>
  `;
}
