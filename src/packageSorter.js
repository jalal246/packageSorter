const getCoreName = require("corename");
const { moveMultiple } = require("move-position");

let sorted;
let unSorted;
let coreDep;
let elemAdded;

/**
 * Checks if targeted dependency is already added to sorted array.
 *
 * @param {string} dep - name of targeted dependency.
 * @returns {boolean}
 */
function isDepInSorted(dep) {
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

    const hasCoreDependency = dep.includes(coreDep);
    console.log("hasToAddPackage -> hasCoreDependency", hasCoreDependency);

    if (dep.includes(coreDep)) {
      isAdd = isDepInSorted(dep);

      if (isAdd) break;
    }
  }

  return isAdd;
}

function isPackageNeedCoreDep(packageDeps) {
  let hasCoreDep = false;
  let dep;

  const packageDepsArr = Object.keys(packageDeps);

  for (let i = 0; i < packageDepsArr.length; i += 1) {
    dep = packageDepsArr[i];

    hasCoreDep = dep.includes(coreDep);

    if (hasCoreDep) break;
  }

  return { hasCoreDep, dep };
}

function addTo(packages, at, isSorted) {
  const target = isSorted ? sorted : unSorted;

  target.push(packages[at]);

  /**
   *  remove it from packages so it won't be checked next time.
   */
  packages.splice(at, 1);

  elemAdded += 1;
}

/**
 * Loop into packages. Add package that don't require coreDep first, then add
 * coreDep, then other packages.
 */
function sort(packages) {
  let isAddToSorted = false;

  const to = 0;
  const from = 0;

  let hasCoreDep = false;
  let dep = {};

  for (let i = 0; i < packages.length; i += 1) {
    const pkg = packages[i];

    const { dependencies } = pkg;

    ({ hasCoreDep, dep } = isPackageNeedCoreDep(dependencies));

    /**
     * When to add package to sorted?
     * - Neutral. Doesn't have hasCoreDep, then add it to sorted.
     * - Not natural, but its core dep is already added.
     */
    isAddToSorted = !hasCoreDep || isDepInSorted(dep);

    // console.log("sort -> pkg", pkg.name);
    // console.log("sort -> hasCoreDep", hasCoreDep);
    // console.log("sort -> isDepInSorted", isDepInSorted(dep));
    // console.log("sort -> isAddToSorted", isAddToSorted);

    if (isAddToSorted) {
      addTo(packages, i, true);

      break;
    }
  }

  /**
   * Has hasCoreDep but couldn't add it.
   * - Stop looping.
   * - Add it to unsorted.
   * - remove it form packages.
   */
  if (!isAddToSorted && hasCoreDep) {
    addTo(packages, 0, false);
  }

  return {
    isSorted: isAddToSorted,
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
function packageSorter(packages = [], coreDependency) {
  /**
   * Nothing to sort when:
   *  1- have only one package.
   *  2- can't discover the coreDep (which may be due to packages not depending
   * on each other aka already sorted)
   */
  if (packages.length <= 1) return packages;

  coreDep = coreDependency || getCoreName(packages);

  if (!coreDep) return packages;

  const totalLength = packages.length;

  sorted = [];
  unSorted = [];
  let i = 0;
  elemAdded = 0;

  while (sorted.length < totalLength) {
    // console.log(sorted.length, totalLength);
    const { isSorted, from, to } = sort(packages);

    i++;

    // console.log("in", isSorted, i);
    if (i === 1000) {
      /**
       * Two cases:
       * 1 - Unsorted because it doesn't have decency on other packages.
       * 2 - Unsorted because there's missing decency on packages.
       */

      break;
    }

    if (elemAdded === totalLength) {
      break;
    }
  }

  // console.log("packageSorter -> unSorted", unSorted);

  return { sorted, unSorted };
}

module.exports = packageSorter;
