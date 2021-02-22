export type ProxiedMethod<T = any> = (
  receivedArguments: any[],
  originalMethod: Function,
  originalObject: T
) => any;

export type ProxiedProperty<T extends object = any> = (
  originalValue: any,
  originalObject: T
) => any;

export type ProxiedGetHandlersObject<T extends object> = Partial<
  {
    [P in keyof T]: T[P] extends Function
      ? ProxiedMethod<T>
      : ProxiedProperty<T>;
  }
>;

export type SetProxyHandler = (
  receivedValue: any,
  setValue: (customValue: any) => void
) => boolean;

export type SetProxiedHandlersObject<T extends object> = Partial<
  {
    [P in keyof T]: SetProxyHandler;
  }
>;
