# Package Sorter

> A function used for monorepos production build.

When you have projects depend on each other. You have to build core first, then
the project depends on it and so on. You probably want this step to be automated
so you can use: `package-sorter(unsortedPackages, coreDependency)`.

If `coreDependency` is not passed, `package-sorter` will extract it as `@coreDep/`.

```bash
npm install package-sorter
```

### Example:

```js
import packageSorter from "package-sorter";

// packages in your monorepo:

const pkg0 = {
  name: "@folo/withcontext",
  dependencies: {}
};

const pkg1 = {
  name: "@folo/values",
  dependencies: {
    "@folo/withcontext": "^0.1.5"
  }
};

const pkg2 = {
  name: "@folo/utils",
  dependencies: {}
};

const pkg3 = {
  name: "@folo/layout",
  dependencies: {
    "@folo/withcontext": "^0.1.5"
  }
};

const pkg4 = {
  name: "@folo/forms",
  dependencies: {
    "@folo/layout": "^0.1.4",
    "@folo/values": "^0.1.4"
  }
};

const unsortedPackages = [pkg1, pkg2, pkg3, pkg0, pkg4];

// our core dependency in this case is: @folo.
const sorted = sortPackages(unsortedPackages, "@folo");

//=> [pkg2, pkg0, pkg1, pkg4, pkg3]
```

## Tests

```sh
npm test
```

## License

This project is licensed under the [GPL-3.0 License](https://github.com/jalal246/packageSorter/blob/master/LICENSE)
