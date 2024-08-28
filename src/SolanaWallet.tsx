import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair, PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";

interface SolanaWalletProps {
  mnemonic: string;
}

export function SolanaWallet({ mnemonic }: SolanaWalletProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [publicKeys, setPublicKeys] = useState<PublicKey[]>([]);

  return (
    <div className="bg-white p-6 mt-6 border border-gray-300 rounded-md shadow-md w-full max-w-4xl">
      <button
        onClick={async function () {
          const seed = await mnemonicToSeed(mnemonic);
          const path = `m/44'/501'/${currentIndex}'/0'`;
          const derivedSeed = derivePath(path, seed.toString("hex")).key;
          const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
          const keypair = Keypair.fromSecretKey(secret);
          setCurrentIndex(currentIndex + 1);
          setPublicKeys([...publicKeys, keypair.publicKey]);
        }}
        className="px-4 py-2 mb-4 bg-black text-white rounded-md shadow-md hover:bg-gray-800 transition"
      >
        Add SOL wallet
      </button>

      <div className="grid grid-cols-1 gap-4">
        {publicKeys.map((p) => (
          <div
            key={p.toBase58()}
            className="p-4 bg-gray-100 border border-gray-300 rounded-md shadow-md text-gray-700"
          >
            {p.toBase58()}
          </div>
        ))}
      </div>
    </div>
  );
}
