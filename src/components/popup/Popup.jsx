import React from 'react'
import styles from "./Popup.module.css"

export default function Popup({message, error}) {
  return (
    <div className={styles.container}>
        <div className={styles.box} style={{backgroundColor : !error ? "red" : "green"}}>{message}</div>
    </div>
  )
}
