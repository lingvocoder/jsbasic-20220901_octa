function toggleText() {
  const button = document.querySelector('.toggle-text-button');
  const text = document.querySelector('.text-container');
  button.addEventListener('click', () => {
    text.hidden = !text.hidden;
  });
}

module.exports = toggleText;
