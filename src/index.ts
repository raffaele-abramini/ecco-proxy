type ProxiedMethod<T extends object> = (
  originalArgs: any[],
  originalMethod: Function,
  originalObject: T
) => any;

type ProxiedProperty<T extends object> = (
  originalProperty: any,
  originalObject: T
) => any;

export const EccoProxy = <T extends object>(
  objectToProxy: T,
  customHandlers: Partial<
    Record<keyof T, ProxiedMethod<T> | ProxiedProperty<T>>
  >
) => {
  return new Proxy(objectToProxy, {
    get: function (target, prop, receiver) {
      const customHandler = customHandlers[prop];

      if (typeof target[prop] === "function") {
        if (customHandler) {
          return (...args) => {
            return customHandler(
              args,
              Reflect.get(target, prop, receiver),
              receiver
            );
          };
        }
        return Reflect.get(target, prop, receiver);
      } else {
        if (customHandler) {
          return customHandler(target[prop], receiver);
        }
        return target[prop];
      }
    },
  });
};

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
