const sorted = [];
let coreDep;

/**
 * Checks if targeted dependency is already added to sorted array.
 *
 * @param {string} dep - name of targeted dependency.
 * @returns {boolean}
 */
function isInFiltered(dep) {
  const match = sorted.find(({ name }) => name === dep);
  return typeof match === "string";
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
  Object.keys(packageDeps).forEach(dep => {
    if (dep.includes(coreDep)) {
      return isInFiltered(dep);
    }

    return true;
  });
}

/**
 * Loop into packages. Add package that don't require coreDep first, then add
 * coreDep, then other packages.
 *
 * @param {Array} packages
 */
function sort(packages) {
  packages.forEach(({ dependencies = {} }, i) => {
    /**
     * Checks if this package is already existed in sorted array or even has
     * coreDep
     */
    const isAdd = isAddPackage(dependencies, coreDep);

    if (isAdd) {
      sorted.push(packages[i]);

      /**
       *  remove it from unsorted
       */
      packages.splice(i, 1);
    }
  });
}

/**
 * Sorting packages. Package with no deps will come first, then package that
 * depending of package that is built. This is essential for monorepo build.
 *
 * @export
 * @param {Array} packages - contains dependencies for each package in workspace.
 * @param {string} coreDependency - core package that other packages depend on.
 * @returns {Array} - Sorted Array.
 */
export default function sortPackages(packages, coreDependency) {
  coreDep = coreDependency;

  while (packages.length > 0) {
    sort();
  }

  return sorted;
}
