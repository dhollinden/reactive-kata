class InputCell {

  constructor(value) {
    this.value = value;
    this.dependentCells = [];
  }

  setValue(value) {
    this.value = value;
    this.saveDependentCellValues();
  }

  saveDependentCellValues() {
    this.dependentCells.forEach(function(item) { item.saveCellValue(); });
    this.updateDependentCells();
  }

  updateDependentCells() {
    this.dependentCells.forEach(function(item) { item.updateCell(); });
    this.updateCallbackCells();
  }

  updateCallbackCells() {
    this.dependentCells.forEach(function(item) { item.updateCallbackCells(); });
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
    this.inputArray.forEach(function(item) { item.dependentCells.push(this); }, this)
  }

  saveCellValue() {
    this.savedValue = this.value;
    this.saveDependentCellValues();
  }

  saveDependentCellValues() {
    this.dependentCells.forEach(function(item) { item.saveCellValue(); })
  }

  updateCell() {
    this.value = this.fn(this.inputArray);
    this.updateDependentCells();
  }

  updateDependentCells() {
    this.dependentCells.forEach(function(item) { item.updateCell(); });
  }

  updateCallbackCells() {
    if (this.value !== this.savedValue) { // check if ComputeCell value has changed
      this.callbackCells.forEach(function(e) {
        let newCallbackValue = e.fn(this);
        let currentCallbackValue = e.values[e.values.length - 1];
        if (newCallbackValue !== currentCallbackValue) { //check if CallbackCell needs to be updated
          e.values.push(newCallbackValue);
        }
      }, this)
    }
    this.updateDependentCallbackCells();
  }

  updateDependentCallbackCells() {
    this.dependentCells.forEach(function(item) { item.updateCallbackCells(); })
  }

  addCallback(callbackCell) { this.callbackCells.push(callbackCell); }

  removeCallback(callbackCell) {
    let index = this.callbackCells.indexOf(callbackCell);
    if (index !== -1)
      this.callbackCells.splice(index, 1);
  }

}

module.exports = {InputCell, ComputeCell, CallbackCell}
