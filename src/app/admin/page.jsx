"use client"

import styles from "./page.module.css"
import { useEffect, useState } from "react"
import TimeAgo from "javascript-time-ago"
import en from "javascript-time-ago/locale/en.json"
import ru from "javascript-time-ago/locale/ru.json"
import ReactTimeAgo from "react-time-ago"
import Link from "next/link"

function Page() {
    TimeAgo.addDefaultLocale(en)
    TimeAgo.addLocale(ru)
    const [patients, setPatients] = useState()
    useEffect(()=>{
        async function getPatient(){
            const res = await fetch(`http://localhost:3000/api/getAll`)
            const body = await res.json()
            setPatients(body)
        }
        getPatient() 
    },[])
    const pending = patients?.filter(i => i?.collected == false)
    const collected = patients?.filter(i => i?.collected == true)
    
  return (
    <div className={styles.container}>
        <nav className={styles.nav}>
            <img src="/logo-hopkins.jpg" alt="" />
            <ul>
                <Link href={"/admin"}><li>Home</li></Link>
                <Link href={"/admin/pending"}><li>Pending Results</li></Link>
                <Link href={"/admin/collected"}><li>Collected Results</li></Link>
                <Link href={"/admin/history"}><li>History</li></Link>
            </ul>
        </nav>
        <main className={styles.main}>
            <h2>Overview</h2>
            <section className={styles.dashboard}>
                <div>
                    <h3>Total Results</h3>
                    <h1>{patients?.length}</h1>
                </div>
                <div>
                    <h3>Pending Results</h3>
                    <h1>{pending?.length}</h1>
                </div>
                <div>
                    <h3>Collected Results</h3>
                    <h1>{collected?.length}</h1>
                </div>
            </section>
            <section className={styles.stats}>
                <div className={styles.history}>
                    <h3>Recent</h3>
                    <div>
                        {patients?.slice(0,8)?.map((item,id)=>{
                                return(
                                    <p key={id}>
                                        <span>{item?.name}</span> 
                                        <span className={styles.test}>requested</span> 
                                        <span>{item?.requestedTests?.length} tests</span>
                                        <ReactTimeAgo date={item?.createdAt} locale="en-US" />
                                    </p>
                                )
                        })}
                        <Link href={"/admin/history"}><label>..See More</label></Link>
                    </div>
                </div>
            </section>
        </main>
    </div>
  )
}

export default Page