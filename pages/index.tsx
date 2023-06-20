import React, { useState, useEffect } from "react";
import type { NextPage } from "next";
import styles from "../styles/Main.module.css";
import NFTGrid from "../components/NFT/NFTGrid";
import {
  ConnectWallet,
  useAddress
} from "@thirdweb-dev/react";
import { nftDropAddress } from "../const/constants";
import Container from "../components/Container/Container";
import toast from "react-hot-toast";
import toastStyle from "../util/toastConfig";
import Web3 from "web3";
import abi from '../const/CreatorToken.json';

const Home: NextPage = () => {
  const address = useAddress();
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [nfts, setNfts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchNfts() {
      if (window.ethereum && address) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        const creatorTokenContract = new web3Instance.eth.Contract(abi, nftDropAddress);
        setContract(creatorTokenContract);

        setIsLoading(false);
      }
    }

    fetchNfts();
  }, [address]);


  // State variables for user input
  const [creatorName, setCreatorName] = useState("");
  const [creatorDescription, setCreatorDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [profilePicture, setProfilePicture] = useState("");

  const handleClaim = async () => {
    if (
      creatorName.trim() === "" ||
      creatorDescription.trim() === "" ||
      website.trim() === "" ||
      profilePicture.trim() === ""
    ) {
      setErrorMessage("Please fill in all the fields");
      return;
    }
    setErrorMessage("");

    // Proceed with the mint action
    try {
      await contract.methods.mint(
        address,
        creatorName,
        creatorDescription,
        website,
        profilePicture
      ).send({ from: address, gas: 300000 });

      toast("NFT Minted Successfully!", {
        icon: "✅",
        style: toastStyle,
        position: "bottom-center",
      });
    } catch (e) {
      console.log(e);
      toast(`NFT Minting Failed! Reason: ${e.message}`, {
        icon: "❌",
        style: toastStyle,
        position: "bottom-center",
      });
    }
  };

  return (
    <Container maxWidth="lg">
      {address ? (
        <div className={styles.container}>
          <h1>CreatorNFT</h1>
          <NFTGrid
            nfts={nfts}
            isLoading={isLoading}
            emptyText={"Looks like you don't own any NFTs."}
          />
          <p>
            Browse the NFTs inside your CreatorNFT, select one to connect a
            CopyRightNFT & view it.
          </p>
          <p>
         Enter the following information to issue a CreaterNFT.
          </p>
          <input
            type="text"
            placeholder="Creator Name"
            value={creatorName}
            onChange={(e) => setCreatorName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Creator Description"
            value={creatorDescription}
            onChange={(e) => setCreatorDescription(e.target.value)}
          />
          <input
            type="text"
            placeholder="Website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
          <input
            type="text"
            placeholder="Profile Picture URL"
            value={profilePicture}
            onChange={(e) => setProfilePicture(e.target.value)}
          />
          <div className={styles.btnContainer} style={{ textAlign: 'center' }}>
            <button onClick={handleClaim}>
              Claim CreatorNFT
            </button>
            {errorMessage && (
              <div style={{ display: "block", color: "red", marginTop: "8px" }}>
                {errorMessage}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className={styles.container}>
          <h2>Connect a personal wallet to view your owned NFTs</h2>
          <ConnectWallet />
        </div>
      )}
    </Container>
  );
};

export default Home;
