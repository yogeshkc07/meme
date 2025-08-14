import React, { useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import { Header } from "./Header";
import { Meme } from "./Meme";
import { Footer } from "./Footer";

export function App() {
  useEffect(() => {
    async function readySDK() {
      try {
        await sdk.actions.ready();
        console.log("Farcaster SDK is ready!");
      } catch (err) {
        console.error("Error calling sdk.actions.ready():", err);
      }
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
