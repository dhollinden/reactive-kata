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
    this.storeDependentCells();
    this.priorValue;
  }

  storeDependentCells() {
    for (var i=0; i<this.inputArray.length; i++) {
      this.inputArray[i].dependentCells.push(this);
    }
  }

  updateCell() {
    this.priorValue = this.value;
    this.value = this.fn(this.inputArray);
    this.updateDependentCells();
  }

  updateDependentCells() {
    this.dependentCells.forEach(function(item) { item.updateCell(); });
  }

  updateCallbackCells() {
    if (this.value != this.priorValue) {
      for (var i=0; i<this.callbackCells.length; i++) {
        let result = this.callbackCells[i].fn(this);
        if (result != this.callbackCells[i].values[this.callbackCells[i].values.length - 1]) {
          this.callbackCells[i].values.push(result);
        }
      }
    }
    this.updateDependentCallbackCells();
  }

  updateDependentCallbackCells() {
    this.dependentCells.forEach(function(item) {
      item.updateCallbackCells();
    })
  }

  addCallback(callbackCell) {
    this.callbackCells.push(callbackCell);
  }

  removeCallback(callbackCell) {
    let index = this.callbackCells.indexOf(callbackCell);
    if (index != -1)
      this.callbackCells.splice(index, 1);
  }

// *when I use forEach in updateCallbackCells, it fails with this = undefined
//    this.callbackCells.forEach(function(item) {
//      let result = item.fn(this);
//      item.values.push(result);
//    })

}

module.exports = {InputCell, ComputeCell, CallbackCell}
