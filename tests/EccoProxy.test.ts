import { EccoProxy } from "../src";

const dummyObject = {
  booleanValue: true,
  method: (...args: any) => {
    return "method " + args.join(" ");
  },
};

describe("proxies properties", () => {
  let dummyProxy;
  it("correctly proxies a prop", () => {
    dummyProxy = EccoProxy(dummyObject, {
      booleanValue: (originalProperty) => {
        return String(originalProperty) + " proxied, yes!";
      },
    });
    expect(dummyProxy.booleanValue).toEqual("true proxied, yes!");
  });

  it("returns a prop that's not proxied", () => {
    dummyProxy = EccoProxy(dummyObject, {});
    expect(dummyProxy.booleanValue).toEqual(true);
  });
});

describe("ProxyMethods", () => {
  let dummyProxy;

  it("correctly invokes a method that's not proxied", () => {
    dummyProxy = EccoProxy(dummyObject, {});
    expect(dummyProxy.method(1, 2, 3)).toEqual("method 1 2 3");
  });
  it("proxies a method", () => {
    dummyProxy = EccoProxy(dummyObject, {
      method: (originalArgs, originalMethod) => {
        return originalMethod(...originalArgs.map((n) => n * 2));
      },
    });
    expect(dummyProxy.method(1, 2, 3)).toEqual("method 2 4 6");
  });
});

describe("Invoke custom methods", () => {
  const dummyProxy = EccoProxy(
    dummyObject,
    {},
    {
      doSomething: {
        asMethod: (args) => args,
      },
    }
  );

  it("correctly invokes a method that's not proxied", () => {
    expect(dummyProxy.doSomething(1, true, "a")).toEqual([1, true, "a"]);
  });

  it("still throws for non-existing, not-added methods", () => {
    expect(() => {
      // @ts-ignore line
      dummyProxy.doSomethingElse();
    }).toThrowError();
  });
});

describe("Invoke custom properties", () => {
  const dummyProxy = EccoProxy(
    dummyObject,
    {},
    {
      name: {
        asProperty: () => "bubu",
      },
    }
  );

  it("correctly invokes a method that's not proxied", () => {
    expect(dummyProxy.name).toEqual("bubu");
  });

  it("returns undefined for non-existing, not-added properties", () => {
    expect(
      // @ts-ignore line
      dummyProxy.surname
    ).toBeUndefined();
  });
});
