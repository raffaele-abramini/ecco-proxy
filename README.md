# EccoProxy

A helper to proxy object in JS.

## Intro

EccoProxy allows you to interact with existing object. You'll be able to:
- 🚀 trigger side effects on method and property calls
- 🎸 manipulate methods' arguments
- 🥾 overwrite methods and properties 

## Examples

Let's imagine you are using a logging library and you want to make sure that
the all the logs end up as well in your remote server.

This is how you would do it with EccoProxy:

````typescript
import { EccoProxy } from "ecco-proxy";
import { logLibrary } from "logLibrary";

const proxiedLogLibrary = EccoProxy(logLibrary, {
  log: (logs, originalMethod) => {
    // trigger side effects
    shipToServer(logs);
    
    // manipulate arguments
    const prettyLogs = logs.map(makePretty);
    
    // let the original library do its stuff, with the manipulated args
    return originalMethod(...prettyLogs);
  },
});

// now just use this module instead of the original when logging stuff
export { proxiedLogLibrary as logLibrary };
````