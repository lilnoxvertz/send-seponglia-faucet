## SETUP

1. install packages

   ```bash
   npm install
   ```

2. set your private key on .env (the wallet that have the sepolia faucet)

   ```bash
   treasury_wallet=0x987411u1dscniy9812
   ```

3. set recipient address on recipient.txt

4. set sepolia rpc on .env (you can get it from alchemy)
   ```bash
   sepoliaRpc=yourRpcKeyHere
   ```

## RUNNING THE BOT

1. first set the amount that you wanted to send to the recipient address. go to main.js and find this code at line 21
   ```bash
   const amount = ethers.parseEther("0.0001")
   ```
2. after that, you can run the bot by typing this in the console
   ```bash
   npm start
   ```
