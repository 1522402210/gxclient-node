import GXClient from "../lib/src/GXClient";
import {Aes, PrivateKey} from "gxbjs";

const private_key = "";
const account_id = "1.2.525166";
const memo_private = "";

let client = new GXClient(private_key, account_id);

// start to detect new transactions related to my account from the indicated block
client.detectTransaction(10904333, function (blockHeight, txid, operation) {
    console.log(blockHeight, txid, operation);
    //deal with transfer operation
    if (operation[0] === 0) {
        // deal with deposit
        if (operation[1].to === account_id) {
            let memo = operation[1].memo;
            // decrypt memo if assigned
            if (memo) {
                let decryptedMsg = Aes.decrypt_with_checksum(PrivateKey.fromWif(memo_private), memo.from, memo.nonce, memo.message);
                console.log("memo:", decryptedMsg);
                // TODO: Persistent blockHeight, txid and operation to the database,
                // it's recommended to use blockHeight and txid as the primary key
            } else {
                console.log("no memo:", txid);
            }
        }
        // deal with withdraw
        if (operation[1].from === account_id) {
            console.log(txid, " should be confirmed");
        }
    }
});
