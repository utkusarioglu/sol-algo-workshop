import { expect } from "chai";
import { ethers } from "hardhat";

const { Wallet, id, verifyMessage } = ethers;

describe("Ethers v6", () => {
  it("Signs messages", async () => {
    const message = "Hello something";
    const signer = new Wallet(id("hi"));
    const signed = await signer.signMessage(message);
    // console.log({ signed, message, signer });
    const verification = verifyMessage(message, signed);
    // console.log({ verification });
    return expect(verification).to.eq(signer.address);
  })
})
