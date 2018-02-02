class InputCell {

  constructor(value) {
    this.value = value;
  }

  setValue(value) {
    this.value = value;
  }
}

class CallbackCell {

}

class ComputeCell {

  constructor(inputArray, callback) {
    this.value = callback(inputArray);
  }
}


module.exports = {InputCell, ComputeCell, CallbackCell}
