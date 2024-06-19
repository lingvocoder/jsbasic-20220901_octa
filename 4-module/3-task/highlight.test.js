const highlight = require('./index');

describe('Функция, которая вносит изменения в таблицу', () => {
  it('Подставляет класс available/unavailable, в зависимости от значения атрибута data-available у ячейки Status', () => {
    const table = document.createElement('table');

    table.innerHTML = `
            <thead>
                <tr>
                    <td>Name</td>
                    <td>Age</td>
                    <td>Gender</td>
                    <td>Status</td>
                </tr>
            </thead>
            <tbody>
                <tr class="js-first">
                    <td>Ilia</td>
                    <td>30</td>
                    <td>m</td>
                    <td data-available="true">Free</td>
                </tr>
                <tr class="js-second">
                    <td>Ilia</td>
                    <td>30</td>
                    <td>m</td>
                    <td data-available="false">Not free</td>
                </tr>
            </tbody>
        `;

    highlight(table);
    expect(table.querySelector('.js-first').classList.contains('available')).toEqual(true);
    expect(table.querySelector('.js-first').classList.contains('unavailable')).toEqual(false);

    expect(table.querySelector('.js-second').classList.contains('available')).toEqual(false);
    expect(table.querySelector('.js-second').classList.contains('unavailable')).toEqual(true);
  });

  it('Подставляет атрибут hidden, если атрибут data-available отсутствует', () => {
    const table = document.createElement('table');

    table.innerHTML = `
            <thead>
                <tr>
                    <td>Name</td>
                    <td>Age</td>
                    <td>Gender</td>
                    <td>Status</td>
                </tr>
            </thead>
            <tbody>
                <tr class="js-first">
                    <td>Ilia</td>
                    <td>30</td>
                    <td>m</td>
                    <td>Unknown</td>
                </tr>
            </tbody>
        `;

    highlight(table);
    expect(table.querySelector('.js-first').hasAttribute('hidden')).toEqual(true);
  });

  it('Подставляет класс male/female, в зависимости от содержимого ячейки Gender', () => {
    const table = document.createElement('table');

    table.innerHTML = `
            <thead>
                <tr>
                    <td>Name</td>
                    <td>Age</td>
                    <td>Gender</td>
                    <td>Status</td>
                </tr>
            </thead>
            <tbody>
                <tr class="js-first">
                    <td>Ilia</td>
                    <td>30</td>
                    <td>m</td>
                    <td>Unknown</td>
                </tr>
                <tr class="js-second">
                    <td>Anastasia</td>
                    <td>30</td>
                    <td>f</td>
                    <td>Unknown</td>
                </tr>
            </tbody>
        `;

    highlight(table);
    expect(table.querySelector('.js-first').classList.contains('male')).toEqual(true);
    expect(table.querySelector('.js-second').classList.contains('female')).toEqual(true);
  });

  it('Устанавливает inline-стиль style="text-decoration: line-through", если значение ячейки Age меньше 18', () => {
    const table = document.createElement('table');

    table.innerHTML = `
            <thead>
                <tr>
                    <td>Name</td>
                    <td>Age</td>
                    <td>Gender</td>
                    <td>Status</td>
                </tr>
            </thead>
            <tbody>
                <tr class="js-first">
                    <td>Ilia</td>
                    <td>30</td>
                    <td>m</td>
                    <td>Unknown</td>
                </tr>
                <tr class="js-second">
                    <td>Anastasia</td>
                    <td>16</td>
                    <td>f</td>
                    <td>Unknown</td>
                </tr>
            </tbody>
        `;

    highlight(table);
    expect(table.querySelector('.js-first').style.textDecoration).toEqual('');
    expect(table.querySelector('.js-second').style.textDecoration).toEqual('line-through');
  });
});
