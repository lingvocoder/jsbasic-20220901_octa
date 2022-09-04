function checkSpam(str) {
  const bet = '1xBet'.toLowerCase();
  const xxx = 'XXX'.toLowerCase();
  return (str.toLowerCase().indexOf(xxx) >= 0 || str.toLowerCase().indexOf(bet) >= 0);
}
