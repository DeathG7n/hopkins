'use client'

import styles from "./page.module.css"
import { useEffect, useState } from "react"

function Page() {
    const [patient, setPatient] = useState()
    const [tests, setTests] = useState([])
    const [name, setName] = useState("")
    const [drugs, setDrugs] = useState([])
    const [receiptNo, setReceiptNo] = useState("")
    const [values, setValues] = useState([])
    useEffect(()=>{
        const id = localStorage.getItem("id")
        async function getPatient(){
            const res = await fetch(`/api/find/${id}`)
            const body = await res.json()
            setPatient(body)
        }
        getPatient()
    },[])
    useEffect(()=>{
        async function getDrugs(){
            const res = await fetch('/api/update/drugs')
            const body = await res.json()
            setDrugs(body)
        }
        getDrugs()
    },[])
    useEffect(()=>{
        async function getTests(){
            const res = await fetch('/api/getAll/tests')
            const body = await res.json()
            setTests(body)
        }
        getTests()
    },[])
    useEffect(()=>{
        const get = async() =>{
            const test = localStorage.getItem("name")
            const receipt = localStorage.getItem("receiptNo")
            const result = JSON.parse(test)
            setName(result)
            setReceiptNo(receipt)
        }
        get()
    }, [])
    console.log(name)
    
    const currentTest = tests?.labTests?.find(i => i?.name == name?.name) || tests?.scanTests?.find(i => i?.name == name?.name)
    const newTest = tests?.labTests?.find(i => i?.name == name && i?.type == "lab") || tests?.scanTests?.find(i => i?.name == name && i?.type == "scan")
    const currentResult = patient?.results?.find(i => i?.receiptNo == receiptNo) 
    const result = currentResult?.results?.find(i => i?.receiptNo == receiptNo) 
    const test = newTest || currentTest
    const titles = test?.segments && test?.parameters.map(i => {return i?.title})
    const uniqueItems = titles?.filter((item, index) => titles.indexOf(item) === index);
    const selectOptions = test?.parameters?.filter(i=> i?.select == true)
    const resultParameters = test?.parameters?.map(i=>{
        return name?.[i?.name]
    })
    const available = resultParameters?.find(i => i != undefined)
  return (
    <div className={styles.container}>
        <table className={styles.details}>
            <tbody>
                <tr>
                    <td><span>NAME</span>: {patient?.name}</td>
                    <td><span>AGE</span>: {patient?.age}YRS <br/>  <span>GENDER</span>: {patient?.gender}</td>
                    <td><span>RECEIPT NO</span>: {receiptNo}</td>
                </tr>
                <tr>
                    <td><span>LAB NO</span>: {patient?.labNo}</td>
                    <td><span>REFERRAL</span>: {patient?.referral}</td>
                    <td><span>TEST</span>: {test?.abbr || name?.name}</td>
                </tr>
                <tr>
                    <td><span>COLLECTION DATE</span>: {name?.createdAt}</td>
                    <td><span>RECEIVED DATE</span>: {name?.createdAt}</td>
                    <td><span>REPORTING DATE</span>: {name?.createdAt}</td>
                </tr>
            </tbody> 
        </table>
        <h4>{name?.name?.toUpperCase()} REPORT</h4>
        {(!test?.segments && test?.parameters?.length != 0) && <table className={styles.result}>
            {(available && !test?.statement) && <thead>
                <tr>
                    <th>Investigation</th>
                    <th>Patient's Result</th>
                    <th>Normal Values</th>
                </tr>
            </thead>}
            {<tbody>
                {(newTest?.parameters || currentTest?.parameters)?.map((item,id)=>{
                    return(
                        <>
                            {item?.header && <h5>{item?.header}</h5>}
                            {name?.[item?.name] && <tr key={id}>
                                <td><p>{item?.name}</p><p>{test?.levels && name?.[item?.name+"level"]}</p></td>
                                <td>{name?.[item?.name]}</td>
                                <td dangerouslySetInnerHTML={{ __html: item?.ref }}></td>
                            </tr>}
                        </> 
                    )
                })}   
            </tbody>}
        </table>}
        {test?.extra && <table className={styles.extra}>
            <thead>
                <th>Antigen</th>
                <th> </th>
                <th>O</th>
                <th>H</th>
            </thead>
            <tbody>
                {test?.parameters?.map((i, id)=>{
                    const antigen = ["D", "A", "B", "C"]
                    const extra = ["O", "H"]
                    return(
                        <tr key={id}>
                            <td>{i?.name}</td>
                            <td>{antigen[id]}</td>
                            <td>{name?.[antigen[id]+extra[0]]}</td>
                            <td>{name?.[antigen[id]+extra[1]]}</td>
                        </tr>
                    )
                })}
            </tbody>
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
                                                    const checked = test?.values?.[id] == name[test?.name] ? true : false
                                                    return(
                                                        <td key={id}><input type="checkbox" checked={checked} readOnly></input></td>
                                                    )
                                                })}
                                            </tr>}
                                            {(type && !options) && <tr key={id}>
                                                <td>{test?.name}</td>
                                                <td>{name?.[test?.name]}</td> 
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
        {test?.comment && <p className={styles.comment}><span>COMMENT</span> : {name?.Comment}</p>}
        {test?.culture && <table className={styles?.culture}>
                <thead>
                    <td>Antimicrobials</td>
                    <td>Interpretation</td>
                    <td>Grade</td>
                </thead>
                <tbody>
                    {drugs?.map((drug, id)=>{
                        return(
                            <>
                               {(name[drug+"I"] || name[drug+"G"]) && <tr key={id}>
                                    <td>{drug}</td>
                                    <td>{name[drug+"I"]}</td>
                                    <td>{name[drug+"G"]}</td>
                                </tr>} 
                            </> 
                        )
                    })}
                </tbody>
            </table>}
        {test?.writeUp && <div dangerouslySetInnerHTML={{ __html: test?.writeUpDesc }} className={styles.desc}></div>}
        {name?.description != undefined && <div className={styles.desc}>
            <div dangerouslySetInnerHTML={{ __html: name?.description }} />
        </div>}
        {name?.merged && name?.results?.map((item, id)=>{
            const show = name?.parameters[id]?.statement && name?.parameters[id]?.swab == undefined
            console.log(item?.name)
                return(
                    <>
                        {!show && <h4>{item?.name}</h4>}
                        {name?.parameters?.map((para, id)=>{
                            return(
                                <>
                                    {(para?.name == item?.name && para?.extra == undefined) && <table className={styles.result}>
                                        {!para?.statement && <thead>
                                            <tr>
                                                <th>Investigation</th>
                                                <th>Patient's Result</th>
                                                <th>Normal Values</th>
                                            </tr>
                                        </thead>}
                                        <tbody>
                                            {para?.parameters?.map((result, id)=>{
                                                return(
                                                    <>
                                                      {result?.header && <h5>{result?.header}</h5>}
                                                        <tr key={id}>
                                                            <td>{result?.name}</td>
                                                            <td>{item?.[result?.name]}</td>
                                                            <td dangerouslySetInnerHTML={{ __html: result?.ref }}></td>
                                                       </tr>  
                                                       {para?.comment && <p className={styles.comment}><span>COMMENT</span> : {result?.Comment}</p>}
                                                       {(para?.writeUp && id == para?.parameters.length - 1) && <div dangerouslySetInnerHTML={{ __html: para?.writeUpDesc }} className={styles.descMerge}></div>}
                                                       {(item?.description && id == para?.parameters.length - 1) && <div className={styles.descMerge}>
                                                            {<div dangerouslySetInnerHTML={{ __html: item?.description }} />}
                                                        </div>}
                                                    </>   
                                                )
                                            })}
                                        </tbody>
                                    </table>}
                                    
                                    {(para?.extra == true && item?.DO != undefined) && <table className={styles.extra}>
                                        <thead>
                                            <th>Antigen</th>
                                            <th> </th>
                                            <th>O</th>
                                            <th>H</th>
                                        </thead>
                                        <tbody>
                                            {para?.parameters?.map((i, id)=>{
                                                const antigen = ["D", "A", "B", "C"]
                                                const extra = ["O", "H"]
                                                const type = item?.[antigen[id]+extra[0]] && item?.[antigen[id]+extra[1]]
                                                return(
                                                    <>
                                                        <tr key={id}>
                                                            <td>{i?.name}</td>
                                                            <td>{antigen[id]}</td>
                                                            <td>{item?.[antigen[id]+extra[0]]}</td>
                                                            <td>{item?.[antigen[id]+extra[1]]}</td>
                                                        </tr>
                                                        {(para?.comment && id == para?.parameters.length - 1 ) && <p className={styles.comment}><span>COMMENT</span> : {item?.Comment}</p>}
                                                    </>
                                                    
                                                )
                                            })}
                                        </tbody>
                                    </table>}
                                </>
                            )
                        })}
                    </>
                )
            })}
            {/* {name?.merged && name?.results?.map((item, id)=>{
                return(
                    <>
                        <div className={styles.desc}>
                            {<div dangerouslySetInnerHTML={{ __html: item?.description }} />}
                        </div>
                    </>
                )
            })} */}
        <div className={styles.line}>
            <span></span>
            <p>Medical Laboratory Scientist</p>
        </div>
    </div>
  )
}

export default Page