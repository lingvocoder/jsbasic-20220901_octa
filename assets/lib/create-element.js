// doesn't work for td and some other elements that may not be placed into <div>
export function createElement(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.firstElementChild;
}

