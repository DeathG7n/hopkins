'use client'

import styles from "./page.module.css"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

function Page() {
    const params = useParams()
    const [patient, setPatient] = useState()
    const [tests, setTests] = useState([])
    const [name, setName] = useState("")
    const [values, setValues] = useState([])
    useEffect(()=>{
        async function getPatient(){
            const res = await fetch(`http://localhost:3000/api/find/${params?.id}`)
            const body = await res.json()
            setPatient(body)
        }
        getPatient()
    },[])
    useEffect(()=>{
        async function getTests(){
            const res = await fetch('http://localhost:3000/api/getAll/tests')
            const body = await res.json()
            setTests(body)
        }
        getTests()
    },[])
    useEffect(()=>{
        const test = localStorage.getItem("name")
        setName(test)
    }, [])
    
    const currentTest = tests?.labTests?.find(i => i?.name == name) || tests?.scanTests?.find(i => i?.name == name)
    const newTest = tests?.labTests?.find(i => i?.name == name && i?.type == "lab") || tests?.scanTests?.find(i => i?.name == name && i?.type == "scan")
    const currentResult = patient?.results?.find(i => i?.name == name) 
    const test = newTest || currentTest
    const titles = test?.segments && test?.parameters.map(i => {return i?.title})
    const uniqueItems = titles?.filter((item, index) => titles.indexOf(item) === index);
    const selectOptions = test?.parameters?.filter(i=> i?.select == true)
    console.log(selectOptions)

  return (
    <div className={styles.container}>
        <table className={styles.details}>
            <tbody>
                <tr>
                    <td><span>NAME</span>: {patient?.name}</td>
                    <td><span>AGE</span>: {patient?.age}YRS <br/>  <span>GENDER</span>: {patient?.gender}</td>
                    <td><span>RECEIPT NO</span>: {patient?.receiptNo}</td>
                </tr>
                <tr>
                    <td><span>LAB NO</span>: {patient?.labNo}</td>
                    <td><span>REFERRAL</span>: {patient?.referral}</td>
                    <td><span>TEST</span>: {currentTest?.abbr}</td>
                </tr>
                <tr>
                    <td><span>COLLECTION DATE</span>: {patient?.createdAt?.slice(0,10)}</td>
                    <td><span>RECEIVED DATE</span>: {patient?.updatedAt?.slice(0,10)}</td>
                    <td><span>REPORTING DATE</span>: {patient?.updatedAt?.slice(0,10)}</td>
                </tr>
            </tbody> 
        </table>
        <h4>{name.toUpperCase()} REPORT</h4>
        {(!test?.segments && (test?.parameters != [])) && <table className={styles.result}>
            <thead>
                <tr>
                    <th>Investigation</th>
                    <th>Patient's Result</th>
                    <th>Normal Values</th>
                </tr>
            </thead>
            {<tbody>
                {(newTest?.parameters || currentTest?.parameters)?.map((item,id)=>{
                    return(
                        <tr key={id}>
                            <td>{item?.name}</td>
                            <td>{currentResult[item?.name]}</td>
                            <td>{item?.ref}</td>
                        </tr>
                    )
                })}   
            </tbody>}
        </table>}
        {test?.segments && <div className={styles.desc}>
            {uniqueItems?.map((item,id)=>{
                return(
                    <div key={id}>
                        <h4>{item}</h4>
                        <table className={styles.options}>
                            <tbody>
                                {test?.parameters?.map((test,id)=>{
                                    const type = test?.title == item ? true : false
                                    const options = test?.select == true ? true : false
                                    return(
                                        <>  
                                            {(options && type && test?.options) && <tr>
                                                <td> </td>
                                                {test?.options?.map((option, id) =>{
                                                    return(
                                                        <td key={id}>{option}</td>
                                                    )
                                                })}
                                            </tr>}
                                            {(type && options) && <tr key={id}>
                                                <td>{test?.name}</td>
                                                {[...Array(test?.selectNo)].map((i,id)=>{
                                                    const checked = test?.values?.[id] == currentResult[test?.name] ? true : false
                                                    console.log(test?.values?.[id], currentResult[test?.name])
                                                    return(
                                                        <td key={id}><input type="checkbox" checked={checked} readOnly></input></td>
                                                    )
                                                })}
                                            </tr>}
                                            {(type && !options) && <tr key={id}>
                                                <td>{test?.name}</td>
                                                <td>{currentResult[test?.name]}</td> 
                                                <td>{test.ref}</td> 
                                            </tr>}
                                        </> 
                                    )
                                })} 
                            </tbody>
                        </table>
                        
                    </div>
                )
            })}
        </div>}
        {currentResult?.description != [] && <div className={styles.desc}>
            <h2>IMPRESSION</h2>
            {currentResult?.description?.map((item,id)=>{
                return(
                    <div key={id}>{item}</div>
                )
            })}
        </div>}
        <div className={styles.line}>
            <span></span>
            <p>Medical Laboratory Scientist</p>
        </div>
    </div>
  )
}

export default Page