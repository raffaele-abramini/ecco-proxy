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
      booleanValue: (originalValue) => {
        return String(originalValue) + " proxied, yes!";
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
      method: (receivedArgs, originalMethod) => {
        return originalMethod(...receivedArgs.map((n) => n * 2));
      },
    });
    expect(dummyProxy.method(1, 2, 3)).toEqual("method 2 4 6");
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
