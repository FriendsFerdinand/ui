import styles from '../../../styles/Redeem.module.css';
import { useState } from 'react';

const Redeem = () => {
  return (
    <div className={styles.redeem}>
      <h2 className={styles.h2}>Redeem rewards</h2>
      <p>
        Claim your STX rewards from stacking your MiamiCoin, or claim your MIA
        rewards from mining MiamiCoin.
      </p>

      <p>
        You need to have either stacked MiamiCoin or mined MiamiCoin already to
        redeem the rewards.
      </p>

      <div className={styles.buttons}>
        <button className={styles.redeemStacking}>Stacking Rewards</button>
        <button className={styles.redeemMining}>Mining Rewards</button>
      </div>
    </div>
  );
};

export default Redeem;
