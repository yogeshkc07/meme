import React, { useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import { Header } from "./Header";
import { Meme } from "./Meme";
import { Footer } from "./Footer";

export function App() {
  useEffect(() => {
    async function readySDK() {
      await sdk.actions.ready();
    }
    readySDK();
  }, []);

  return (
    <>
      <Header />
      <Meme />
      <Footer />
    </>
  );
}

export default App;
