# npm

The package.json file describes the npm dependencies needed for this project.
Executing `npm install` will download the necessary dependencies into the `node_modules` directory.

Dependencies:

| Dependency                | Description                                      |
| ------------------------- | ------------------------------------------------ |
| grunt                     | JavaScript task runner used to build the project |
| grunt-node-webkit-builder | Grunt plugin to build node-webkit apps           |
| node-localstorage         | Used to store json to disk                       |
| jfs                       | JSON file store                                  |

# Custom node modules

The custom node modules written for rsync-ui, can be found under the public/node_modules directory.
Why is this? Well, in order to be able to unit test the modules, you either need to define
a relative reference or the module must be defined in a node_modules directory where
npm can resolve the module. Relative urls would be the preferred solution. There is a problem however at runtime
in node-webkit.

Node webkit knows the require function, but you can only use it to resolve node_modules or dependencies relative
to the root of your application. This however is not the same relative path as you need when you are testing
the module.

That's why the simplest solution is to define them in a node_modules directory. Do you know a better solution,
let me know.

References:

[Node webkit / Using Node Modules](https://github.com/rogerwang/node-webkit/wiki/Using-Node-modules)

[Node webkit / Differences of JavaScript context](https://github.com/rogerwang/node-webkit/wiki/Differences-of-JavaScript-contexts)

[Where does node js and require look for modules](http://www.bennadel.com/blog/2169-where-does-node-js-and-require-look-for-modules.htm)