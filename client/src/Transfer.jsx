import { useState } from "react";
import server from "./server";
import {secp256k1} from 'ethereum-cryptography/secp256k1';
import { keccak256 } from "ethereum-cryptography/keccak";


function Transfer({ address, setBalance, privateKey}) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);


  const hashMessage = message => keccak256(Uint8Array.from(message));
  const signMessage = msg => secp256k1.sign(hashMessage(msg),privateKey);

  async function transfer(evt) {
    evt.preventDefault();
    console.log("Type PK: " + typeof(privateKey));
    const msg = { amount: parseInt(sendAmount), recipient };
    const sig = signMessage(msg);
    console.log("This");

    const stringifyBigInts = obj =>{
      for(let prop in obj){
        let value = obj[prop];
        if(typeof value === 'bigint'){
          obj[prop] = value.toString();
        }else if(typeof value === 'object' && value !== null){
          obj[prop] = stringifyBigInts(value);
        }
      }
      return obj;
    }

    
    

    // stringify bigints before sending to server
    const sigStringed = stringifyBigInts(sig);
  
    const tx = {
      sig:sigStringed, msg, sender: address
    }

    try {
      const {
        data: { balance },
      } = await server.post(`send`, tx);
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;