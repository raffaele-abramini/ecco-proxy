import { EccoProxy } from "../src";

const TestObj = {
  isActive: false,
  isOnline: true,
  logSomething: (...args: any) => {
    console.log("random", ...args);
  },
  addListener: (...args: any) => {
    console.log("bubu", ...args);
  },
  somethingElse: true,
};

const p = EccoProxy(
  TestObj,
  {
    addListener: (receivedArguments, originalMethod) => {
      console.log("cane", ...receivedArguments.map(Math.random));
      return originalMethod(...receivedArguments);
    },
    isActive: (receivedArguments) => {
      return String(receivedArguments);
    },
  },
  {
    somethingElse: (receivedArgument, setVal) => {
      setVal(String(receivedArgument) + " oppla");
      return true;
    },
  }
);

p.addListener(1, 2, 3);
console.log(p.isActive);
console.log(p.isOnline);
p.logSomething(2, 23, 4);

const shipToServer = (errors: string[]) => {
  document.getElementById("errors")!.innerHTML += `${errors
    .map((a) => `<li>${a}</li>`)
    .join("")}`;
};
const makePretty = (a: string) => `${new Date().toLocaleString()} - ${a}`;

const proxiedConsole = EccoProxy(window.console, {
  error: (errors, originalMethod) => {
    // manipulate arguments
    const prettyErrors = errors.map(makePretty);

    // trigger side effects
    shipToServer(prettyErrors);

    // let the original library do its stuff, with the manipulated args
    return originalMethod(...prettyErrors);
  },
});

// now just use this module instead of the original when logging stuff
window.console = proxiedConsole;

console.error("Here's the first error. Try to add more via console.error");

p.somethingElse = false;

console.error(p.somethingElse);
