import styles from '../../../styles/MineSingle.module.css';
import { useState } from 'react';
import { NETWORK, CITY_COIN_CORE_ADDRESS, CITY_COIN_CORE_CONTRACT_NAME } from "../../../lib/constants";
import { uintCV, noneCV, makeStandardSTXPostCondition, PostConditionMode, FungibleConditionCode, AnchorMode, } from '@stacks/transactions';
import { userSessionState } from '../../../lib/auth';
import { useConnect } from '@stacks/connect-react';
import { useAtom } from 'jotai';
import { addMinedBlocks } from '../../../lib/kv';

const MineSingle = () => {

  const [STXAmount, setSTXAmount] = useState();
  const [txId, setTxId] = useState();
  const { doContractCall } = useConnect();
  const [userSession] = useAtom(userSessionState);

  const userData = userSession.loadUserData();

  const STXAddress = userData.profile.stxAddress.testnet;
  const appPrivateKey = userData.appPrivateKey;
 
  async function mineSingle() {
    let CVAmount = uintCV(Math.floor(parseFloat(STXAmount.trim()) * 1000000));
    await doContractCall({
      contractAddress: CITY_COIN_CORE_ADDRESS,
      contractName: CITY_COIN_CORE_CONTRACT_NAME,
      functionName: 'mine-tokens',
      functionArgs: [CVAmount, noneCV()],
      postConditionMode: PostConditionMode.Deny,
      postConditions: [
        makeStandardSTXPostCondition(
          STXAddress,
          FungibleConditionCode.Equal,
          CVAmount.value
        ),
      ],
      network: NETWORK,
      onFinish: (data) => {
        console.log('ONFINISH TRIGGERED')
        console.log(`TRANSACTION DATA: ${data}`)
        setTxId(data.txId);
      },
    });
    // KV CALLS

    // TEMP SOLUTION FOR ONFINISH TRAN ID
    const res = await fetch('https://stacks-node-api.testnet.stacks.co/v2/info')
    const result = await res.json();
    const blockHeight = result.stacks_tip_height;

    console.log(appPrivateKey);

    addMinedBlocks(STXAddress, appPrivateKey, blockHeight);

  }

  return (
    <div className={styles.mine}>
      <h2 className={styles.h2}>Mine a single block</h2>
      <p>Enter how much you’d like to spend.</p>
      <div className={styles.transactionToSend}>
        <input onChange={ event => setSTXAmount(event.target.value) } placeholder="How many STX?" type="number" />
        <button onClick={ mineSingle } className={styles.transactionButton}>Send Transaction</button>
      </div>
    </div>
  );
};

export default MineSingle;