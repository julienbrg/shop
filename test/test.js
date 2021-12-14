const { expect } = require("chai");
const { ethers } = require("hardhat");

let Thistle;
let thistle;
let Shop;
let shop;
let bob;
let alice;
let francis;

beforeEach(async function () {
  [bob, alice, francis] = await ethers.getSigners();
});

describe("Deployment", function () {

  it("Should deploy Thistle.sol", async function () {
    console.log(" ");
    Thistle = await ethers.getContractFactory("Thistle");
    thistle = await Thistle.connect(bob).deploy();
    expect(await thistle.ownerOf(1)).to.equal(bob.address);   
  });

  it("Should deploy Shop.sol", async function () {
    Shop = await ethers.getContractFactory("Shop");
    shop = await Shop.deploy(thistle.address,1);
    expect(await shop.addr()).to.equal(thistle.address);
  });

});

describe("Scenario #1", function () {

  it("Bob approves the Shop to transfer his NFT", async function () {
    console.log(" ");
    await thistle.approve(shop.address,1);
    expect(await thistle.getApproved(1)).to.equal(shop.address);
  });

  it("Bob sells his NFT", async function () {
    await shop.sell(ethers.utils.parseEther("1"),bob.address);
    expect(await thistle.ownerOf(1)).to.equal(shop.address);
  });

  it("Alice buys Bob's NFT", async function () {
    await shop.connect(alice).buy({value: ethers.utils.parseEther("1")});
    expect(await thistle.ownerOf(1)).to.equal(alice.address);
  });

  it("Alice sells it back", async function () {
    await thistle.connect(alice).approve(shop.address,1);
    await shop.connect(alice).sell(ethers.utils.parseEther("2"),alice.address);
    expect(await thistle.ownerOf(1)).to.equal(shop.address);
  });

  it("Francis accidentally sends money to the contract", async function () {
    francis.sendTransaction({to: shop.address,value: ethers.utils.parseEther("10")});
    expect(await ethers.provider.getBalance(francis.address)).to.equal(ethers.utils.parseEther("10000"));
  });

  it("Francis buys Alice's NFT", async function () {
    await shop.connect(francis).buy({value: ethers.utils.parseEther("3")});
    expect(await thistle.ownerOf(1)).to.equal(francis.address);
    expect(await ethers.provider.getBalance(francis.address)).to.equal(ethers.utils.parseEther("9997.999848283080864485"));
  });

});
