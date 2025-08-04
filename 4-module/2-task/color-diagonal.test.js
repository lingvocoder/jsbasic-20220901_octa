import colorDiagonal from "./color-diagonal.js";

describe('Функция, которая выделяет красным цветом все ячейки в таблице по диагонали слева направо', () => {
  let table;

  beforeEach(() => {
    table = document.createElement('TABLE');
    table.innerHTML = `
      <tr>
        <td>1:1</td>
        <td>2:1</td>
        <td>3:1</td>
        <td>4:1</td>
        <td>5:1</td>
      </tr>
      <tr>
        <td>1:2</td>
        <td>2:2</td>
        <td>3:2</td>
        <td>4:2</td>
        <td>5:2</td>
      </tr>
      <tr>
        <td>1:3</td>
        <td>2:3</td>
        <td>3:3</td>
        <td>4:3</td>
        <td>5:3</td>
      </tr>
      <tr>
        <td>1:4</td>
        <td>2:4</td>
        <td>3:4</td>
        <td>4:4</td>
        <td>5:4</td>
      </tr>
      <tr>
        <td>1:5</td>
        <td>2:5</td>
        <td>3:5</td>
        <td>4:5</td>
        <td>5:5</td>
      </tr>
    `;
  });

  it('Окрашивает ячейку первой строки в красный цвет', () => {
    colorDiagonal(table);

    let cell = table.rows[0].cells[0];

    expect(cell.style.backgroundColor).toBe('red');
  });

  it('Окрашивает ячейку второй строки в красный цвет', () => {
    colorDiagonal(table);

    let cell = table.rows[1].cells[1];

    expect(cell.style.backgroundColor).toBe('red');
  });

  it('Окрашивает ячейку третьей строки в красный цвет', () => {
    colorDiagonal(table);

    let cell = table.rows[2].cells[2];

    expect(cell.style.backgroundColor).toBe('red');
  });

  it('Окрашивает ячейку четвёртой строки в красный цвет', () => {
    colorDiagonal(table);

    let cell = table.rows[3].cells[3];

    expect(cell.style.backgroundColor).toBe('red');
  });

  it('Окрашивает ячейку пятой строки в красный цвет', () => {
    colorDiagonal(table);

    let cell = table.rows[4].cells[4];

    expect(cell.style.backgroundColor).toBe('red');
  });

});
