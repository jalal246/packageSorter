const getCoreName = require("corename");
const { moveMultiple } = require("move-position");

let sorted;
let unSorted;
let coreDep;

/**
 * Checks if targeted dependency is already added to sorted array.
 *
 * @param {string} dep - name of targeted dependency.
 * @returns {boolean}
 */
function isAddedToSorted(dep) {
  /**
   * Check if dependency already added, using name package matching.
   */
  const match = sorted.find(({ name }) => name === dep);
  return typeof match === "object";
}

/**
 * Checks if given package should be added to sorted array.
 *
 * If package dependencies doesn't matched coreDep, then returns true. It
 * should be added because it's neutral.
 *
 * Otherwise, checks, if it exists before, then true to add it, if not false.
 * Because we should add the essential dependency first.
 *
 * @param {Object} packageDeps
 * @returns {boolean}
 */
function hasToAddPackage(packageDeps) {
  let isAdd = true;

  const packageDepsArr = Object.keys(packageDeps);

  for (let i = 0; i < packageDepsArr.length; i += 1) {
    const dep = packageDepsArr[i];

    if (dep.includes(coreDep)) {
      isAdd = isAddedToSorted(dep);

      if (isAdd) break;
    }
  }

  return isAdd;
}

/**
 * Loop into packages. Add package that don't require coreDep first, then add
 * coreDep, then other packages.
 */
function sort(packages) {
  let isSorted = false;

  let to = 0;
  let from = 0;

  for (let i = 0; i < packages.length; i += 1) {
    const pkg = packages[i];

    const { dependencies } = pkg;

    /**
     * Checks if this package is already existed in sorted array or even has
     * coreDep
     */
    const isAdd = hasToAddPackage(dependencies, coreDep);

    console.log(i, packages[i].name, isAdd);

    if (isAdd) {
      to = sorted.push(pkg) - 1;
      console.log("sort -> sorted", sorted.length);

      from = i;

      /**
       *  remove it from packages so it won't be checked next time.
       */
      packages.splice(i, 1);

      isSorted = true;

      break;
    }
  }

  return {
    isSorted,
    from,
    to
  };
}

/**
 * Sorting packages. Package with no deps will come first, then package that
 * depending of package that is built. This is essential for monorepo build.
 *
 * @param {Array} packages - contains dependencies for each package in workspace.
 * @param {string} coreDependency - core package that other packages depend on.
 * @returns {Array} - Sorted Array.
 */
function packageSorter(packages = [], coreDependency, associatedArr) {
  /**
   * Nothing to sort when:
   *  1- have only one package.
   *  2- can't discover the coreDep (which may be due to packages not depending
   * on each other aka already sorted)
   */
  if (packages.length <= 1) return packages;

  coreDep = coreDependency || getCoreName(packages);

  if (!coreDep) return packages;

  const isAssociatedArr = associatedArr && associatedArr.length > 0;

  const totalLength = packages.length;

  let i = 0;

  sorted = [];
  unSorted = [];
  // sorted.length <== totalLength ||
  while (sorted.length < totalLength) {
    sorted.length !== totalLength;
    console.log(sorted.length, totalLength);
    const { isSorted, from, to } = sort(packages);
    console.log("in", isSorted);

    if (!isSorted) break;

    const currentIndex = sorted.length;

    i += 1;
    // if (!isSorted) {
    //   sorted.push(packages[currentIndex]);
    //   packages.splice(currentIndex, 1);
    // }

    // console.log(currentIndex);

    // if (isAssociatedArr) moveMultiple(associatedArr, from, to);
    // console.log("packageSorter -> associatedArr", associatedArr);
    // console.log("packageSorter -> sorted", sorted);
  }

  return sorted;
}

module.exports = packageSorter;
