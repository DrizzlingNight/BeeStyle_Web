import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";

import Web3 from "web3";

const web3 = new Web3();

// Create a connector
const connector = new WalletConnect({
    bridge: "https://bridge.walletconnect.org", // Required
    qrcodeModal: QRCodeModal,
});

window.connector = connector

let connectType = ''
let connectResolve = null
let connectReject = null

connector.on("connect", (error, payload) => {

    if (connectType === 'getAccountAddress') {
        
        const { accounts } = payload.params[0];
        if (accounts.length > 0) {
            if (connectResolve) connectResolve(accounts[0])
        } else {
            if (connectReject) connectReject()
        }
    } else if (connectType === 'switchToBSC') {
        if (connectResolve) {
            connectResolve()
        }
    }

});



export default {
    async checkConnection() {
        return new Promise((resolve, reject) => {
            if (!connector.connected) {
                connector.createSession({ chainId: '0x38'})
                connectResolve = resolve
                connectReject = reject
            } else {
                resolve()
            }
        })
    },
    async getAccountAddress()  {

        connectType = "getAccountAddress"

        
            return  new Promise((resolve, reject) => {
                this.checkConnection().then ((account) => {

                    if (account) {
                        resolve(account)
                    } else {
                        const accounts = connector.accounts
                        if (accounts.length > 0) {
                            resolve(accounts[0])
                        } else {
                            reject()
                        }
                    }
                }).catch( () => {
                    console.log('check connection reject')
                    connectResolve = resolve
                    connectReject = reject
                })
        })

    },
    getChainId() {
        return connector.connected ? connector.chainId : ''
    },
    async switchToBSC() {
        connectType = "switchToBSC"

        return new Promise((resolve, reject) => {

            this.checkConnection().then( ()=> {
                    if (connector.chainId === 56) {
                        resolve()
                        return
                    }
        
                    // switch to 0x38 network
                    const switchNetworkReq = {
                        id: 1,
                        jsonrpc: '2.0',
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: '0x38' }],
                    }
        
                    connector.sendCustomRequest(switchNetworkReq).then (res => {
                        resolve(res)
                    }).catch( err => {
                        const errStr = String(err)
                        if (errStr.indexOf('wallet_addEthereumChain') != -1) { // have no 0x38 chain
                            const params = [
                                {
                                    chainId: '0x38',
                                    chainName: 'Binance Smart Chain',
                                    rpcUrls: ['https://bsc-dataseed.binance.org/'], /* ... */
                                    nativeCurrency: {
                                        name: 'BNB',
                                        symbol: 'BNB',
                                        decimals: 18
                                    },
                                    blockExplorerUrls: ['https://bscscan.com']
                                },
                            ]
                            const addNetworkReq = {
                                id: 1,
                                jsonrpc: '2.0',
                                method: 'wallet_addEthereumChain',
                                params: params
                            }
        
                            // add 0x38 network
                            connector.sendCustomRequest(addNetworkReq).then( res => {
                                resolve(res)
                            }).catch( err => {
                                reject(err)
                            })
                        } else if (errStr.indexOf('JSON RPC response format is invalid') != -1) {
                            resolve()
                        }
                    })
            })
        })
    },
    encodeSafeTransferData: function(params){
        const abi = {"name": "safeTransferFrom", "type": "function", "inputs": [{"name": "from", "type": "address", "internalType": "address"}, {"name": "to", "type": "address", "internalType": "address"}, {"name": "tokenId", "type": "uint256", "internalType": "uint256"}], "outputs": [], "stateMutability": "nonpayable"}
        return web3.eth.abi.encodeFunctionCall(abi, params)
    },
    // 发送交易
    sendTransaction: async function({
        to='0x0000000000000000000000000000000000000000', // Required except during contract publications.
        value, // Only required to send ether to the recipient from the initiating external account.
        data, // Optional, but used for defining smart contract creation and interaction.
    }){

        const txData = {
            from: connector.accounts[0],
            to,
            value,
            data
        }
        return await connector.sendTransaction(txData)
    },
}