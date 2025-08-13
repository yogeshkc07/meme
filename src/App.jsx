import React, { useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import { Header } from "./Header";
import { Meme } from "./Meme";
import { Footer } from "./Footer";

export function App() {
  useEffect(() => {
    // Ensure the app is ready
    sdk.actions.ready().then(() => {
      console.log("Farcaster Mini App SDK is ready!");
    });
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
