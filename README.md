# Package Sorter

> A function sorts a group of packages that depends on each other :nerd_face:

When you have projects depend on each other. You have to build core first, then
the project depends on it, and so on. You probably want this step to be automated
so you can use `package-sorter(unsortedPackages[], coreDependency)`.

```bash
npm install package-sorter
```

## API

```js
/**
 * @param {Array} [packages=[]] - packages in workspace.
 * @param {string} coreDependency - core package that other packages depends on it.
 *
 * @returns {Object} result
 * @returns {Array} result.sorted
 * @returns {Array} result.unSorted
 */
const { sorted, unSorted } = packageSorter(packages, coreDependency);
```

If `coreDependency` is not passed, `package-sorter` will extract it following
monorepo naming pattern as: `@coreDep/`

> Why returns `unSorted`?
> Just in case, packages are missing the main dependency will be added to
> unSorted. Then you can figure out what's missing before production.

### Example (1) - All Sorted

```js
import packageSorter from "package-sorter";

// input packages:
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
  name: "@folo/layout",
  dependencies: {
    "@folo/values": "^0.1.5"
  }
};

const packages = [pkg2, pkg1, pkg0];

// our core dependency in this case is: @folo.
const { sorted, unSorted } = sortPackages(packages, "@folo");

// sorted: [pkg0, pkg1, pkg2];
// unSorted: []
```

### Example (2) - Mixed Packages

```js
import packageSorter from "package-sorter";

// input packages:
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
  name: "unrelated",
  dependencies: {}
};

const packages = [pkg2, pkg1, pkg0];

// let's the function get core dependency.
const { sorted } = sortPackages(packages);

// sorted: [pkg2, pkg0, pkg1]
// unSorted: []
```

### Example (3) - Some Unsorted

```js
import packageSorter from "package-sorter";

// input packages:
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
  name: "@folo/unsortable",
  dependencies: {
    "@folo/missing": "^0.1.5"
  }
};

const packages = [pkg2, pkg1, pkg0];

const { sorted } = sortPackages(packages);

// sorted: [pkg0, pkg1]
// unSorted: [pkg2]
```

### Related projects

- [move-position](https://github.com/jalal246/move-position) - Moves element
  index in given array from position A to B.

- [builderz](https://github.com/jalal246/builderz) - Building your project with zero config.

- [corename](https://github.com/jalal246/corename) - Extracts package name.

- [get-info](https://github.com/jalal246/get-info) - Utility functions for projects production.

### Tests

```sh
npm test
```

## License

This project is licensed under the [GPL-3.0 License](https://github.com/jalal246/packageSorter/blob/master/LICENSE)
