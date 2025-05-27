const { ethers } = require("ethers")
const Wallet = require("./wallet.utils")
const chalk = require("chalk")
const moment = require("moment-timezone")
require("dotenv").config()

const stats = {
    success: 0,
    reverted: 0,
    total: 0
}

const timestamp = () => {
    return chalk.cyanBright(`[${moment().tz('Asia/Jakarta').format('HH:mm:ss')}]`)
}

module.exports = { timestamp }

async function main() {
    const senderWallet = process.env.treasury_wallet
    const rpc = new ethers.JsonRpcProvider(process.env.sepoliaRpc)

    const wallet = new ethers.Wallet(senderWallet, rpc)
    const recipients = await Wallet.loadAddress()

    if (senderWallet === "") {
        console.log("no private key found ")
        process.exit(1)
    }

    if (recipients.length === 0) {
        console.log("no address found")
        process.exit(1)
    }

    const amount = ethers.parseEther("0.0001") // change this amount with the amount that u want

    let i = 0
    let cycle = 0

    while (cycle < recipients.length) {
        console.clear()
        console.log("success  :", stats.success)
        console.log("reverted :", stats.reverted)
        console.log("total    :", stats.total)
        console.log("\nloaded recipients:", recipients.length)
        console.log("\n")
        try {
            console.log(timestamp(), chalk.yellowBright(` SENDING TOKEN TO ${recipients[i]} [${i}]`))
            const tx = await wallet.sendTransaction({
                to: recipients[i],
                value: amount
            })

            await tx.wait()

            const receipt = await rpc.getTransactionReceipt(tx.hash)

            if (receipt.status !== 1) {
                console.log(timestamp(), chalk.redBright(` FAILED SENDING TOKEN TO ${recipients[i]} [${i}]`))
                stats.reverted++
                stats.total++
                return
            } else {
                console.log(timestamp(), chalk.greenBright(` SUCCESSFULLY SENDING TOKEN TO ${recipients[i]} [${i}]`))
                stats.success++
                stats.total++
            }
        } catch (error) {
            console.log(timestamp(), chalk.redBright(` ${error}`))
        }

        i++
        cycle++
        if (cycle < recipients.length) {
            console.log(timestamp(), chalk.yellowBright(" waiting 10000ms.."))
            await new Promise(r => setTimeout(r, 10000))
        } else {
            break
        }
    }

    console.log(timestamp(), chalk.greenBright(` SUCCESSFULLY SENDING TO ${stats.success} ADDRESS`))
}

main()