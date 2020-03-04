const getCoreName = require("corename");

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
 * Checks if given package has decency in coreDep.
 *
 * @param {Object} packageDeps
 *
 * @returns {Object} result
 * @returns {boolean} result.hasCoreDep
 * @returns {Object} result.dep
 */
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

/**
 * Adds package at(index) to sorted or inSorted.
 *
 * @param {Array} packages - packages in workspace.
 * @param {number} at - index
 * @param {boolean} isSorted -
 */
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
 *
 * @param {Array} packages - packages in workspace.
 */
function sort(packages) {
  let isAddToSorted = false;

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

    if (isAddToSorted) {
      addTo(packages, i, true);

      break;
    }
  }

  /**
   * Has hasCoreDep but couldn't add it.
   * - Add it to unsorted.
   * - remove it form packages.
   */
  if (!isAddToSorted && hasCoreDep) {
    addTo(packages, 0, false);
  }
}

/**
 * Sorting packages. Package with no deps will come first, then package that
 * depending of package that is built. This is essential for monorepo build.
 *
 * @param {Array} packages - packages in workspace.
 * @param {string} coreDependency - core package that other packages depend on.
 *
 * @returns {Object} result
 * @returns {boolean} result.sorted
 * @returns {Object} result.unSorted
 * */
function packageSorter(packages = [], coreDependency) {
  unSorted = [];

  /**
   * Nothing to sort when:
   *  1- have only one package.
   *  2- can't discover the coreDep (which may be due to packages not depending
   * on each other aka already sorted)
   */
  if (packages.length <= 1) return { sorted: packages, unSorted };

  coreDep = coreDependency || getCoreName(packages);

  if (!coreDep) return { sorted: packages, unSorted };

  const totalLength = packages.length;
  sorted = [];

  elemAdded = 0;

  while (sorted.length < totalLength) {
    sort(packages);

    if (elemAdded === totalLength) {
      break;
    }
  }

  return { sorted, unSorted };
}

module.exports = packageSorter;
