'use client';

import { useAnchorWallet, AnchorWallet } from '@solana/wallet-adapter-react';
import { AnchorProvider } from '@coral-xyz/anchor';
import {
  addWhitelist,
  createLaunchpad,
  getLaunchpadInfo,
} from '@/lib/solana/launchpad';
import { Connection, clusterApiUrl } from '@solana/web3.js';
import { useMemo } from 'react';

export default function LaunchpadCreate() {
  const wallet = useAnchorWallet();
  const provider = useMemo(() => {
    const connection = new Connection(clusterApiUrl('devnet'));
    return new AnchorProvider(connection, wallet as unknown as AnchorWallet, {
      commitment: 'confirmed',
    });
  }, [wallet]);

  return (
    <div className='flex flex-row space-x-8'>
        <div className='flex flex-col justify-start'> 
            <button
                className='bg-red-500 w-max my-2'
                onClick={async () => {
                await createLaunchpad(provider, {
                    launchpad_token_address:
                    'woghQsqUPJ9Xz8Lmn1PV2fg6DpPqfg6VA5rpKpg1PLk',
                });
                }}
            >
                Create Launchpad
            </button>

            <button
                className='bg-red-500 w-max my-2'
                onClick={async () => {
                await addWhitelist(
                    provider,
                    '3hgRVoGbwL2EqBLAFFJw2WfBpKcdAhaBKrRnxCqDts45'
                    );
                }}
            >
                Add whitelist
            </button>
        </div>
        <div className='flex flex-col justify-start'> 
            <button
                className='bg-blue-500 w-max my-2'
                onClick={async () => {
                    await getLaunchpadInfo(provider);
                }}
            >
                Log Launchpad Info
            </button>

            <button
                className='bg-blue-500 w-max my-2'
                onClick={async () => {
                await addWhitelist(
                    provider,
                    '3hgRVoGbwL2EqBLAFFJw2WfBpKcdAhaBKrRnxCqDts45'
                );
                }}
            >
                Add whitelist
            </button>
        </div>
    </div>
  );
}
