function makeDiagonalRed(table) {
  for (let i = 0; i < table.rows.length; i++) {
    let row = table.rows[i];
    for (let j = 0; j < row.cells.length; j++) {
      let td = row.cells[j];
      if (j === i) {
        td.style.background = 'red';
      }
    }
  }
}
