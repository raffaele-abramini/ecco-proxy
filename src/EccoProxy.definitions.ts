export type ProxiedMethod<T = any> = (
  originalArgs: any[],
  originalMethod: Function,
  originalObject: T
) => any;

export type ProxiedProperty<T extends object = any> = (
  originalProperty: any,
  originalObject: T
) => any;
export type CustomMethod<T = any> = (
  originalArgs: any[],
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
  value: any,
  setValue: (customValue: any) => void
) => boolean;

export type SetProxiedHandlersObject<T extends object> = Partial<
  {
    [P in keyof T]: SetProxyHandler;
  }
>;
