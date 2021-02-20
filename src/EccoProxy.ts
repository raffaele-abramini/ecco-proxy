// noinspection ES6PreferShortImport
import { ProxiedMethod, ProxiedProperty } from "./EccoProxy.definitions";

export const EccoProxy = <T extends object>(
  objectToProxy: T,
  customHandlers: Partial<
    {
      [P in keyof T]: T[P] extends Function
        ? ProxiedMethod<T>
        : ProxiedProperty<T>;
    }
  >
) => {
  return new Proxy(objectToProxy, {
    get: function (target, prop: keyof T, receiver) {
      const customHandler = customHandlers[prop];

      if (typeof target[prop] === "function") {
        if (customHandler) {
          return (...args: any[]) => {
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
          return (customHandler as ProxiedProperty<T>)(target[prop], receiver);
        }
        return target[prop];
      }
    },
  });
};
