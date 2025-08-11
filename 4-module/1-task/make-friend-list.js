function makeFriendList(friends) {
  const ul = document.createElement('ul');

  ul.innerHTML = friends
    .map(({firstName, lastName}) => `
      <li>
        <span>${firstName}</span>
        <span>${lastName}</span>
      </li>
    `)
    .join('');

  return ul;
}

export default makeFriendList;

