import namify from "./namify";

describe('Функция, которая преобразует исходный массив в массив имён', () => {
  it('Возвращает массив имён', () => {
    let vasya = { name: 'Вася', age: 25 };
    let petya = { name: 'Петя', age: 30 };
    let masha = { name: 'Маша', age: 28 };

    let users = [vasya, petya, masha];
    let names = ['Вася', 'Петя', 'Маша'];

    expect(namify(users)).toEqual(names);
  });
});
