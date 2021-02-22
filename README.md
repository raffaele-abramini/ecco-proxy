# EccoProxy

A helper to proxy object in JS.

## Intro

EccoProxy allows you to interact with existing object. You'll be able to:
- 🚀 trigger side effects on method and property calls
- 🎸 manipulate methods' arguments
- 🥾 overwrite methods and properties
- 📝 validate properties before setting them

Here's a [sandbox](https://codesandbox.io/s/ecco-proxy-playground-rghky?file=/src/index.ts) to play with.

## Setup
```
yarn add ecco-proxy
````
or
````
npm install ecco-proxy
````

## Usage


````typescript
import { EccoProxy } from "ecco-proxy";

const proxiedObject = EccoProxy(
    myObject,
    // ⬇️ GET - manipilate what happens when methods and props are invoked 
    {
        methodName: (receivedArguments, originalMethod, originalObject) => {},
        propertyName: (originalValue, originalObject) => {},
    },
    // ⬇️ SET - manipilate what happens when methods and props overwritten
    {
        otherPropertyName: (receivedValue, setValue) => {}
    });
````


## Examples

### Intercepting and add manipulating 'console' methods
Let's imagine you want to make sure that the all the logs
of your application get stored in your remote server.

This is how you would do it with EccoProxy:

````typescript
import { EccoProxy } from "ecco-proxy";

const proxiedConsole = EccoProxy(window.console, {
  error: (receivedArguments, originalMethod) => {
    // trigger side effects
    shipToServer(receivedArguments);
    
    // manipulate arguments
    const prettyErrors = receivedArguments.map(makePretty);
    
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
    data: (receivedValue, setValue) => {
        // whenever the store.data gets changed, trigger our custom callback
        triggerCallback(receivedValue);

        // apply the new value
        setValue(receivedValue);

        // return true to indicate success
        return true;
    }
})

export { proxiedStore as store }
````

## Add validation to property set

Let's say we have an object with some property that we do not want to mutate.
Here's how to do it

````typescript
import { EccoProxy } from "ecco-proxy";

const store = {
    maxSize: 100
};

const proxiedStore = EccoProxy(store, {}, {
    maxSize: (receivedValue, setValue) => {
        const number = Number(receivedValue);
        if (isNaN(receivedValue) || !Number.isInteger(number) || number < 0) {
            console.error("store.maxSize has to be a integer, positive number")
            return false;
        }

        // otherwise set the number
        setValue();

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