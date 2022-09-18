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

  const listItemString = () => friends.map(({firstName, lastName}) => {
    return `
    ${getListItem({firstName, lastName})}
    `;
  }).join('');

  list.innerHTML = listItemString();
  return list;

}
