function checkSpam(str) {
  const bet = '1xBet'.toLowerCase();
  const xxx = 'XXX'.toLowerCase();
  return (str.toLowerCase().indexOf(xxx) !== -1 || str.toLowerCase().indexOf(bet) !== -1);
}

export default checkSpam;
