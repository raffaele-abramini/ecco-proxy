import { EccoProxy } from "../src";

const dummyObject = () => ({
  booleanValue: true,
  textualProperty: "hi",
  method: (...args: any) => {
    return "method " + args.join(" ");
  },
});

describe("Get: proxies existing properties", () => {
  let dummyProxy;
  it("correctly proxies a prop", () => {
    dummyProxy = EccoProxy(dummyObject(), {
      booleanValue: (originalProperty) => {
        return String(originalProperty) + " proxied, yes!";
      },
    });
    expect(dummyProxy.booleanValue).toEqual("true proxied, yes!");
  });

  it("returns a prop that's not proxied", () => {
    dummyProxy = EccoProxy(dummyObject(), {});
    expect(dummyProxy.booleanValue).toEqual(true);
  });
});

describe("Get: proxies existing methods", () => {
  let dummyProxy;

  it("correctly invokes a method that's not proxied", () => {
    dummyProxy = EccoProxy(dummyObject(), {});
    expect(dummyProxy.method(1, 2, 3)).toEqual("method 1 2 3");
  });
  it("proxies a method", () => {
    dummyProxy = EccoProxy(dummyObject(), {
      method: (originalArgs, originalMethod) => {
        return originalMethod(...originalArgs.map((n) => n * 2));
      },
    });
    expect(dummyProxy.method(1, 2, 3)).toEqual("method 2 4 6");
  });
});

describe("Get: proxies custom methods", () => {
  const dummyProxy = EccoProxy(
    dummyObject(),
    {
      doSomething: {
        asMethod: (args) => args,
      },
    },
    {}
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

describe("Get: Proxies custom properties", () => {
  const dummyProxy = EccoProxy(dummyObject(), {
    name: {
      asProperty: () => "bubu",
    },
  });

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

describe("Set: proxies custom properties", () => {
  let dummyProxy;
  let spy = jest.fn();
  it("correctly invokes the proxied setter", () => {
    dummyProxy = EccoProxy(
      dummyObject(),
      {},
      {
        textualProperty: (value, setValue) => {
          spy(value);
          setValue("intercepted - " + value);
          return true;
        },
      }
    );

    dummyProxy.textualProperty = "new value";

    expect(spy).toHaveBeenCalledWith("new value");
    expect(dummyProxy.textualProperty).toEqual("intercepted - new value");
  });

  it("correctly invokes the proxied setter that prevents the set action", () => {
    dummyProxy = EccoProxy(
      dummyObject(),
      {},
      {
        textualProperty: () => {
          return false;
        },
      }
    );

    dummyProxy.textualProperty = "a different text";

    expect(dummyProxy.textualProperty).toEqual("hi");
  });

  it("correctly set non-proxied properties", () => {
    dummyProxy = EccoProxy(dummyObject(), {}, {});

    dummyProxy.textualProperty = "hello";

    expect(dummyProxy.textualProperty).toEqual("hello");
  });

  it("correctly set non-proxied properties", () => {
    dummyProxy = EccoProxy(dummyObject(), {}, {});

    dummyProxy.method = () => "hello";

    expect(dummyProxy.method()).toEqual("hello");
  });
});
