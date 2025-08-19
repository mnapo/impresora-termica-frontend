
export default function pollCondition(conditionFunction: Function, interval: number, callback: Function) {
  if (conditionFunction()) {
    callback();
  } else {
    setTimeout(() => {
      pollCondition(conditionFunction, interval, callback);
    }, interval);
  }
}