export default function highlight(table) {
  for (let i = 1; i < table.rows.length; i++) {
    let row = table.rows[i];

    // Данные из конкретных ячеек
    const age = parseInt(row.cells[1].textContent);
    const gender = row.cells[2].textContent;
    const statusCell = row.cells[3];
    console.log(statusCell.dataset);

    const {available} = statusCell.dataset;
    row.hidden = !statusCell.hasAttribute('data-available');
    row.classList.add(available === 'true' ? 'available' : 'unavailable');
    row.classList.add(gender === 'm' ? 'male' : 'female');

    if (age <= 18) {
      row.style.textDecoration = 'line-through';
    }
  }
}

