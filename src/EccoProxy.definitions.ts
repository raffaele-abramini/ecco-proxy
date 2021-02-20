export type ProxiedMethod<T extends object> = (
  originalArgs: any[],
  originalMethod: Function,
  originalObject: T
) => any;

export type ProxiedProperty<T extends object> = (
  originalProperty: any,
  originalObject: T
) => any;
