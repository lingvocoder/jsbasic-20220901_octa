function makeFriendsList(friends) {
  const list = document.createElement('ul');
  const getListItem = ({firstName, lastName}) => {
    return `
            <li>
               <span>${firstName}</span>
               <span>${lastName}</span>
            </li>
            `;
  };

  list.innerHTML = friends.map(({firstName, lastName}) => `${getListItem({firstName, lastName})}`).join('');
  return list;

}
