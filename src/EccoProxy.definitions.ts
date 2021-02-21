export type ProxiedMethod<T = any> = (
  originalArgs: any[],
  originalMethod: Function,
  originalObject: T
) => any;

export type ProxiedProperty<T extends object = any> = (
  originalProperty: any,
  originalObject: T
) => any;

export enum HandlerType {
  method,
  property,
}
