import { useState } from "react";
import "./App.css";
import { generateMnemonic } from "bip39";
import { SolanaWallet } from "./SolanaWallet";
import { EthWallet } from "./EthWallet";

function App() {
  const [mnemonic, setMnemonic] = useState("");

  return (
    <div className="bg-slate-100 min-h-screen flex flex-col items-center p-6">
      <header className="w-full max-w-4xl text-center mb-12">
        <h1 className="text-5xl font-extrabold text-gray-800">
          Wallet Generator
        </h1>
      </header>

      <button
        onClick={async function () {
          const mn = generateMnemonic();
          setMnemonic(mn);
        }}
        className="px-6 py-3 bg-black text-white rounded-md shadow-md hover:bg-gray-800 transition"
      >
        Create Seed Phrase
      </button>

      {mnemonic && (
        <div className="w-full max-w-4xl p-4">
          <div className="grid grid-cols-4 gap-2">
            {mnemonic.split(" ").map((word, index) => (
              <div
                key={index}
                className="flex items-center justify-center h-16 bg-white border border-gray-300 rounded-md shadow-sm text-center text-gray-700"
              >
                {word}
              </div>
            ))}
          </div>
        </div>
      )}

      {mnemonic && <SolanaWallet mnemonic={mnemonic} />}
      {mnemonic && <EthWallet mnemonic={mnemonic} />}
    </div>
  );
}

export default App;
