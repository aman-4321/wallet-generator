import { useState, useCallback } from "react";
import { generateMnemonic } from "bip39";
import { SolanaWallet } from "./SolanaWallet";
import { EthWallet } from "./EthWallet";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { RefreshCwIcon, EyeIcon, EyeOffIcon, CopyIcon } from "lucide-react";

// const ParticleBackground = () => {
//   const particleCount = 50;
//   return (
//     <div className="absolute inset-0 overflow-hidden">
//       {[...Array(particleCount)].map((_, i) => (
//         <motion.div
//           key={i}
//           className="absolute w-1 h-1 bg-black rounded-full"
//           initial={{
//             x: Math.random() * window.innerWidth,
//             y: Math.random() * window.innerHeight,
//           }}
//           animate={{
//             x: Math.random() * window.innerWidth,
//             y: Math.random() * window.innerHeight,
//           }}
//           transition={{
//             duration: Math.random() * 10 + 20,
//             repeat: Infinity,
//             repeatType: "reverse",
//           }}
//         />
//       ))}
//     </div>
//   );
// };

export default function Component() {
  const [mnemonic, setMnemonic] = useState("");
  const [showMnemonic, setShowMnemonic] = useState(false);

  const generateNewMnemonic = useCallback(() => {
    const newMnemonic = generateMnemonic();
    setMnemonic(newMnemonic);
    setShowMnemonic(false);
    toast.success("New seed phrase generated");
  }, []);

  const toggleMnemonicVisibility = useCallback(() => {
    setShowMnemonic((prev) => !prev);
  }, []);

  const copyMnemonic = useCallback(() => {
    navigator.clipboard.writeText(mnemonic);
    toast.success("Seed phrase copied to clipboard");
  }, [mnemonic]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-8 relative overflow-hidden">
      <Toaster position="top-right" />
      {/* <ParticleBackground /> */}

      <motion.div
        className="relative z-10 w-full max-w-4xl space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-center text-gray-800">
          Wallet Generator
        </h1>

        <div className="flex justify-center">
          <Button
            onClick={generateNewMnemonic}
            className="bg-black text-white hover:bg-gray-800 transition-colors"
          >
            <RefreshCwIcon className="mr-2 h-4 w-4" />
            Generate Seed Phrase
          </Button>
        </div>

        {mnemonic && (
          <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-700">
                  Mnemonic Phrase
                </h2>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleMnemonicVisibility}
                    aria-label={
                      showMnemonic ? "Hide seed phrase" : "Show seed phrase"
                    }
                  >
                    {showMnemonic ? (
                      <EyeOffIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyMnemonic}
                    aria-label="Copy seed phrase"
                  >
                    <CopyIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                {mnemonic.split(" ").map((word, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 border border-gray-300 rounded-md p-2 text-center font-mono text-sm"
                  >
                    {showMnemonic ? word : "•".repeat(word.length)}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <EthWallet mnemonic={mnemonic} />
              <SolanaWallet mnemonic={mnemonic} />
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
