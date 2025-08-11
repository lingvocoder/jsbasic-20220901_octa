export default function toggleText() {
  const button = document.querySelector('.toggle-text-button');
  const text = document.querySelector('.text-container');
  if (button && text) {
    button.addEventListener('click', () => {
      text.hidden = !text.hidden;
    });
  }
}
