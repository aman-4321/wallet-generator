import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { Wallet, HDNodeWallet } from "ethers";

interface EthWalletProps {
  mnemonic: string;
}

export const EthWallet = ({ mnemonic }: EthWalletProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [addresses, setAddresses] = useState<string[]>([]);

  return (
    <div className="bg-white p-6 mt-6 border border-gray-300 rounded-md shadow-md w-full max-w-4xl">
      <button
        onClick={async function () {
          const seed = await mnemonicToSeed(mnemonic);
          const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
          const hdNode = HDNodeWallet.fromSeed(seed);
          const child = hdNode.derivePath(derivationPath);
          const privateKey = child.privateKey;
          const wallet = new Wallet(privateKey);
          setCurrentIndex(currentIndex + 1);
          setAddresses([...addresses, wallet.address]);
        }}
        className="px-4 py-2 mb-4 bg-black text-white rounded-md shadow-md hover:bg-gray-800 transition"
      >
        Add ETH wallet
      </button>

      <div className="grid grid-cols-1 gap-4">
        {addresses.map((p) => (
          <div
            key={p}
            className="p-4 bg-gray-100 border border-gray-300 rounded-md shadow-md text-gray-700"
          >
            Eth - {p}
          </div>
        ))}
      </div>
    </div>
  );
};
