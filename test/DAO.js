const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

const ether = tokens;

describe("DAO", () => {
  let token, dao;
  let deployer, funder;

  beforeEach(async () => {
    // Set up accounts
    let accounts = await ethers.getSigners();
    deployer = accounts[0];
    funder = accounts[1];

    // Deploy Token
    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy("JosephMoney", "JMN", "1000000");

    // Deploy DAO
    const DAO = await ethers.getContractFactory("DAO");
    dao = await DAO.deploy(token.address, "5000000000000000001");

    // Funder sends 100 Ether do DAO treasury for governance
    await funder.sendTransaction({ to: dao.address, value: ether(100) });
  });

  describe("Deployment", () => {
    it("sends ether to the DAO treasury", async () => {
      expect(await ethers.provider.getBalance(dao.address)).to.equal(
        ether(100)
      );
    });
    it("returns token address", async () => {
      expect(await dao.token()).to.equal(token.address);
    });

    it("returns quorum", async () => {
      expect(await dao.quorum()).to.equal("5000000000000000001");
    });
  });
});
