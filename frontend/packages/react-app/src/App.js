import { useQuery } from "@apollo/react-hooks";
import { Contract } from "@ethersproject/contracts";
import { getDefaultProvider } from "@ethersproject/providers";
import React, { useEffect, useState } from "react";

import { Body, Button, Header, Image, Link } from "./components";
import useWeb3Modal from "./hooks/useWeb3Modal";

import { addresses, abis } from "@project/contracts";
import GET_TRANSFERS from "./graphql/subgraph";

async function readOnChainData() {
  

}

function WalletButton({ provider, loadWeb3Modal, logoutOfWeb3Modal }) {
  const [account, setAccount] = useState("");
  const [rendered, setRendered] = useState("");

  useEffect(() => {
    async function fetchAccount() {
      try {
        if (!provider) {
          return;
        }

        // Load the user's accounts.
        const accounts = await provider.listAccounts();
        setAccount(accounts[0]);

        // Resolve the ENS name for the first account.
        const name = await provider.lookupAddress(accounts[0]);

        // Render either the ENS name or the shortened account address.
        if (name) {
          setRendered(name);
        } else {
          setRendered(account.substring(0, 6) + "..." + account.substring(36));
        }
      } catch (err) {
        setAccount("");
        setRendered("");
        console.error(err);
      }
    }
    fetchAccount();
  }, [account, provider, setAccount, setRendered]);

  return (
    <Button
      onClick={() => {
        if (!provider) {
          loadWeb3Modal();
        } else {
          logoutOfWeb3Modal();
        }
      }}
    >
      {rendered === "" && "Connect Wallet"}
      {rendered !== "" && rendered}
    </Button>
  );
}

function App() {
  const { loading, error, data } = useQuery(GET_TRANSFERS);
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();
  const [img, setImg] = useState("");

  async function see() {
    try {
      // Should replace with the end-user wallet, e.g. Metamask
      const defaultProvider = getDefaultProvider(4);
      const shop = new Contract(addresses.shop, abis.shop, defaultProvider);
      const idRaw = await shop.id();
      const id = idRaw.toString();

      console.log("NFT id:", id);

      const thistle = new Contract(addresses.thistle, abis.thistle, defaultProvider);
      const image = await thistle.tokenURI(id);
      
      console.log("image: ", image);
      setImg(image);
      console.log("image: ", img);

    } catch (err) {
      console.error(err);
  }
}
see();

  React.useEffect(() => {
    if (!loading && !error && data && data.transfers) {
      console.log({ transfers: data.transfers });
    }
  }, [loading, error, data]);

  return (
    <div>
      <Header>
        <WalletButton provider={provider} loadWeb3Modal={loadWeb3Modal} logoutOfWeb3Modal={logoutOfWeb3Modal} />
      </Header>
      <Body>
        {img &&
          <Image src={img} alt="react-logo" />
        }
        <p>
          Tinos Thistle #1
        </p>
        <p>
          Current price: 10 MATIC
        </p>
        
        <Button onClick={() => readOnChainData()}>
          Buy
        </Button>
        
        <div>
          <Link href="https://thegraph.com/docs/quick-start">See on Etherscan</Link>
        </div>
      </Body>
    </div>
  );
}

export default App;
