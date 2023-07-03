"use client"

import styles from "../page.module.css"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"

function Page() {
    const [patients, setPatients] = useState()
    const [change, setChange] = useState(false)
    useEffect(()=>{
        async function getPatient(){
            const res = await fetch(`http://localhost:3000/api/getAll`)
            const body = await res.json()
            setPatients(body)
        }
        getPatient()
    },[change])
    async function toggleComplete(id){
        const res = await fetch(`http://localhost:3000/api/update/complete/${id}`,{
            method: "PUT",
            body: true
        })
        setChange(!change)
    }
  return (
    <div className={styles.container}>
        <nav className={styles.nav}>
            <Image src="/logo-hopkins.jpg" alt="" />
            <ul>
                <Link href={"/admin"}><li>Home</li></Link>
                <Link href={"/admin/pending"}><li>Pending Results</li></Link>
                <Link href={"/admin/collected"}><li>Collected Results</li></Link>
                <Link href={"/admin/history"}><li>History</li></Link>
            </ul>
        </nav>
        <main className={styles.main}>
            <h2>Pending Results</h2>
            <section className={styles.stats}>
                <div className={styles.history}>
                    <div>
                        {patients?.map((item,id)=>{
                            const pending = item?.collected == false ? true : false
                                return(
                                    <>
                                        {pending && 
                                            <p key={id}>
                                                <Link href={`/admin/${item?.receiptNo}`}><span>{item?.name}</span> </Link>
                                                <button onClick={()=>toggleComplete(item?.receiptNo)}>Completed</button>
                                            </p>}
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