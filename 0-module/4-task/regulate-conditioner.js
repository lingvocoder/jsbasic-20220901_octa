function setConditioner(tRoom, tCond, mode) {

  let tr = -50 <= tRoom <= 50 ? tRoom : 0;
  let tc = -50 <= tCond <= 50 ? tCond : 0;

  if (mode === 'heat' && tr <= tc) {
    return tc;
  }

  if (mode === 'freeze' && tr >= tc) {
    return tc;
  }

  if (mode === 'auto') {
    if (tr <= tc || tr >= tc) {
      return tc;
    }
  }

  if (mode === 'fan') {
    return tr;
  } else {
    return tr;
  }
}

export default setConditioner;
