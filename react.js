class InputCell {

  constructor(value) {
    this.value = value;
    this.dependentCells = [];
  }

  setValue(value) {
    this.value = value;
    this.updateDependentCells();
  }

  updateDependentCells() {
    this.dependentCells.forEach(function(item) {
      item.updateCell();
    });
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
    this.fn = fn;
    this.inputArray = inputArray;
    this.value = fn(inputArray);
    this.dependentCells = [];
    this.callbackCells = [];
    for (var i=0; i<inputArray.length; i++) {
      inputArray[i].dependentCells.push(this);
    }
  }

  updateCell() {
    let priorValue = this.value;
    this.value = this.fn(this.inputArray);
    this.updateDependentCells();
    this.updateCallbackCells(priorValue);
  }

  updateDependentCells() {
    this.dependentCells.forEach(function(item) {
      item.updateCell();
    });
  }

  addCallback(callbackCell) {
    this.callbackCells.push(callbackCell);
  }

  updateCallbackCells(priorValue) {
    for (var i=0; i<this.callbackCells.length; i++) {
      let result = this.callbackCells[i].fn(this);
      if (this.value != priorValue)
        this.callbackCells[i].values.push(result);
    }
// *when I use forEach, test fails with this = undefined
//    this.callbackCells.forEach(function(item) {
//      let result = item.fn(this);
//      item.values.push(result);
//    })
  }

  removeCallback(callbackCell) {
    let index = this.callbackCells.indexOf(callbackCell);
    if (index != -1)
      this.callbackCells.splice(index, 1);
  }

}

module.exports = {InputCell, ComputeCell, CallbackCell}
