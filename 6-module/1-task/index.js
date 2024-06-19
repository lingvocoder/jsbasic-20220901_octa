/**
 * Компонент, который реализует таблицу
 * с возможностью удаления строк
 *
 * Пример одного элемента, описывающего строку таблицы
 *
 *      {
 *          name: 'Ilia',
 *          age: 25,
 *          salary: '1000',
 *          city: 'Petrozavodsk'
 *      }
 *
 */
class UserTable {
  elem = null;

  constructor(rows = []) {
    this.data = rows;
    this.render();
  }

  template() {
    return `
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Имя</th>
                            <th>Возраст</th>
                            <th>Зарплата</th>
                            <th>Город</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.data.map(item => {
                          return this.getTableRow(item);
                        }).join("")}
                    </tbody>
                </table>
            </div>
    `;
  }

  getTableRow = ({name, age, salary, city}) => {
    const action = 'remove';

    return `
             <tr>
                 <td>${name}</td>
                 <td>${age}</td>
                 <td>${salary}</td>
                 <td>${city}</td>
                 <td>
                 <button data-action="${action}">X</button>
                 </td>
             </tr>
            `;
  };

  render() {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = this.template();
    this.elem = wrapper.firstElementChild;
    this.elem.addEventListener('click', this.onDeleteBtnClick);
  }

  onDeleteBtnClick = (ev) => {
    const {target} = ev;

    if (target.dataset.action !== 'remove') {
      return;
    }
    const row = target.closest('tr');
    if (!row) {
      return;
    }
    row.remove();
  };
}

module.exports = UserTable;
