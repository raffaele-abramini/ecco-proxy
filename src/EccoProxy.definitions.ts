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

export type CustomProperty<T extends object = any> = (originalObject: T) => any;

export enum asHandlerType {
  asMethod = "asMethod",
  asProperty = "asProperty",
}

export type ProxiedHandlersObject<T extends object> = Partial<
  {
    [P in keyof T]: T[P] extends Function
      ? ProxiedMethod<T>
      : ProxiedProperty<T>;
  }
>;

export type CustomHandlersObject = Partial<{
  [a: string]: Partial<
    {
      [HT in asHandlerType]: HT extends asHandlerType.asMethod
        ? CustomMethod
        : CustomProperty;
    }
  >;
}>;

export type SetProxyHandler = (
  value: any,
  setValue: (customValue: any) => void
) => boolean;

export type SetProxiedHandlersObject<T extends object> = Partial<
  {
    [P in keyof T]: SetProxyHandler;
  }
>;
