const getCoreName = require("corename");
const { move, moveMultiple } = require("move-position");

let sorted;
let coreDep;
let numOfPackages;

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
function isAddPackage(packageDeps) {
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
function sort(packages, associatedArr = []) {
  const isAssociatedArr = associatedArr.length > 0;

  let noChange = false;
  packages.forEach(({ dependencies = {} }, i) => {
    /**
     * Checks if this package is already existed in sorted array or even has
     * coreDep
     */
    const isAdd = isAddPackage(dependencies, coreDep);

    if (isAdd) {
      const to = sorted.push(packages[i]);

      /**
       *  remove it from unsorted
       */
      packages.splice(i, 1);

      numOfPackages -= 1;

      noChange = true;

      if (isAssociatedArr) moveMultiple(associatedArr, i, to);
    }
  });

  return noChange;
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

  numOfPackages = packages.length;

  sorted = [];
  while (numOfPackages > 0) {
    const noChange = sort(packages, associatedArr);
    if (!noChange) break;
  }

  return sorted;
}

module.exports = packageSorter;
