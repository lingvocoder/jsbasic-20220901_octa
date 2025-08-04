function hideSelf() {
  const btn = document.querySelector('.hide-self-button');
  btn.addEventListener('click', () => {
    btn.hidden = !btn.hidden;
  });
}

export default hideSelf;
