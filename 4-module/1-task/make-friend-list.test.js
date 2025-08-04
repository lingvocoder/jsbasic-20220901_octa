import makeFriendList from "./make-friend-list.js";

describe('Функция, которая преобразует переданный в качестве аргумента массив объектов в стандартный HTML список, состоящий из тегов ul и li', () => {
  const friends = [
    {
      firstName: 'Artsiom',
      lastName: 'Mezin',
    },
    {
      firstName: 'Ilia',
      lastName: 'Kantor',
    },
    {
      firstName: 'Christopher',
      lastName: 'Michael',
    },
  ];

  it('Возвращает ненумерованный список, представленный объектом HTMLUListElement', () => {
    const ul = makeFriendList(friends);
    expect(ul && ul.constructor).toEqual(HTMLUListElement, 'Результат вызова функции не HTMLUListElement');
  });

  it('Число элементов в списке и число объектов в массиве должны быть одинаковыми', () => {
    const ul = makeFriendList(friends);
    const listItems = ul.querySelectorAll('li');

    expect(listItems.length).toEqual(friends.length, 'Отличается длина списка и длина массива данных');
  });

  it('Содержимое элементов списка должно соответствовать именам и фамилиям друзей из массива объектов', () => {
    const ul = makeFriendList(friends);
    const listItems = ul.querySelectorAll('li');

    listItems.forEach((li, index) => {
      const firstName = li.innerHTML.includes(friends[index].firstName);
      const lastName = li.innerHTML.includes(friends[index].lastName);

      expect(firstName).toEqual(true);
      expect(lastName).toEqual(true);
    });
  });
});
