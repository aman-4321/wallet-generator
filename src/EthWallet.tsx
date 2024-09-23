import { useState, useCallback } from "react";
import { mnemonicToSeed } from "bip39";
import { Wallet, HDNodeWallet } from "ethers";
import { Button } from "@/components/ui/button";
import { CopyIcon, PlusIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

interface EthWalletProps {
  mnemonic: string;
}

export function EthWallet({ mnemonic }: EthWalletProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [addresses, setAddresses] = useState<string[]>([]);

  const addWallet = useCallback(async () => {
    const seed = await mnemonicToSeed(mnemonic);
    const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
    const hdNode = HDNodeWallet.fromSeed(seed);
    const child = hdNode.derivePath(derivationPath);
    const privateKey = child.privateKey;
    const wallet = new Wallet(privateKey);
    setCurrentIndex((prevIndex) => prevIndex + 1);
    setAddresses((prevAddresses) => [...prevAddresses, wallet.address]);
  }, [mnemonic, currentIndex]);

  const copyToClipboard = useCallback((address: string) => {
    navigator.clipboard.writeText(address);
    toast.success("Address copied to clipboard");
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-700">Ethereum Wallets</h2>
      <Button
        onClick={addWallet}
        className="w-full bg-black text-white hover:bg-gray-800 transition-colors"
      >
        <PlusIcon className="mr-2 h-4 w-4" />
        Generate ETH Wallet
      </Button>
      <div className="space-y-2">
        {addresses.map((address, index) => (
          <motion.div
            key={address}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-between bg-gray-100 p-3 rounded-md"
          >
            <div>
              <div className="text-sm font-medium text-gray-500">
                Wallet {index + 1}
              </div>
              <div className="mt-1 font-mono text-sm truncate max-w-[200px] sm:max-w-[300px]">
                {address}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copyToClipboard(address)}
              className="hover:bg-gray-200 transition-colors"
            >
              <CopyIcon className="h-4 w-4" />
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
