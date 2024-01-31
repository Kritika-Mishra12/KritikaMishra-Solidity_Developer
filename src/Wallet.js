import {React, useState} from 'react'
import {ethers} from 'ethers'
import styles from './Wallet.module.css'
import DigitalToken_abi from './Contracts/DigitalToken.json'
import Interactions from './Interactions';

const Wallet = () => {

	let contractAddress = '0x496aeCcFF38Cfe3B939fC6A78D96d607Fb102F0B';

	const [errorMessage, setErrorMessage] = useState(null);
	const [defaultAccount, setDefaultAccount] = useState(null);
	const [connButtonText, setConnButtonText] = useState('Connect Wallet');

	const [contract, setContract] = useState(null);
	const [signer, setSigner] = useState(null);
	const [provider, setProvider] = useState(null);
   
    const connectWalletHandler = () => {
		if (window.ethereum && window.ethereum.isMetaMask) {

			window.ethereum.request({ method: 'eth_requestAccounts'})
			.then(result => {
				accountChangedHandler(result[0]);
				setConnButtonText('Wallet Connected');
			})
			.catch(error => {
				setErrorMessage(error.message);
			});
        } else {
			console.log('Need to install MetaMask');
			setErrorMessage('Please install MetaMask browser extension to interact');
		}
	}

	// update account, will cause component re-render
	const accountChangedHandler = (newAccount) => {
		setDefaultAccount(newAccount);
		updateEthers();
	}

	const chainChangedHandler = () => {
		// reload the page to avoid any errors with chain change mid use of application
		window.location.reload();
	}
    window.ethereum.on('accountsChanged', accountChangedHandler);

	window.ethereum.on('chainChanged', chainChangedHandler);

	const updateEthers= async () => {
		let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
		setProvider(tempProvider);

		let tempSigner = tempProvider.getSigner();
		setSigner(tempSigner);

		let tempContract = new ethers.Contract(contractAddress, DigitalToken_abi, tempSigner);
		setContract(tempContract);	
    }
	
	return (
	<div>
			<h2> ERC-20 Contract Interaction </h2>
			<button className={styles.button6} onClick={connectWalletHandler}>{connButtonText}</button>

			<div className={styles.walletCard}>
			<div>
				<h3>Address: {defaultAccount}</h3>
			</div>

			{errorMessage}             
		</div>
		<Interactions contract = {contract} defaultAccount={defaultAccount}/>
	</div>
	)
}
export default Wallet;