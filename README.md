# EccoProxy

A helper to proxy object in JS.

## Intro

EccoProxy allows you to interact with existing object. You'll be able to:
- 🚀 trigger side effects on method and property calls
- 🎸 manipulate methods' arguments
- 🥾 overwrite methods and properties 

Here's a [sandbox](https://codesandbox.io/s/ecco-proxy-playground-rghky?file=/src/index.ts) to play with.

## Examples


### Intercepting and add manipulating 'console' methods
Let's imagine you want to make sure that the all the logs
of your application get stored in your remote server.

This is how you would do it with EccoProxy:

````typescript
import { EccoProxy } from "ecco-proxy";

const proxiedConsole = EccoProxy(window.console, {
  error: (errors, originalMethod) => {
    // trigger side effects
    shipToServer(errors);
    
    // manipulate arguments
    const prettyErrors = errors.map(makePretty);
    
    // let the original library do its stuff, with the manipulated args
    return originalMethod(...prettyErrors);
  },
});

// now just use this module instead of the original when logging stuff
window.console = proxiedConsole
````

## Manipulate API of an existing library

In this example we are adding a new shortcut method to the Client of a dummy library.
This library exposed my default a triggerEvent method. This method always requires a piece of data that
doesn't really change.

So for our commodity, we are adding a triggerEventWithPredefinedData method that passes an initial piece of data
to the original method.
````typescript
// in ProxiedClient.ts
import { EccoProxy } from "ecco-proxy";
import { MyClient } from "my-library"

const ProxiedClient = EccoProxy(MyClient, {}, {
    triggerEventWithSecret: {
        asMethod: (args, MyClient) => {
            MyClient.triggerEvent(process.env.secret, ...args)
        }
    } 
});

// now just use this module instead of the original when logging stuff
export { ProxiedClient as MyClient }
````
Now in my our files we can import the proxyed library and get our new method:
````typescript
// in index.ts
import { MyClient } from "./proxiedClient"

const doThings = (id, attributes) => {
    MyClient.triggerEventWithSecret(id, attributes)
};
````

Easy peasy.