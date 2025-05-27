const fs = require("fs")

class Wallet {
    static async loadAddress() {
        return fs.readFileSync("recipient.txt", "utf-8")
            .split("\n")
            .filter(line => line.trim())
            .map(address => address.trim())
    }
}

module.exports = Wallet