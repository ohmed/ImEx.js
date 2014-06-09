ImEx.js
========

####JavaScript 'import/export' compiler.####

Compiler allows you to use import/export directives and then compile the code to native JavaScript.
It is very lightweight with low complexity.

####Usage####

If you have objects `World.animals`, `World.Animal`<br>
And want to create new object like `World.animals.Dog` you write

```js
namespace World.animals;

import World.Animal;

export Dog = function () {};
Dog.prototype = Object.create( Animal.prototype );
```

instead of crappy long code like

```js
World.animals.Dog = function () {};
World.animals.Dog.prototype = Object.create( World.animals.Animal );
```

If you want to create global variable like World (window.World) you create like

```js
namespace Global;

export World = {};
```

####Instal####

npm install imex -g

####Compiling####

Using npm:
Navigate to your files folder, open your terminal/cmd
```imex --include ../example/in/include.json --out ../example/out/build.js```
Where `include.json` contains the list of files & `build.js` is the generated code destination file.

Manual:
Execute in your cmd [in the folder of compiler util]<br>
```node imex.js --include ../example/in/include.json --out ../example/out/build.js```

Or use ```compiler.cmd``` as in the example.