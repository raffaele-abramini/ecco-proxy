type ProxiedMethod<T extends object> = (originalArgs: any[], originalMethod: Function, originalObject: T) => any;
type ProxiedProperty<T extends object> = (originalArgs: any[], originalObject: T) => any;

export const EccoProxy = <T extends object>(objectToProxy: T, customHandlers: Partial<Record<keyof T, ProxiedMethod<T>|ProxiedProperty<T>>>) =>{
    return new Proxy(objectToProxy, {
        get: function (target, prop, receiver) {
            if (typeof target[prop] ==="function") {
                if (customHandlers[prop]){
                return (...args) => {
                    return customHandlers[prop](args, Reflect.get(target, prop, receiver), receiver)
                } }
            } else {

            }
        },
    })
}

const TestObj = {
    isActive: false,
    addListener: (...args: any) => {
        console.log("bubu", ...args);
    }
}

const p = EccoProxy(TestObj, {
    addListener: (originalArgs, originalMethod) => {
        originalMethod(...originalArgs);
        console.log("cane", ...originalArgs.map(Math.random));
    },
})

p.addListener(1,2,3);