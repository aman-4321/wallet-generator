import { useState, useCallback } from "react";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair, PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";
import { Button } from "@/components/ui/button";
import { CopyIcon, PlusIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

interface SolanaWalletProps {
  mnemonic: string;
}

export function SolanaWallet({ mnemonic }: SolanaWalletProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [publicKeys, setPublicKeys] = useState<PublicKey[]>([]);

  const addWallet = useCallback(async () => {
    const seed = await mnemonicToSeed(mnemonic);
    const path = `m/44'/501'/${currentIndex}'/0'`;
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const keypair = Keypair.fromSecretKey(secret);
    setCurrentIndex((prevIndex) => prevIndex + 1);
    setPublicKeys((prevKeys) => [...prevKeys, keypair.publicKey]);
  }, [mnemonic, currentIndex]);

  const copyToClipboard = useCallback((address: string) => {
    navigator.clipboard.writeText(address);
    toast.success("Address copied to clipboard");
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-700">Solana Wallets</h2>
      <Button
        onClick={addWallet}
        className="w-full bg-black text-white hover:bg-gray-800 transition-colors"
      >
        <PlusIcon className="mr-2 h-4 w-4" />
        Generate SOL Wallet
      </Button>
      <div className="space-y-2">
        {publicKeys.map((publicKey, index) => (
          <motion.div
            key={publicKey.toBase58()}
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
                {publicKey.toBase58()}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copyToClipboard(publicKey.toBase58())}
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
