function camelize(str) {
  return str.split('-')
    .map((el, idx) => {
      return idx !== 0 && el !== '' ? el.charAt(0).toUpperCase().concat(el.slice(1)) : el;
    })
    .join('');
}
