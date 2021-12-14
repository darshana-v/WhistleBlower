const whistleBlower = artifacts.require("whistleBlower");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */

contract("whistleblower", function (/* accounts */) {
  it("should assert true", async function () {
    await whistleBlower.deployed();
    return assert.isTrue(true);
  });
});
