"use client"

import styles from "../page.module.css"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"


function Page() {
    const params = useParams()
    const [patient, setPatient] = useState()
    useEffect(()=>{
        async function getPatient(){
            const res = await fetch(`/api/find/${params?.patient}`)
            const body = await res.json()
            setPatient(body)
        }
        getPatient()
    },[params?.patient])
    function setResult(name){
        localStorage.setItem("name", name)
    }
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
            <h2>Patient Profile</h2>
            <div className={styles.details}>
                <p><strong>Name</strong>: {patient?.name}</p>
                <p><strong>Age</strong>: {patient?.age}</p>
                <p><strong>Gender</strong>: {patient?.gender}</p>
                <p><strong>Receipt No</strong>: {patient?.receiptNo}</p>
            </div>
            <h1 style={{textAlign: "center"}}>Results</h1>
            <div className={styles.results}>
                {patient?.results?.map((item,id)=>{
                    return(
                        <Link href={`/result/${patient?.receiptNo}`} target="_blank" key={id}><p onClick={()=> setResult(item?.name)}>{item?.name}</p></Link>
                    )
                })}
            </div>
        </main>
    </div>
  )
}

export default Page