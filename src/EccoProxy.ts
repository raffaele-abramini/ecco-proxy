// noinspection ES6PreferShortImport
import {
  HandlerType,
  ProxiedMethod,
  ProxiedProperty,
} from "./EccoProxy.definitions";

export const EccoProxy = <
  T extends object,
  M extends Partial<{
    [a: string]: {
      type: HandlerType;
      handler: ProxiedMethod | ProxiedProperty;
    };
  }>
>(
  objectToProxy: T,
  proxiedHandlers: Partial<
    {
      [P in keyof T]: T[P] extends Function
        ? ProxiedMethod<T>
        : ProxiedProperty<T>;
    }
  >,
  customHandlers: M = {} as any
): T & Partial<{ [A in keyof M]: any }> => {
  return new Proxy(objectToProxy, {
    get: function (target, prop: keyof T, receiver) {
      const originalHandler = target[prop];
      if (originalHandler) {
        const proxiedHandler = proxiedHandlers[prop];

        if (typeof originalHandler === "function") {
          if (proxiedHandler) {
            return (...args: any[]) => {
              return proxiedHandler(
                args,
                Reflect.get(target, prop, receiver),
                receiver
              );
            };
          }
          return Reflect.get(target, prop, receiver);
        } else {
          if (proxiedHandler) {
            return (proxiedHandler as ProxiedProperty<T>)(
              originalHandler,
              receiver
            );
          }
          return target[prop];
        }
      }

      const customHandler = customHandlers[prop as keyof typeof customHandlers];

      if (customHandler) {
        if (customHandler.type === HandlerType.method) {
          return (...args: any[]) => {
            return customHandler.handler(
              args,
              Reflect.get(target, prop, receiver),
              receiver
            );
          };
        } else if (customHandler.type === HandlerType.property) {
          return (customHandler.handler as ProxiedProperty<T>)(
            originalHandler,
            receiver
          );
        }
        throw Error(`Invalid custom handler type for '${prop}'`);
      }
    },
  });
};
