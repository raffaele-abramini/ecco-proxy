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

## Dynamically react to property changes

Let's imagine you want to know when a property of an object changes, to trigger some side effect.
Here's how you can do it.

````typescript
import { EccoProxy } from "ecco-proxy";

const store = {
    data: "content"
};

const proxiedStore = EccoProxy(store, {}, {
    data: (value, setValue) => {
        // whenever the store.data gets changed, trigger our custom callback
        triggerCallback(value);

        // apply the new value
        setValue(value);

        // return true to indicate success
        return true;
    }
})

export { proxiedStore as store }
````

## Prevent certain properties or methods from being changed

Let's say we have an object with some property that we do not want to mutate.
Here's how to do it

````typescript
import { EccoProxy } from "ecco-proxy";

const store = {
  id: "IDXXX"   
};

const proxiedStore = EccoProxy(store, {}, {
    id: () => {
        console.error("You cannot change the ID of a store")
        
        // do not set any value
        
        // return false to indicate failure
        return false;
    }
})

export { proxiedStore as store }
````