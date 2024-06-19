function highlight(table) {
  for (let i = 1; i < table.rows.length; i++) {
    let row = table.rows[i];
    for (let j = 0; j < row.cells.length; j++) {
      const td = row.cells[j];
      const text = td.textContent;
      const {available} = td.dataset;

      row.hidden = !td.hasAttribute('data-available');

      if (parseInt(text) <= 18) {
        row.style.textDecoration = 'line-through';
      }
      if (available === 'true') {
        row.classList.add('available');
      } else if (available === 'false') {
        row.classList.add('unavailable');
      }
      row.classList.add(`${text === 'm' ? 'male' : 'female'}`);
    }
  }
}

module.exports = highlight;
