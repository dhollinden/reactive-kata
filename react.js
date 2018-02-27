class InputCell {

  constructor(value) {
    this.value = value;
    this.dependentCells = [];
  }

  setValue(value) {
    this.value = value;
    this.dependentCells.forEach(item => item.react("save current values"));
    this.dependentCells.forEach(item => item.react("update compute cells"));
    this.dependentCells.forEach(item => item.react("update callback cells"));
  }

}

class CallbackCell {

  constructor(fn) {
    this.fn = fn;
    this.values = [];
  }

}

class ComputeCell {

  constructor(inputArray, fn) {
    this.inputArray = inputArray;
    this.fn = fn;
    this.value = fn(inputArray);

    this.dependentCells = [];
    this.callbackCells = [];
    this.savedValue = "";

    this.storeDependencies();
  }

  storeDependencies() {
    this.inputArray.forEach(item => item.dependentCells.push(this));
  }

  react(action) {
    if (action === "save current values")
      this.saveCellValue()
    else if (action === "update compute cells")
      this.updateCell()
    else if (action === "update callback cells")
      this.updateCallbackCells()
  }

  saveCellValue() {
    this.savedValue = this.value;
    this.dependentCells.forEach(item => item.react("save current values"));
  }

  updateCell() {
    this.value = this.fn(this.inputArray);
    this.dependentCells.forEach(item => item.react("update compute cells"));
  }

  updateCallbackCells() {
    if (this.value !== this.savedValue) { // check if ComputeCell value has changed
      this.callbackCells.forEach(item => {
        let newCallbackValue = item.fn(this);
        let currentCallbackValue = item.values[item.values.length - 1];
        if (newCallbackValue !== currentCallbackValue) { //check if CallbackCell needs to be updated
          item.values.push(newCallbackValue);
        }
      })
    }
    this.dependentCells.forEach(item => item.react("update callback cells"));
  }

  addCallback(callbackCell) { this.callbackCells.push(callbackCell); }

  removeCallback(callbackCell) {
    let index = this.callbackCells.indexOf(callbackCell);
    if (index !== -1)
      this.callbackCells.splice(index, 1);
  }

}

module.exports = {InputCell, ComputeCell, CallbackCell}
