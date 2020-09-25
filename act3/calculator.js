const validOperations = ['+', '-', '/', '*', '%'];

const Calculator = {
  calculate: (op, val1, val2) => {
    const a = parseFloat(val1);
    if (isNaN(a)) {
      throw `${val1} is not a number`;
    }

    const b = parseFloat(val2);
    if (isNaN(b)) {
      throw `${val2} is not a number`;
    }

    if (!validOperations.includes(op)) {
      throw `${op} is not a valid operation`;
    }

    return eval(`${a} ${op} ${b}`);
  },
};

module.exports = Calculator;
