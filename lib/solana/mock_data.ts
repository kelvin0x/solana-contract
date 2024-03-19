import { BN } from "@coral-xyz/anchor";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
export async function getMockData(
  connection: Connection,
  launchpadMint_address: PublicKey
) {
  const slot = await connection.getSlot();
  const timestamp = (await connection.getBlockTime(slot)) ?? 1;

  const startTime = timestamp - 1;
  const endTime = startTime + 10;
  const launchpadParamsStep1 = {
    listingOption: 1,
    affiliate: 0,
    totalTokenTo: new BN(300000),
    decimals: 0,
    contractToken: launchpadMint_address,
  };
  const launchpadParamsStep2 = {
    preRate: new BN(1),
    whitelist: new BN(0),
    liquidityLockDay: new BN(0),
    softCap: new BN(10 * LAMPORTS_PER_SOL),
    hardCap: new BN(100 * LAMPORTS_PER_SOL), //100 SOL
    minBuy: new BN(0.1 * LAMPORTS_PER_SOL), //0.1 SOL
    maxBuy: new BN(1 * LAMPORTS_PER_SOL), //1 SOL
    typeRefund: new BN(0),
    liquidityRate: new BN(15),
    listingRate: new BN(10),
    startTime: new BN(startTime),
    endTime: new BN(endTime),
  };
  const launchpadParamsStep3 = {
    logoUrl: "https://www.pinksale.finance/",
    website: "https://www.pinksale.finance/",
    facebook: "https://www.pinksale.finance/",
    twitter: "https://www.pinksale.finance/",
    github: "https://www.pinksale.finance/",
    telegram: "https://www.pinksale.finance/",
    instagram: "https://www.pinksale.finance/",
    reddit: "https://www.pinksale.finance/",
    discord: "https://www.pinksale.finance/",
    youtube: "https://www.pinksale.finance/",
    description: "https://www.pinksale.finance/",
  };

  return {
    launchpadParamsStep1,
    launchpadParamsStep2,
    launchpadParamsStep3,
  };
}
