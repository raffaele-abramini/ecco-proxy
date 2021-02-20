import { EccoProxy } from "../src";

const TestObj = {
  isActive: false,
  isOnline: true,
  logSomething: (...args: any) => {
    console.log("random", ...args);
  },
  addListener: (...args: any) => {
    console.log("bubu", ...args);
  },
};

const p = EccoProxy(TestObj, {
  addListener: (originalArgs, originalMethod) => {
    console.log("cane", ...originalArgs.map(Math.random));
    return originalMethod(...originalArgs);
  },
  isActive: (originalProperty) => {
    return String(originalProperty);
  },
});

p.addListener(1, 2, 3);
console.log(p.isActive);
console.log(p.isOnline);
p.logSomething(2, 23, 4);
