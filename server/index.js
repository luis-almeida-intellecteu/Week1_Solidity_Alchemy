const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require('ethereum-cryptography/secp256k1');
const {keccak256} = require('ethereum-cryptography/keccak');

app.use(cors());
app.use(express.json());

// public keys
const balances = {
    '020f12148b65ad5525243099a48785ff481a2119c5c20b2db3c2d6d4042f89f9a7': 100, 
    '033379c4d7b2a697ff44aed9d61fd0559ee6a9029d87a3d9d9938ffe38ee7e01f4': 50, 
    '02bc87494f951f7fded5714f1fbdf56a319fece2e7edcfe78ed14f14a207e6c5c4': 75, 
  };
  

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, sig:sigStringed, msg } = req.body;
  const { recipient, amount } = msg;

  // convert stringified bigints back to bigints
  const sig = {
    ...sigStringed,
    r: BigInt(sigStringed.r),
    s: BigInt(sigStringed.s)
  }

  const hashMessage = (message) => keccak256(Uint8Array.from(message));

  const isValid = secp.secp256k1.verify(sig, hashMessage(msg), sender) === true;
  
  if(!isValid) res.status(400).send({ message: "Bad signature!"});

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}