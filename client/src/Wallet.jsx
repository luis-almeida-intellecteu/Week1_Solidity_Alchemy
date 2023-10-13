import server from "./server";

import { sha256 } from "ethereum-cryptography/sha256.js";
import { utf8ToBytes } from "ethereum-cryptography/utils.js";
import * as secp from 'ethereum-cryptography/secp256k1';
import { bytesToHex as toHex } from "ethereum-cryptography/utils.js";

function Wallet({ address, setAddress, balance, setBalance, account, setAccount, privateKey, setPrivateKey}) {
  async function onChange(evt) {
    const account = evt.target.value;
    setAccount(account);
    const address = getAddress(account);
    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  function getAddress(key) {
    const mapKey = new Map();
    mapKey.set("u1", 'e285f9c21a46c5f455195a4eefd6d2119aca121f2f05989a8ce8d530fb1f2671');
    mapKey.set("u2", 'c678c77589c7cf088599fe2424a78cc6fd539ef8a7b4961c94d29369b474feb6');
    mapKey.set("u3", 'a2598eb43578d87b200cedfb793327af14d3abf62fc36e35351b05b681ea629c');

    const privateKey = mapKey.get(key) || undefined;
    
    console.log(privateKey + " , " + typeof(privateKey))
    setPrivateKey(privateKey);
    var address = "Not defined";
    if (privateKey !== undefined)
      {address = toHex(secp.secp256k1.getPublicKey(privateKey));}
    console.log("Address: " + address);
    return address;

  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Account
        <input placeholder="Type your Account name..." value={account} onChange={onChange}></input>
      </label>
      <div className="balance">  Private Key: {privateKey}</div>
      <div className="balance">  Address: {address}</div>
      <div className="balance">  Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
