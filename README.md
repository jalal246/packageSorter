# Package Sorter

> Sorting a group of packages that depends on each other

Having multiple projects in workspace depending on each other is a headache. You
have to build core first, then the project depends on it, and so on. You
probably want this step to be automated so you can use: `package-sorter`

```bash
npm install package-sorter
```

## API

```js
packageSorter(packages? Array, coreDependency? string)
```

Returns result object:

- `sorted: Array <sortedPkgJson>` - all sorted packages in order.
- `sortingMap: Array <sortingMap>`- map of package sorting contains:
  - `form: number` - original package index before sorting.
  - `to: number` - current package index after sorting.
- `unSorted: Array <unsortedPkgJson>` - unsortable package that's missing dependency.

```js
const { sorted, sortingMap, unSorted } = packageSorter(
  packages,
  coreDependency
);
```

If `coreDependency` is not passed, `package-sorter` will extract it following
monorepo naming pattern as: `@coreDep/`

### Example (1) - All Sorted

```js
import packageSorter from "package-sorter";

// input packages:
const pkg1 = {
  name: "@pkg/first",
  dependencies: {},
};

const pkg2 = {
  name: "@pkg/second",
  dependencies: {
    "@pkg/first": "^0.1.5",
  },
};

const pkg3 = {
  name: "@pkg/third",
  dependencies: {
    "@pkg/second": "^0.1.5",
  },
};

const packages = [pkg3, pkg2, pkg1];

// our core dependency in this case is: @pkg.
const { sorted, sortingMap, unSorted } = sortPackages(packages, "@pkg");

// sorted = [pkg1, pkg2, pkg3];

// sortingMap = [
//   { from: 2, to: 0 },
//   { from: 1, to: 1 },
//   { from: 0, to: 2 },
// ];

// unSorted = [];
```

### Example (2) - Mixed Packages

```js
import packageSorter from "package-sorter";

// input packages:
const pkg1 = {
  name: "@pkg/first",
  dependencies: {},
};

const pkg2 = {
  name: "@pkg/second",
  dependencies: {
    "@pkg/first": "^0.1.5",
  },
};

const pkg3 = {
  name: "unrelated",
  dependencies: {},
};

const packages = [pkg3, pkg2, pkg1];

// let's the function get core dependency (@pkg).
const { sorted, sortingMap, unSorted } = sortPackages(packages);

// sorted = [pkg3, pkg1, pkg2];

// sortingMap = [
//   { from: 0, to: 0 },
//   { from: 2, to: 1 },
//   { from: 1, to: 2 },
// ];

// unSorted = [];
```

### Example (3) - Some Unsorted

```js
import packageSorter from "package-sorter";

// input packages:
const pkg1 = {
  name: "@pkg/first",
  dependencies: {},
};

const pkg2 = {
  name: "@pkg/second",
  dependencies: {
    "@pkg/first": "^0.1.5",
  },
};

const pkg3 = {
  name: "@pkg/unsortable",
  dependencies: {
    "@pkg/missing": "^0.1.5",
  },
};

const packages = [pkg3, pkg2, pkg1];

const { sorted, sortingMap, unSorted } = sortPackages(packages);

// sorted = [pkg1, pkg2];

// sortingMap = [
//   { from: 2, to: 0 },
//   { from: 1, to: 1 },
// ];

// unSorted = [pkg3];
```

## Test

```sh
npm test
```

## License

This project is licensed under the [GPL-3.0 License](https://github.com/jalal246/packageSorter/blob/master/LICENSE)

### Related projects

- [move-position](https://github.com/jalal246/move-position) - Moves element
  index in given array from position A to B.

- [builderz](https://github.com/jalal246/builderz) - Building your project with zero config.

- [corename](https://github.com/jalal246/corename) - Extracts package name.

- [get-info](https://github.com/jalal246/get-info) - Utility functions for
  projects production.

- [textics](https://github.com/jalal246/textics) &
  [textics-stream](https://github.com/jalal246/textics-stream) - Counts lines,
  words, chars and spaces for a given string.

- [folo](https://github.com/jalal246/folo) - Form & Layout Components Built with React.
