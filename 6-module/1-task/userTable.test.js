const UserTable = require('./index');

describe('Класс, который создаёт таблицу с переданными данными', () => {
  let userTable;
  let clickEvent;

  beforeEach(() => {
    clickEvent = new MouseEvent('click', {bubbles: true});

    let rows = [
      {
        name: 'Вася',
        age: 25,
        salary: 1000,
        city: 'Самара'
      },
      {
        name: 'Петя',
        age: 30,
        salary: 1500,
        city: 'Москва'
      }
    ];

    userTable = new UserTable(rows);

    document.body.append(userTable.elem);
  });

  afterEach(() => {
    userTable.elem.remove();
  });

  it('[При каждом обращении возвращает один и тот же элемент, сохраненный в свойстве elem', () => {
    const elementFirstCall = userTable.elem;
    const elementSecondCall = userTable.elem;

    expect(elementFirstCall).toBe(elementSecondCall);
  });

  it('Количество строк созданной таблицы соответствует длине переданного в качестве аргумента массива объектов', () => {
    let rowsInHTMLLength = userTable.elem.querySelectorAll('tbody tr').length;

    expect(rowsInHTMLLength).toBe(2);
  });

  it('При нажатии кнопки строка удаляется', () => {
    let buttons = userTable.elem.querySelectorAll('button');

    buttons[0].dispatchEvent(clickEvent);
    buttons[1].dispatchEvent(clickEvent);

    expect(userTable.elem.querySelector('tbody tr')).toBeNull();
  });
});
