let calculator = {
  read(a, b) {
    this.a = parseFloat(a);
    this.b = parseFloat(b);
  },
  sum() {
    return this.a + this.b;
  },
  multiply() {
    return this.a * this.b;
  }
};

export default calculator;
