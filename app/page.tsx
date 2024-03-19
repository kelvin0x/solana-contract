'use client';

import {
  WalletDisconnectButton,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
import Wallet from './components/Wallet';
import Launchpad from './components/LaunchpadCreate';
export default function Home() {
  return (
    <main className='w-full'>
      <Wallet>
        <div className='w-full text-center'>Contract</div>
        <div className='w-full text-center'>
          <WalletMultiButton />
          <WalletDisconnectButton />
        </div>
        <div>construction: Copy IDL file into lib/solana/idl.json</div>
        <div>Create Launchpad:</div>
        <div>
          <Launchpad />
        </div>
      </Wallet>
    </main>
  );
}
