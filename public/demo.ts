import { EccoProxy } from "../src";
import { HandlerType } from "../src/EccoProxy.definitions";

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

const customH = {
  newMethod: {
    type: HandlerType.method,
    handler: (originalArgs, originalMethod, originalObject) => {
      console.log(originalArgs);
    },
  },
  newProperty: {
    type: HandlerType.property,
    handler: () => {
      return "cane";
    },
  },
};

const p = EccoProxy(
  TestObj,
  {
    addListener: (originalArgs, originalMethod) => {
      console.log("cane", ...originalArgs.map(Math.random));
      return originalMethod(...originalArgs);
    },
    isActive: (originalProperty) => {
      return String(originalProperty);
    },
  },
  customH
);

p.addListener(1, 2, 3);
console.log(p.isActive);
console.log(p.isOnline);
p.logSomething(2, 23, 4);

p.newMethod(1, 2, 3);
console.log(p.newProperty);
