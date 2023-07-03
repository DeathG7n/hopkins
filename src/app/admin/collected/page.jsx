"use client"

import styles from "../page.module.css"
import { useEffect, useState } from "react"
import Link from "next/link"


function Page() {
    const [patients, setPatients] = useState()
    useEffect(()=>{
        async function getPatient(){
            const res = await fetch(`/api/getAll`)
            const body = await res.json()
            setPatients(body)
        }
        getPatient()
    },[])
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
            <h2>Collected Results</h2>
            <section className={styles.stats}>
                <div className={styles.history}>
                    <div>
                        {patients?.map((item,id)=>{
                            const collected = item?.collected == true ? true : false
                                return(
                                    <>
                                       {collected && <Link href={`/admin/${item?.receiptNo}`}>
                                            <p key={id}>
                                                <span>{item?.name}</span> 
                                            </p>
                                        </Link>}
                                    </>
                                    
                                )
                        })}
                    </div>
                </div>
            </section>
        </main>
    </div>
  )
}

export default Page