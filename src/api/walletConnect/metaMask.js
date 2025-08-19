
import Web3 from "web3";

const web3 = new Web3();
const ethereum = window.ethereum;

export default {
    web3,
    isInstalled: function (){
        return typeof window.ethereum !== "undefined";
    },
    isMainNet: function (){},
    isConnected: function (){
        if (this.isInstalled())
            return window.ethereum.isConnected()
        else
            throw new Error("metaMask is not available")
    },
    connect: async function (){
        return await ethereum.request({ method: 'eth_requestAccounts' });
    },
    checkConnectStatus: async function(){
        return await this.connect()
    },
    getAccounts: async function (){
        return await this.connect()
    },
    getChainId() {
        return ethereum.chainId
    },
    getSelectedAccount: async function (){
        await this.checkConnectStatus()
        return await ethereum.selectedAddress;
    },
    getBalance: async function(address) {
        await this.checkConnectStatus()
        return await ethereum.request({ method: 'eth_getBalance' ,params:[address, "latest"]});
    },
    sign: async function(address, message){
        await this.checkConnectStatus()
        return await ethereum.request({
            method: 'eth_signTypedData_v3',
            params:[address, this.eip712(message)],
            from: address
        });
    },
    personal_sign: async function(address, message){
        await this.checkConnectStatus()
        return await ethereum.request({
            method: 'personal_sign',
            params:[address, message],
            from: address
        });
    },
    eth_sign: async function(address, message){
        await this.checkConnectStatus()
        return await ethereum.request({
            method: 'eth_sign',
            params:[address, message],
            from: address
        });
    },
    verify(message, sign){
        return this.web3.eth.accounts.recover(message,sign)
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
        await this.checkConnectStatus()
        return await ethereum.request({
            method: 'eth_sendTransaction',
            params: [{ from: await this.getSelectedAccount(), to, value, data }],
        });
    },
    // 选择区块链
    switchEthereumChain: async function({
        chainId='0x38',
        chainName='Binance Smart Chain',
        rpcUrls=['https://bsc-dataseed.binance.org/'],
    }){
        try{
            return await ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId }],
            });
        }catch(e){
            if (e.code === 4902)
                return await ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{ chainId, chainName, rpcUrls, }],
                });
        }
    },
    async switchToBSC() {
        return new Promise((resolve, reject) => {
 
            ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x38' }],
            }).then(()=> {
                resolve()
            }).catch(async switchError => {
                // This error code indicates that the chain has not been added to MetaMask.
                if (switchError.code === 4902) {
                    try {
                        await ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [
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
                            ],
                        })
                        await this.switchToBSC().then(()=>  {
                            resolve()
                        }).catch(err => {
                            reject(err)
                        })
                    } catch (addError) {
                        // handle "add" error
                        reject(addError)
                    }
                }
                // handle other "switch" errors
                reject(switchError)
            })
        })
    }
}
