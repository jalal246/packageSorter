import { expect } from "chai";
import sortPackages from "../src";

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

describe("sortPackages test", () => {
  it("sorts all packages with given core dependency", () => {
    const packages = [pkg1, pkg2, pkg3, pkg0, pkg4];
    const result = sortPackages(packages, "@folo");

    const expectedResult = [pkg2, pkg0, pkg1, pkg4, pkg3];

    expect(result).to.deep.equal(expectedResult);
  });

  it("it extracts core dependency if not passed by default then sort", () => {
    /**
     * Same as above but without passing core dep.
     */
    const packages = [pkg1, pkg2, pkg3, pkg0, pkg4];
    const result = sortPackages(packages);

    const expectedResult = [pkg2, pkg0, pkg1, pkg4, pkg3];

    expect(result).to.deep.equal(expectedResult);
  });

  it("returns empty array when it all don't have the core-dependency", () => {
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
    const sorted = sortPackages(packages, "@folo");

    expect(sorted).to.deep.equal([]);
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
    const sorted = sortPackages(packages, "@folo");

    expect(sorted).to.deep.equal([pkg22, pkg21]);
  });

  // discover a bug.
  it("bug here:", () => {
    const pkg = {
      name: "builderz",

      dependencies: {
        "@rollup/plugin-auto-install": "^2.0.0",
        "@rollup/plugin-beep": "^0.1.2",
        "@rollup/plugin-commonjs": "^11.0.1"
      }
    };

    expect([pkg]).to.deep.equal(sortPackages([pkg]));
  });
});
