const { expect } =require("chai");
const sortPackages  =require( "../src");

const pkgFirst = {
  name: "@pkg/first",
  dependencies: {},
};

const pkgSecond = {
  name: "@pkg/second",
  dependencies: {},
};

const pkgThird = {
  name: "@pkg/third",
  dependencies: {
    "@pkg/second": "^0.1.5",
  },
};

const pkgFourth = {
  name: "@pkg/fourth",
  dependencies: {
    "@pkg/second": "^0.1.5",
  },
};

const pkgFifth = {
  name: "@pkg/fifth",
  dependencies: {
    "@pkg/fourth": "^0.1.4",
    "@pkg/third": "^0.1.4",
  },
};

describe("sortPackages test", () => {
  it("sorts all packages with given core dependency", () => {
    const packages = [pkgThird, pkgFirst, pkgFourth, pkgSecond, pkgFifth];

    const { sorted, unSorted, sortingMap } = sortPackages(packages, "@pkg");

    const expectedResult = [pkgFirst, pkgSecond, pkgThird, pkgFourth, pkgFifth];

    expect(sorted).to.have.ordered.members(expectedResult);

    // all sorted, so unSorted is empty
    expect(unSorted).to.be.deep.equal([]);

    // checking sorting map
    expect(sortingMap).to.be.deep.equal([
      { from: 1, to: 0 },
      { from: 3, to: 1 },
      { from: 0, to: 2 },
      { from: 2, to: 3 },
      { from: 4, to: 4 },
    ]);
  });

  it("it extracts core dependency if not passed by default then sorts", () => {
    /**
     * Same as above but without passing core dep.
     */
    const packages = [pkgThird, pkgFirst, pkgFourth, pkgSecond, pkgFifth];

    const { sorted, sortingMap, unSorted } = sortPackages(packages, "@pkg");

    const expectedResult = [pkgFirst, pkgSecond, pkgThird, pkgFourth, pkgFifth];

    expect(sorted).to.have.ordered.members(expectedResult);
    expect(unSorted).to.be.deep.equal([]);
    expect(sortingMap).to.be.deep.equal([
      { from: 1, to: 0 },
      { from: 3, to: 1 },
      { from: 0, to: 2 },
      { from: 2, to: 3 },
      { from: 4, to: 4 },
    ]);
  });

  it("sorts all mixed-package some sortable, others don't have related core dep", () => {
    const pkgUN1 = {
      name: "unsortable1",
      dependencies: {
        layout1: "^0.1.4",
        values1: "^0.1.4",
      },
    };

    const pkgUN2 = {
      name: "unsortable2",
      dependencies: {
        layout2: "^0.1.4",
        values2: "^0.1.4",
      },
    };

    const pkgUN3 = {
      name: "unsortable3",
      dependencies: {
        layout2: "^0.1.4",
        values2: "^0.1.4",
      },
    };

    const packages = [pkgFirst, pkgUN1, pkgThird, pkgUN2, pkgSecond, pkgUN3];

    const { sorted, sortingMap, unSorted } = sortPackages(packages);

    const expectedResult = [
      pkgFirst,
      pkgUN1,
      pkgUN2,
      pkgSecond,
      pkgThird,
      pkgUN3,
    ];

    expect(sorted).to.have.ordered.members(expectedResult);
    expect(unSorted).to.be.deep.equal([]);
    expect(sortingMap).to.be.deep.equal([
      { from: 0, to: 0 },
      { from: 1, to: 1 },
      { from: 3, to: 2 },
      { from: 4, to: 3 },
      { from: 2, to: 4 },
      { from: 5, to: 5 },
    ]);
  });

  it("returns all unsorted packages that have core dep", () => {
    const pkg10 = {
      name: "@pkg/second",
      dependencies: {
        "@pkg/eslint": "^0.1.5",
      },
    };

    const pkg11 = {
      name: "@pkg/third",
      dependencies: {
        "@pkg/tools": "^0.1.5",
      },
    };

    const pkg12 = {
      name: "@pkg/first",
      dependencies: {
        "@pkg/pop": "^0.1.5",
      },
    };

    const packages = [pkg10, pkg11, pkg12];
    const { sorted, sortingMap, unSorted } = sortPackages(packages, "@pkg");

    expect(sorted).to.be.deep.equal([]);
    expect(unSorted).to.have.ordered.members([pkg12, pkg11, pkg10]);
    expect(sortingMap).to.be.deep.equal([]);
  });

  it("returns only packages that able to sort them, ignore the other", () => {
    const pkg20 = {
      name: "@pkg/second",
      dependencies: {
        "@pkg/eslint": "^0.1.5",
      },
    };

    const pkg21 = {
      name: "@pkg/third",
      dependencies: {
        "@pkg/tools": "^0.1.5",
      },
    };

    const pkg22 = {
      name: "@pkg/tools",
      dependencies: {},
    };

    const packages = [pkg20, pkg21, pkg22];
    const { sorted, sortingMap, unSorted } = sortPackages(packages, "@pkg");

    expect(sorted).to.have.ordered.members([pkg22, pkg21]);
    expect(sortingMap).to.be.deep.equal([
      { from: 2, to: 0 },
      { from: 1, to: 1 },
    ]);
    expect(unSorted).to.have.ordered.members([pkg20]);
  });

  it("returns same input as sorted if there is nothing to sort", () => {
    const pkgUN1 = {
      name: "unsortable1",
      dependencies: {
        layout1: "^0.1.4",
        values1: "^0.1.4",
      },
    };

    const pkgUN2 = {
      name: "unsortable2",
      dependencies: {
        layout2: "^0.1.4",
        values2: "^0.1.4",
      },
    };

    const pkgUN3 = {
      name: "unsortable3",
      dependencies: {
        layout2: "^0.1.4",
        values2: "^0.1.4",
      },
    };
    const packages = [pkgUN1, pkgUN2, pkgUN3];

    const { sorted, sortingMap, unSorted } = sortPackages(packages);

    expect(sorted).to.have.ordered.members(packages);
    expect(sortingMap).to.be.deep.equal([]);
    expect(unSorted).to.be.deep.equal([]);
  });
});
