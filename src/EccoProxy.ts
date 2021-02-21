// noinspection ES6PreferShortImport
import {
  CustomHandlersObject,
  ProxiedGetHandlersObject,
  ProxiedProperty,
  SetProxiedHandlersObject,
} from "./EccoProxy.definitions";

export const EccoProxy = <T extends object, M extends CustomHandlersObject>(
  objectToProxy: T,
  proxiedGetHandlers: ProxiedGetHandlersObject<T> | M,
  proxiedSetHandlers?: SetProxiedHandlersObject<T>
): T & Partial<{ [A in keyof M]: any }> => {
  return new Proxy(objectToProxy, {
    get: function (target, prop: keyof T, receiver) {
      const originalHandler = target[prop];

      // If requested handler exists on the original object
      if (originalHandler) {
        const proxiedHandler = (proxiedGetHandlers as ProxiedGetHandlersObject<T>)[
          prop
        ];

        // If it's a function
        if (typeof originalHandler === "function") {
          // If it has been proxied by user
          if (proxiedHandler) {
            // return a function that..
            return (...args: any[]) => {
              // ..returns the proxied method with args
              return proxiedHandler(
                args,
                Reflect.get(target, prop, receiver),
                receiver
              );
            };
          }
          // if method hasn't been proxied by user, just return the original one.
          return Reflect.get(target, prop, receiver);
        } else {
          // if handler is a property
          // and it has customised by user
          if (proxiedHandler) {
            // invoke the proxied property with arguments
            return (proxiedHandler as ProxiedProperty<T>)(
              originalHandler,
              receiver
            );
          }
          // otherwise just return the original prop
          return target[prop];
        }
      }

      // If the requested method doesn't exist on the original object, check for
      // custom handlers.
      const customHandler = (proxiedGetHandlers as M)[
        prop as keyof typeof proxiedGetHandlers
      ];

      if (customHandler) {
        // if a custom handler has been specified as method
        if (customHandler.asMethod) {
          // return a function that..
          return (...args: any[]) => {
            // ..returns the custom method with args
            return customHandler.asMethod!(args, receiver);
          };
        } else if (customHandler.asProperty) {
          // else invoke the custom property
          return customHandler.asProperty(receiver);
        }
        throw Error(`Invalid custom handler type for '${prop}'`);
      }
    },
    set(target: T, p: PropertyKey, value: any): boolean {
      const proxiedSetHandler =
        proxiedSetHandlers &&
        proxiedSetHandlers[p as keyof SetProxiedHandlersObject<T>];
      if (proxiedSetHandler) {
        proxiedSetHandler(value, (newVal = value) => {
          target[p as keyof T] = newVal;
        });
      } else {
        target[p as keyof T] = value;
      }
      return true;
    },
  });
};
