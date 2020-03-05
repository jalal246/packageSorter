import { expect } from "chai";
import sortPackages from "../src";

const pkgFoloContext = {
  name: "@folo/withcontext",
  dependencies: {}
};

const pkgFoloValues = {
  name: "@folo/values",
  dependencies: {
    "@folo/withcontext": "^0.1.5"
  }
};

const pkgFoloUtils = {
  name: "@folo/utils",
  dependencies: {}
};

const pkgFoloLayout = {
  name: "@folo/layout",
  dependencies: {
    "@folo/withcontext": "^0.1.5"
  }
};

const pkgFoloForms = {
  name: "@folo/forms",
  dependencies: {
    "@folo/layout": "^0.1.4",
    "@folo/values": "^0.1.4"
  }
};

describe("sortPackages test", () => {
  it("sorts all packages with given core dependency", () => {
    const packages = [
      pkgFoloValues,
      pkgFoloUtils,
      pkgFoloLayout,
      pkgFoloContext,
      pkgFoloForms
    ];
    const { sorted, unSorted } = sortPackages(packages, "@folo");

    const expectedResult = [
      pkgFoloUtils,
      pkgFoloContext,
      pkgFoloValues,
      pkgFoloLayout,
      pkgFoloForms
    ];

    expect(sorted).to.have.ordered.members(expectedResult);
    expect(unSorted.length).to.be.equal(0);
  });

  it("it extracts core dependency if not passed by default then sorts", () => {
    /**
     * Same as above but without passing core dep.
     */
    const packages = [
      pkgFoloValues,
      pkgFoloUtils,
      pkgFoloLayout,
      pkgFoloContext,
      pkgFoloForms
    ];
    const { sorted, unSorted } = sortPackages(packages, "@folo");

    const expectedResult = [
      pkgFoloUtils,
      pkgFoloContext,
      pkgFoloValues,
      pkgFoloLayout,
      pkgFoloForms
    ];

    expect(sorted).to.have.ordered.members(expectedResult);
    expect(unSorted.length).to.be.equal(0);
  });

  it("sorts all mixed-package some sortable, others don't have related core dep", () => {
    const pkgUN1 = {
      name: "unsortable1",
      dependencies: {
        layout1: "^0.1.4",
        values1: "^0.1.4"
      }
    };

    const pkgUN2 = {
      name: "unsortable2",
      dependencies: {
        layout2: "^0.1.4",
        values2: "^0.1.4"
      }
    };

    const pkgUN3 = {
      name: "unsortable3",
      dependencies: {
        layout2: "^0.1.4",
        values2: "^0.1.4"
      }
    };

    const packages = [
      pkgFoloUtils,
      pkgUN1,
      pkgFoloValues,
      pkgUN2,
      pkgFoloContext,
      pkgUN3
    ];

    const { sorted, unSorted } = sortPackages(packages);

    const expectedResult = [
      pkgFoloUtils,
      pkgUN1,
      pkgUN2,
      pkgFoloContext,
      pkgFoloValues,
      pkgUN3
    ];

    expect(sorted).to.have.ordered.members(expectedResult);
    expect(unSorted.length).to.be.equal(0);
  });

  // it("it sorts packages and associated arrays", () => {
  //   /**
  //    * Same as above but without passing core dep.
  //    */
  //   const packages = [pkgFoloValues, pkgFoloContext, pkgFoloForms];

  //   const distPath = ["1", "0", "4"];
  //   const result = sortPackages(packages, null, [distPath]);
  //   // console.log("result", result);

  //   const expectedResult = [pkgFoloContext, pkgFoloValues, pkgFoloForms];
  //   // console.log("distPath", distPath);

  //   expect(result).to.have.ordered.members(expectedResult);
  //   // expect(distPath).to.have.ordered.members(["0", "1", "4"]);
  // });

  it("returns all unsorted packages that have core dep", () => {
    const pkg10 = {
      name: "@folo/withcontext",
      dependencies: {
        "@folo/eslint": "^0.1.5"
      }
    };

    const pkg11 = {
      name: "@folo/values",
      dependencies: {
        "@folo/tools": "^0.1.5"
      }
    };

    const pkg12 = {
      name: "@folo/utils",
      dependencies: {
        "@folo/pop": "^0.1.5"
      }
    };

    const packages = [pkg10, pkg11, pkg12];
    const { sorted, unSorted } = sortPackages(packages, "@folo");

    expect(sorted.length).to.be.equal(0);
    expect(unSorted).to.have.ordered.members([pkg10, pkg11, pkg12]);
  });

  it("returns only packages that able to sort them, ignore the other", () => {
    const pkg20 = {
      name: "@folo/withcontext",
      dependencies: {
        "@folo/eslint": "^0.1.5"
      }
    };

    const pkg21 = {
      name: "@folo/values",
      dependencies: {
        "@folo/tools": "^0.1.5"
      }
    };

    const pkg22 = {
      name: "@folo/tools",
      dependencies: {}
    };

    const packages = [pkg20, pkg21, pkg22];
    const { sorted, unSorted } = sortPackages(packages, "@folo");

    expect(sorted).to.have.ordered.members([pkg22, pkg21]);
    expect(unSorted).to.have.ordered.members([pkg20]);
  });

  it("returns same input as sorted if there is nothing to sort", () => {
    const pkgUN1 = {
      name: "unsortable1",
      dependencies: {
        layout1: "^0.1.4",
        values1: "^0.1.4"
      }
    };

    const pkgUN2 = {
      name: "unsortable2",
      dependencies: {
        layout2: "^0.1.4",
        values2: "^0.1.4"
      }
    };

    const pkgUN3 = {
      name: "unsortable3",
      dependencies: {
        layout2: "^0.1.4",
        values2: "^0.1.4"
      }
    };
    const packages = [pkgUN1, pkgUN2, pkgUN3];

    const { sorted, unSorted } = sortPackages(packages);

    expect(sorted).to.have.ordered.members(packages);
    expect(unSorted.length).to.be.equal(0);
  });
});
