import { AnchorProvider, BN, Program, web3 } from "@coral-xyz/anchor";
import * as config from "./config.json";
import idl from "./anchor_launchpad.json";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { getMockData } from "./mock_data";

const getAccountSeed = (
  key: string,
  programId: PublicKey,
  provider: AnchorProvider
) =>
  web3.PublicKey.findProgramAddressSync(
    [Buffer.from(key), provider.wallet.publicKey.toBuffer()],
    programId
  )[0];

export async function getLaunchpadInfo(provider: AnchorProvider) {
  // load the program's idl -- make sure the path is correct
  const programId = new web3.PublicKey(config.programId);
  const myLaunchpad = new Program(idl as any, programId, provider);

  const launchpad = await myLaunchpad.account.launchpadAccount.fetch(
    getAccountSeed("launchpad", programId, provider)
  );
  const launchpadStep = await myLaunchpad.account.launchpadStepAccount.fetch(
    getAccountSeed("launchpad_step", programId, provider)
  );
  const whitelistaccount = await myLaunchpad.account.whitelistAccount.fetch(
    getAccountSeed("whitelistaccount", programId, provider)
  );
  // const mintConfigAccount = await myLaunchpad.account.mintConfigAccount.fetch(
  //   getAccountSeed('mint_config', programId, provider)
  // );
  const userConfigAccount = await myLaunchpad.account.userConfigAccount.fetch(
    getAccountSeed("user_config", programId, provider)
  );

  console.log({
    launchpad,
    launchpadStep,
    // whitelistaccount,
    userConfigAccount,
  });
}

type LaunchpadArgs = {
  launchpad_token_address: string;
};

export async function createLaunchpad(
  provider: AnchorProvider,
  args: LaunchpadArgs
) {
  //1. load the program's idl -- make sure the path is correct
  const programId = new web3.PublicKey(config.programId);
  const myLaunchpad = new Program(idl as any, programId, provider);

  //2. Create Launchpad and wait. Accounts should same as IDL
  //2.a Random for new launchpad address
  const launchpadAccount = web3.PublicKey.findProgramAddressSync(
    [Buffer.from("launchpad"), provider.wallet.publicKey.toBuffer()],
    programId
  )[0];
  const launchpadStepAccount = web3.PublicKey.findProgramAddressSync(
    [Buffer.from("launchpad_step"), provider.wallet.publicKey.toBuffer()],
    programId
  )[0];

  const launchpadTokenAddress = new web3.PublicKey(
    args.launchpad_token_address
  );
  const mintConfigAccount = web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("mint_config"),
      launchpadTokenAddress.toBuffer(),
      provider.wallet.publicKey.toBuffer(),
    ],
    programId
  )[0];

  const configAccount = new web3.PublicKey(
    "BtbZZ58QPKrQTq3RvvLsvbUerMXaMJLkJFzNkD8XsGRd"
  );

  const tokenVaultLaunchpad = await getAssociatedTokenAddress(
    launchpadTokenAddress,
    launchpadAccount,
    true
  );
  const deverTokenAccount = await getAssociatedTokenAddress(
    launchpadTokenAddress,
    provider.wallet.publicKey,
    true
  );

  const data = await getMockData(provider.connection, launchpadTokenAddress);

  const tx = await myLaunchpad.methods
    .createLaunchpad(new BN(300000))
    .accounts({
      dever: provider.wallet.publicKey,
      launchpadMint: launchpadTokenAddress,
      launchpadAccount: launchpadAccount,
      vaultLaunchpad: tokenVaultLaunchpad,
      configAccount: configAccount,
      mintConfigAccount: mintConfigAccount,
      deverTokenAccount: deverTokenAccount,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    })
    .instruction();

  const tx2 = await myLaunchpad.methods
    .createLaunchpadStep(
      data.launchpadParamsStep1,
      data.launchpadParamsStep2,
      data.launchpadParamsStep3
    )
    .accounts({
      dever: provider.wallet.publicKey,
      launchpadAccount: launchpadAccount,
      launchpadStepAccount: launchpadStepAccount,
      systemProgram: SystemProgram.programId,
    })
    .instruction();
  const all_tx = new Transaction();
  let blockhash = await provider.connection.getLatestBlockhash("finalized");
  all_tx.add(tx).add(tx2).recentBlockhash = blockhash.blockhash;
  all_tx.feePayer = provider.wallet.publicKey;
  const signed_tx = await provider.wallet.signAllTransactions([all_tx]);
  for (const ta of signed_tx) {
    const txid = await provider.connection.sendRawTransaction(ta.serialize(), {
      skipPreflight: true,
    });
    console.log(txid);
  }
  return { launchpadAccount, launchpadStepAccount };
}

export async function addWhitelist(provider: AnchorProvider, account: string) {
  //1. load the program's idl -- make sure the path is correct
  const programId = new web3.PublicKey(config.programId);
  const myLaunchpad = new Program(idl as any, programId, provider);

  //2. Create Launchpad and wait. Accounts should same as IDL
  //2.a Random for new launchpad address
  const launchpadAccount = web3.PublicKey.findProgramAddressSync(
    [Buffer.from("launchpad"), provider.wallet.publicKey.toBuffer()],
    programId
  )[0];

  const whitelistAccount = PublicKey.findProgramAddressSync(
    [
      Buffer.from("whitelist"),
      launchpadAccount.toBuffer(),
      provider.wallet.publicKey.toBuffer(),
    ],
    programId
  )[0];

  const tx = await myLaunchpad.methods
    .addToWhitelist([new PublicKey(account)])
    .accounts({
      dever: provider.wallet.publicKey,
      launchpadAccount: launchpadAccount,
      whitelistAccount: whitelistAccount,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  console.log("Create whitelist account: ", tx);
}
