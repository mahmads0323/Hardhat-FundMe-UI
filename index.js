import { ethers } from "./ethers-5.6esm.js"
import { abi, contractAddress } from "./constants.js"

const connectBtn = document.getElementById("connect");
const sendBtn = document.getElementById("send");
const sendValue = document.getElementById("sendValue");
const checkBalance = document.getElementById("checkBalance");
const contractBalance = document.getElementById("contractBalance");
const withdraw = document.getElementById("withdraw");
const frontUI = document.getElementById("front-ui");
const mainUI = document.getElementById("main-ui");

connectBtn.innerText = "connect";
sendBtn.innerText = "send";
checkBalance.innerText = "contract Balance";
withdraw.innerText = "withdraw";

connectBtn.onclick = connect;
sendBtn.onclick = send;
checkBalance.onclick = getContractBalance;
withdraw.onclick = withdrawFund;

// connect
async function connect() {
    if (window.ethereum !== "undefined") {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" })
            connectBtn.innerText = "connected";
        } catch (error) {
            console.log(error);
        }
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        frontUI.style.display = "none";
        mainUI.style.display = "flex";

    }
    else {
        connectBtn.innerText = "Please Install metamask"
    }
}

// fund

async function send() {
    if (window.ethereum !== "undefined") {
        console.log(`sending ${sendValue.value}Eth`);
        // getting provider
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        try {
            const txResponse = await contract.sendFunds({ value: ethers.utils.parseEther(sendValue.value) })
            // wait for txResponse event to be fullfilled
            await listenForTransaction(txResponse, provider);
        } catch (e) {
            console.log(`Sending error: ${e}`)
        }
    } else {
        console.log("not found")
    }
}

function listenForTransaction(txResponse, provider) {
    console.log(`txHash: ${txResponse.hash}`);
    return new Promise((resolve, rej) => {
        provider.once(txResponse.hash, (transactionRecepient) => {
            console.log(`confirmed with: ${transactionRecepient.confirmations} confirmations`)
            resolve();
        })
    })
}

// checkBalance
async function getContractBalance() {
    if (window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(contractAddress);
        contractBalance.innerText = `Latest Balance is: ${ethers.utils.formatEther(balance)} Eth`
    }
    else {
        console.log("not found")
    }
}

// withdraw
async function withdrawFund() {
    if (window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        await contract.withdrawFunds();
        console.log("withdraw successful")
    }
    else {
        console.log("not found")
    }
}