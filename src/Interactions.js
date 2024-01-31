import React, { useState, useEffect } from 'react';
import styles from './Wallet.module.css';

const Interactions = (props) => {
    const [transferhash, setTransferHash] = useState('');
    const [symbol, setSymbol] = useState('');
    const [decimals, setDecimals] = useState('');
    const [name, setContractName] = useState('');
    const [balanceOf, settokenBalance] = useState('');
    
    useEffect(() => {
        const fetchContractInfo = async () => {
            try {
                let tokenSymbol = await props.contract.symbol();
                setSymbol(tokenSymbol);

                let tokenDecimals = await props.contract.decimals();
                setDecimals(tokenDecimals);

                let tokenContractName = await props.contract.name();
                setContractName(tokenContractName);

                let tokenBalance = await props.contract.balanceOf(props.defaultAccount);
                settokenBalance(tokenBalance);

            } catch (error) {
                console.error('Error fetching contract info:', error.message);
            }
        };

        fetchContractInfo(); // Call the function to fetch contract info
    }, [props.contract], props.defaultAccount); 

    const transferHandler = async (e) => {
        e.preventDefault();
        let transferAmount = e.target.sendAmount.value;
        let receiverAddress = e.target.receiverAddress.value;

        let tx = await props.contract.transfer(receiverAddress, transferAmount); 
        console.log(tx);
        setTransferHash("Transfer confirmation hash: " + tx.hash);
    }

    return (
        <div className={styles.interactionsCard}>
            <form onSubmit={transferHandler}>
            <div>
            <p>Token Name: {name}</p>
             <p>Token Symbol: {symbol}</p>
            <p>Token Decimal: {decimals}</p>
            <p>Token Balance: {typeof balanceOf === 'object' ? balanceOf.toString() : balanceOf }</p>
              </div>
                <h3> Transfer Token </h3>
                <input type='text' placeholder='receiver address' id='receiverAddress' className={styles.addressInput} /><br></br>
                <input type='number' placeholder='amount'id='sendAmount' className={styles.numberInput} min='0' step='1' />

                <button type='submit' className={styles.button6}>Send</button>
                <div>
                    {transferhash}
                </div>
            </form>
        </div>
    );
}

export default Interactions;



