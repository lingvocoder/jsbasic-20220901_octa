function makeDiagonalRed(table) {
  for (let i = 0; i < table.rows.length; i++) {
    let td = table.rows[i].cells[i];
    td.style.background = 'red';
  }
}

module.exports = makeDiagonalRed;
