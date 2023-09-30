'use client'

import styles from "./page.module.css"
import { useEffect, useState, useRef } from "react"
import { useRouter } from 'next/navigation';
import Link from "next/link"
import 'react-quill/dist/quill.snow.css';
import dynamic from "next/dynamic";

const ReactQuill = dynamic(()=> import('react-quill'), {ssr: false})

function Page() {
    const value = useRef()
    const name = useRef()
    const abbr = useRef()
    const type = useRef()
    const editRef = useRef()
    const [values, setValues] = useState([])
    const [desc, setDesc] = useState("")
    const [patient, setPatient] = useState()
    const [currentTest, setCurrentTest] = useState("Add")
    const [currentResult, setCurrentResult] = useState({})
    const [parameters, setParameters] = useState([])
    const [test, setTest] = useState({})
    const [result, setResult] = useState(false)
    const [results, setResults] = useState(false)
    const [create, setCreate] = useState(false)
    const [add, setAdd] = useState(true)
    const [merge, setMerge] = useState(false)
    const [newTest, setNewTest] = useState(false)
    const [form, setForm] = useState({name: currentTest})
    const [mergeForm, setMergeForm] = useState({results: []})
    const [done, setDone] = useState(false)
    const [tests, setTests] = useState([])
    const [items, setItems] = useState([])
    const [show, setShow] = useState(false)
    const [testShow, setTestShow] = useState(false)
    const [resultShow, setResultShow] = useState(false)
    const [edit, setEdit] = useState(false)
    const [drugs, setDrugs] = useState([])
    const [oldDrugs, setOldDrugs] = useState([])
    useEffect(()=>{
        async function getTests(){
            const res = await fetch('/api/getAll/tests')
            const body = await res.json()
            setTests(body)
        }
        getTests()
    },[])
    useEffect(()=>{
        async function getDrugs(){
            const res = await fetch('/api/update/drugs')
            const body = await res.json()
            setOldDrugs(body)
        }
        getDrugs()
    },[])
    useEffect(()=>{
        const id = localStorage.getItem("id")
        async function getPatient(){
            const res = await fetch(`/api/find/${id}`)
            const body = await res.json()
            setPatient(body)
        }
        getPatient()
    },[])
    function useOutsideAlerter(ref) {
        useEffect(() => {
          function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
              setEdit(false);
            }
          }
          // Bind the event listener
          document.addEventListener("mousedown", handleClickOutside);
          return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
          };
        }, [ref]);
      }
    useOutsideAlerter(editRef)
    useEffect(()=>{
        for (let i = 0; i < tests?.labTests?.length; i++) {
            if (tests?.labTests[i]?.name == currentTest){
                setParameters(tests?.labTests[i]?.parameters)
                setTest(tests?.labTests[i])
            }
            if (tests?.labTests[i]?.name == currentResult?.name){
                setParameters(tests?.labTests[i]?.parameters)
                setTest(tests?.labTests[i])
            }
        }
        for (let i = 0; i < tests?.scanTests?.length; i++) {
            if (tests?.scanTests[i]?.name == currentTest){
                setParameters(tests?.scanTests[i]?.parameters)
                setTest(tests?.scanTests[i])
            }
            if (tests?.scanTests[i]?.name == currentResult?.name){
                setParameters(tests?.scanTests[i]?.parameters)
                setTest(tests?.scanTests[i])
            }
        }
        console.log(test)
        if(currentTest == "Create New"){
            setCreate(true)
            setMerge(false)
            setNewTest(false)
            setResult(false)
            setAdd(false)
            setResults(false)
            setEdit(false)
        } else if(currentTest == "Merge Tests"){
            setMerge(true)
            setCreate(false)
            setNewTest(false)
            setResult(false)
            setAdd(false)
            setResults(false)
            setEdit(false)
        } else if(currentTest == "Update Test"){
            setCreate(false)
            setMerge(false)
            setNewTest(true)
            setResult(false)
            setAdd(false)
            setResults(false)
            setEdit(false)
        } else if(currentTest == "Add"){
            setCreate(false)
            setMerge(false)
            setNewTest(false)
            setResult(false)
            setAdd(true)
            setResults(false)
            setEdit(false)
        } else if(currentTest == "Results"){
            setCreate(false)
            setMerge(false)
            setNewTest(false)
            setResult(false)
            setAdd(false)
            setResults(true)
            setEdit(false)
        } else{
            setCreate(false)
            setMerge(false)
            setNewTest(false)
            setResult(true)
            setAdd(false)
            setResults(false)
            setEdit(false)
        }
    },[currentTest, add, tests?.labTests, tests?.scanTests, currentResult])

    const toggle = (name, no,item, pos)=>{
        if(name == ""){
            setShow(!show)
        } else if(name == "results"){
            setResultShow(!resultShow)
        } else if(name == "tests"){
            setTestShow(!testShow)
        }else{
            setCurrentTest(name)
            localStorage.setItem("receiptNo", no)
            localStorage.setItem("pos", pos)
            setCurrentResult(item)
        } 
    }
    const handleChange = (e)=>{
        setForm({
            ...form,
            name: currentTest,
            [e.target.name] : e.target.value,
        })
    }
    const handleEditChange = (e)=>{
        setPatient({
            ...patient,
            [e.target.name] : e.target.value,
        })
    }
    const handleMergeChange = (e)=>{
        const newArray = [...items]
        if(e.target?.checked == false ){
            const removedItem = newArray.find(i => i == e?.target.name)
            const index = newArray.indexOf(removedItem)
            newArray.splice(index,1)
            setItems(newArray)
        } else{
            setItems(items => [...items, e?.target.name])
        }
        setMergeForm({
            ...mergeForm,
            test: name?.current?.value,
            results : [...items],
        })
    }
    const handleUpdateChange = (e)=>{
        const newArray = [...mergeForm?.results, e?.target.value]
        setMergeForm({
            ...mergeForm,
            test: newArray[0],
        })
    }
    const updateTest = async() =>{
        setForm({
            ...form,
            name: currentTest
        })
        setDone(true)
        setTimeout(()=> {location.reload(true)}, 3000)
    }
    const addNew = async()=>{
        const res = await fetch(`/api/update/tests`, {
            method: 'PUT',
            body: JSON.stringify({
                name: name?.current.value,
                abbr: abbr?.current.value,
                parameters: [...values],
                type: type?.current.value,
                id: patient?.receiptNo
            }),
        })
        setTimeout(()=> {location.reload(true)}, 1000)
    }
    const updateNew = async()=>{
        const res = await fetch(`/api/update/tests/name`, {
            method: 'PUT',
            body: JSON.stringify({
                name: mergeForm?.test,
                parameters: [...values],
            }),
        })
        setTimeout(()=> {location.reload(true)}, 1000)
    }
    const updateDrugs = async()=>{
        const res = await fetch(`/api/update/drugs`, {
            method: 'PUT',
            body: JSON.stringify({
                newDrugs: [...drugs]
            }),
        })
    }
    const mergeResults = async()=>{
        const res = await fetch(`/api/update/merge/${patient?._id}`, {
            method: 'PUT',
            body: JSON.stringify({
                name: name?.current?.value,
                results: [...items],
                receiptNo: value?.current?.value
            })
        })
        setTimeout(()=> {location.reload(true)}, 1000)
    }
    const addValues = ()=>{
        setValues([...values, value?.current.value])
        setDrugs([...drugs, value?.current.value])
        value.current.value = ''
    }
    console.log(drugs)
    const handleEdit = async() =>{
        const res = await fetch(`/api/update/edit/${patient?._id}`, {
            method: 'PUT',
            body: JSON.stringify(patient),
        })
        setTimeout(()=> {location.reload(true)}, 1000)
    }
    const removeValue = (todo) =>{
        const newArray = [...values]
        const removedItem = newArray.find(i => i == todo)
        const index = newArray.indexOf(removedItem)
        newArray.splice(index,1)
        setValues(newArray)
    }
    const removeDrug = (todo) =>{
        const newArray = [...drugs]
        const removedItem = newArray.find(i => i == todo)
        const index = newArray.indexOf(removedItem)
        newArray.splice(index,1)
        setDrugs(newArray)
    }
    async function update(){
        updateDrugs()
        const date = new Date()
        const receiptNo = localStorage.getItem("receiptNo")
        const res = await fetch(`/api/update/${patient?._id}`, {
            method: 'PUT',
            body: JSON.stringify({
                results : {
                    ...form,
                    description : desc,
                    createdAt: date.toDateString(),
                    printed: false,
                    hide: false,
                },
                receiptNo: receiptNo
            }),
        })
    }
    useEffect(()=>{
        done && setTimeout(()=> update(), 1000)
    }, [done])
    const handleAdd = (e)=>{
        const newArray = [...drugs]
        if(e.target?.checked == false ){
            const removedItem = newArray.find(i => i == e?.target.name)
            const index = newArray.indexOf(removedItem)
            newArray.splice(index,1)
            setDrugs(newArray)
        } else{
            setDrugs(drugs => [...drugs, e?.target.name])
        } 
    }
    console.log(form)
  return (
    <div className={styles.container}>
        <nav className={styles.nav}>
            <img src="/logo-hopkins.jpg" alt="logo" />
            <div className={styles.div}>
                <h3>{patient?.name}</h3>
                <ul>
                    <li onClick={()=>toggle("")}>Requested Tests<span>{show ? "-" : "+"}</span></li>
                    {show && <section className={styles?.section}>
                        {patient?.tests?.map((item, id)=>{
                            return(
                                <>
                                    <Tests key={id} item={item} toggle={toggle}/>
                                </> 
                            )
                        })}
                    </section>}
                    <li onClick={()=>toggle("results")}>Results   <span>{resultShow ? "-" : "+"}</span></li>
                    {resultShow && <section className={styles?.section}>
                        {patient?.results?.map((item, id)=>{
                            return(
                                <>
                                    <Result key={id} item={item} toggle={toggle}/>
                                </>
                                
                            )
                        })}
                    </section>}
                    {/* <li onClick={()=>toggle("Create New")}>Create New Test</li> */}
                    <li onClick={()=>toggle("Add")}>Add Test</li>
                    <li onClick={()=>toggle("Merge Tests")}>Merge Results</li>
                    <li onClick={()=>toggle("Update Test")}>Update Test</li>
                    <li onClick={()=>setEdit(true)}>Edit Patient</li>
                </ul>
            </div>
        </nav>
        <section className={styles.main} ref={editRef}>
            <h1>{currentTest}</h1>
            <form>
                <h3>Patient Details</h3>
                {!edit ? <section className={styles.details}>
                    <div>
                        <label htmlFor="age">Name: </label>
                        <p>{patient?.name}</p>
                    </div>
                    <div>
                        <label htmlFor="age">Age: </label>
                        <p>{patient?.age}</p>
                    </div>
                    <div>
                        <label htmlFor="gender">Gender: </label>
                        <p>{patient?.gender}</p>
                    </div>
                    <div>
                        <label htmlFor="referral">Referral: </label>
                        <p>{patient?.referral}</p>
                    </div>
                </section> :
                <section className={styles.details}>
                    <div>
                        <label htmlFor="age">Name: </label>
                        <input type="text" name="name" value={patient?.name} onChange={(e)=> handleEditChange(e)}/>
                    </div>
                    <div>
                        <label htmlFor="age">Age: </label>
                        <input type="number" name="age" value={patient?.age} onChange={(e)=> handleEditChange(e)}/>
                    </div>
                    <div>
                        <label htmlFor="gender">Gender: </label>
                        <input type="text" name="gender" value={patient?.gender} onChange={(e)=> handleEditChange(e)}/>
                    </div>
                    <div>
                        <label htmlFor="referral">Referral: </label>
                        <input type="text" name="referral" value={patient?.referral} onChange={(e)=> handleEditChange(e)}/>
                    </div>
                    <div className={styles?.button} onClick={handleEdit}>Save</div>
                </section>
                }
                <h3>Patient Results</h3>
                {result && <section className={styles.input}>
                    {parameters?.map((item, id)=>{
                            return(
                                <div key={id}>
                                    <label htmlFor="hb">{item?.name} {item?.antigen}: </label>
                                    {test?.levels && <input type="text" name={item?.name + "level"} onChange={(e)=>handleChange(e)} placeholder="L or H"/>}
                                    {item?.extra == undefined && <input type="text" name={item?.name} onChange={(e)=>handleChange(e)}/>}
                                    {item?.extra != undefined && item?.extra?.map((i, id) => {
                                        return(
                                            <input type="text" name={item?.antigen+i} onChange={(e)=>handleChange(e)} key={id} placeholder={i}/>
                                        )
                                    })}
                                </div> 
                            )
                    })}
                    {test?.culture && <div>
                        <label htmlFor="values">Add Values: </label>
                        <input type="text" name="values" ref={value}/>
                        <span className={styles.button} onClick={addValues}>Add New Drug</span>
                    </div>} 
                    {test?.culture && <table>
                        <thead>
                            <td>Antimicrobials</td>
                            <td>Interpretation</td>
                            <td>Grade</td>
                        </thead>
                        <tbody>
                            {drugs?.map((drug, id)=>{
                                return(
                                    <tr key={id}>
                                        <td>{drug}</td>
                                        <td><input type="text" name={drug + "I"} onChange={(e)=>handleChange(e)}/></td>
                                        <td><input type="text" name={drug + "G"} onChange={(e)=>handleChange(e)}/></td>
                                        <td onClick={removeDrug} style={{cursor: "pointer"}}>X</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                        
                    </table>}
                    {test?.comment && <div>
                        <label htmlFor="hb">Comment: </label>
                        <input type="text" name={"Comment"} onChange={(e)=>handleChange(e)}/>
                    </div>}
                    {test?.culture && <div className={styles.test}>
                        <h2>Requested Drugs</h2>
                       {oldDrugs?.map((item,id)=>{
                            return(
                                <span key={id}>
                                    <input type="checkbox" name={item} id={item?.name} onChange={(e)=>handleAdd(e)} checked={drugs?.includes(item)}/>
                                    <label htmlFor="">{item}</label>
                                </span>
                            )
                        })} 
                    </div>}
                    
                </section>}
                {result && <h3>Observations</h3>}
                {result && <section >
                    <ReactQuill theme="snow" value={desc} onChange={setDesc} className={styles.textarea}/>
                </section>}
                {result && <div className={styles.button} onClick={updateTest}>Save Results</div>}
                {results && <Results 
                    currentResult={currentResult}
                    parameters={parameters}
                    test={test}
                    editRef={editRef}
                    edit={edit}
                    setEdit={setEdit}
                    oldDrugs={oldDrugs}
                />}
                {add && <Add 
                    lab={tests?.labTests}
                    scan={tests?.scanTests}
                    patient={patient}
                />}
                {/* {add && <Add/>} */}
                {create && <Create
                    name={name}
                    abbr={abbr}
                    value={value}
                    type={type}
                    values={values}
                    handleClick={addValues}
                    handleRemove={removeValue}
                    handleAdd={addNew}
                />}
                {merge && <Merge 
                    name={name}
                    value={value}
                    patient={patient}
                    handleChange={handleMergeChange}
                    handleClick={mergeResults}
                    tests={tests}
                    items={items}
                />}
                {newTest && <Update
                    patient = {patient}
                    value = {value}
                    addValues = {addValues}
                    values = {values}
                    updateNew = {updateNew}
                    handleChange={handleUpdateChange}
                    handleClick={removeValue}
                />}
                <Link href={"/create-patient"} className={styles.button}><div>Create Patient</div></Link>
                <Link href={"/find-patient"} className={styles.button}><div>Find Patient</div></Link>
            </form>
        </section>
    </div>
  )
}

export default Page

export const Tests = ({item, toggle}) => {
    const [show, setShow] = useState(false)
    const handleClick = () =>{
        setShow(!show)
    }
    return(
        <>
            <p onClick={handleClick}>{item?.receiptNo}<span>{show ? "-" : "+"}</span></p>
            {show && <div>
                {item?.requestedTests?.map((test,id)=>{
                    return(
                        <p key={id} onClick={()=>toggle(test, item?.receiptNo)}>{test}</p>
                    )
                })}
            </div> }
        </>
    )
}
export const Result = ({item, toggle}) => {
    const [show, setShow] = useState(false)
    const handleClick = () =>{
        setShow(!show)
    }
    return(
        <>
            <p onClick={handleClick}>{item?.receiptNo}<span>{show ? "-" : "+"}</span></p>
            {show && <div>
                {item?.results?.map((result,id)=>{
                    return(
                        <p key={id} onClick={()=>toggle("Results", item?.receiptNo, result, id)}>{result?.name}<span>{result?.createdAt}</span></p>
                    )
                })}
            </div> }
        </>
    )
}


export const Update = ({patient,value,addValues,values,updateNew, handleChange, handleClick}) => {
    return(
        <>
            <section className={styles.merge}>
                <section>
                    {patient?.tests?.map((item,id)=>{
                        return(
                            <span key={id}>
                                <h4>{item?.receiptNo}</h4>
                                <span>
                                    {item?.requestedTests?.map((test, id)=>{
                                        return(
                                            <div key={id}>
                                                <input type="radio" name="test" value={test} onChange={(e)=>handleChange(e)}/>
                                                <label htmlFor="hb">{test}</label>
                                            </div>
                                        )
                                    })}
                                </span>
                            </span>
                        )
                    })}
                </section>
                <div>
                    <label htmlFor="values">Add Values: </label>
                    <input type="text" name="values" ref={value}/>
                    <span className={styles.button} onClick={addValues}>Add Value</span>
                </div>   
                <span className={styles.todo}>
                    {values?.map((item, id)=>{
                        return(
                            <div key={id} className={styles.todos}>
                                <p >{item}</p>
                                <div className={styles.todoButton} onClick={()=> handleClick(item)}>Remove</div>
                            </div>
                        )
                    })}
                </span>
            </section>
            <div className={styles.button} onClick={updateNew}>Update Test</div>
        </>
    )
}

export const Merge = ({name, patient, handleChange, handleClick, value, tests, items}) =>{
    console.log(patient)
    const [receiptNo, setReceiptNo] = useState("")
    const handleReceipt = (e) => {
        setReceiptNo(e.target?.value)
    }
    const referenceResult = patient?.results?.find(i => i?.receiptNo == receiptNo)
    const displayResults = referenceResult?.results?.filter(i => items?.includes(i?.name))
    console.log(displayResults)
    console.log(referenceResult)
    console.log(tests?.labTests)
    console.log(items)
    const referenceParameters = tests?.labTests?.filter(i => items?.includes(i?.name)) || tests?.scanTests?.filter(i => items?.includes(i?.name))
    console.log(referenceParameters)
    return(
        <section className={styles.merge}>
            <div className={styles.display}>
                <table className={styles.header}>
                    <tbody>
                        <tr>
                            <td><span>NAME</span>: {patient?.name}</td>
                            <td><span>AGE</span>: {patient?.age}YRS <br/>  <span>GENDER</span>: {patient?.gender}</td>
                            <td><span>RECEIPT NO</span>: {receiptNo}</td>
                        </tr>
                        <tr>
                            <td><span>LAB NO</span>: {patient?.labNo}</td>
                            <td><span>REFERRAL</span>: {patient?.referral}</td>
                            <td><span>TEST</span>: {name?.name}</td>
                        </tr>
                        <tr>
                            <td><span>COLLECTION DATE</span>: {name?.createdAt}</td>
                            <td><span>RECEIVED DATE</span>: {name?.createdAt}</td>
                            <td><span>REPORTING DATE</span>: {name?.createdAt}</td>
                        </tr>
                    </tbody> 
                </table>
                <h4>{name?.name?.toUpperCase()} REPORT</h4>
                {displayResults?.map((item, id)=>{
                    const show = referenceParameters[id]?.statement
                        return(
                            <>
                                {!show && <h4>{item?.name}</h4>}
                                {referenceParameters?.map((para, id)=>{
                                    return(
                                        <>
                                            {(para?.name == item?.name && para?.extra == undefined) && <table className={styles.displayTable}>
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
                                                            {(para?.writeUp && id == para?.parameters.length - 1) && <div dangerouslySetInnerHTML={{ __html: para?.writeUpDesc }} className={styles.desc}></div>}
                                                            {(item?.description && id == para?.parameters.length - 1) && <div className={styles.desc}>
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
                                                            <tr key={id}>
                                                                <td>{i?.name}</td>
                                                                <td>{antigen[id]}</td>
                                                                <td>{item?.[antigen[id]+extra[0]]}</td>
                                                                <td>{item?.[antigen[id]+extra[1]]}</td>
                                                            </tr>
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
                <div className={styles.line}>
                    <span></span>
                    <p>Medical Laboratory Scientist</p>
                </div>
            </div>
            <div>
                <label htmlFor="hb">Result Name: </label>
                <input type="text" name="name" ref={name}/>
            </div> 
            <div>
                <label htmlFor="hb">Receipt No: </label>
                <input type="text" name="receipt" ref={value} onChange={(e)=>handleReceipt(e)}/>
            </div> 
            <section className={styles?.results}>
                {patient?.results?.map((item,id)=>{
                    return(
                        <span key={id} >
                            <h4>{item?.receiptNo}</h4>
                            <span>
                                {item?.results?.map((result, id)=>{
                                    return(
                                        <div key={id}>
                                            <input type="checkbox" name={result?.name} value={result?.name} onChange={(e)=>handleChange(e)}/>
                                            <label htmlFor="hb">{result?.name}</label>
                                        </div>
                                    )
                                })}
                            </span>
                        </span>
                    )
                })}
            </section>
            <div>
                <span className={styles.button} onClick={handleClick}>Merge</span>
            </div>
        </section>

    )
}

export const Add = ({lab, scan, patient}) => {
    const [labSearch, setLabSearch] = useState([])
    const [scanSearch, setScanSearch] = useState([])
    const tests = [...labSearch, ...scanSearch]
    const [requested, setRequested] = useState([])
    const receipt = useRef()
    const handleChange = (e) =>{
        const names = lab?.map(i => {return i?.name})
        const labs = names?.filter(i => i.toLowerCase()?.includes(e?.target?.value.toLowerCase()))
        setLabSearch(labs)
        const items = scan?.map(i => {return i?.name})
        const scans = items?.filter(i => i.toLowerCase()?.includes(e?.target?.value.toLowerCase()))
        setScanSearch(scans)
    }
    const handleAdd = (e)=>{
        const newArray = [...requested]
        if(e.target?.checked == false ){
            const removedItem = newArray.find(i => i == e?.target.name)
            const index = newArray.indexOf(removedItem)
            newArray.splice(index,1)
            setRequested(newArray)
        } else{
            setRequested(requested => [...requested, e?.target.name])
        } 
    }
    const handleSubmit = async(id) =>{
        const data = {
            receiptNo : receipt.current.value,
            requestedTests : [...requested]
        }
        const res = await fetch(`/api/update/result/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        })
        setTimeout(()=> {location.reload(true)}, 1000)
    }
    return(
        <div>
            <section className={styles.add}>
                <div>
                    <input type="search"  onChange={(e)=>handleChange(e)} placeholder="Search for test" className={styles.search} />
                    <input type="text" placeholder="Add Receipt No" name="receiptNo" className={styles.search} ref={receipt}/>
                </div>
                <main className={styles.tests}>
                    <div className={styles.test}>
                       {tests?.map((item,id)=>{
                            return(
                                <span key={id}>
                                    <input type="checkbox" name={item} id={item?.name} onChange={(e)=>handleAdd(e)} checked={requested?.includes(item)}/>
                                    <label htmlFor="">{item}</label>
                                </span>
                            )
                        })} 
                    </div>
                    <section className={styles.show}>
                        <ul>
                            {requested?.map((item, id)=>{
                                return(
                                    <li key={id}>{item}</li>
                                )
                            })}
                        </ul>
                        <div className={styles.button} onClick={()=> handleSubmit(patient?._id)}>Add Test</div>
                    </section>
                </main>
            </section>
        </div>
    )
}

export const Create = ({name, abbr, type, value,values, handleClick, handleRemove, handleAdd}) => {
    return(
        <>
            <section className={styles.input}>
                <div>
                    <label htmlFor="hb">Test Name: </label>
                    <input type="text" name="name" ref={name}/>
                </div> 
                <div>
                    <label htmlFor="hb">Abbr: </label>
                    <input type="text" name="abbr" ref={abbr}/>
                </div> 
                <div>
                    <label htmlFor="type">Test Type: </label>
                    <select name="type" id="" ref={type}>
                        <option value="lab">Lab</option>
                        <option value="scan">Scan</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="values">Add Values: </label>
                    <input type="text" name="values" ref={value}/>
                    <span className={styles.button} onClick={handleClick}>Add Value</span>
                </div>   
                <span className={styles.todo}>
                    {values?.map((item, id)=>{
                        return(
                            <div key={id} className={styles.todos}>
                                <p >{item}</p>
                                <div className={styles.todoButton} onClick={()=> handleRemove(item)}>Remove</div>
                            </div>
                        )
                    })}
                </span>
            </section>
            <div className={styles.button} onClick={handleAdd}>Add New</div>
        </>
    )
}

export const Results = ({parameters, currentResult, test, edit, setEdit, oldDrugs}) => {
    const [data, setData] = useState(currentResult)
    const admin = localStorage.getItem("admin")
    const id = localStorage.getItem("id")
    const receipt = localStorage.getItem("receiptNo")
    const pos = localStorage.getItem("pos")
    const handleClick = async(name) =>{
        const res = await fetch(`/api/update/result/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                result : pos,
                receiptNo: receipt,
                printed: true
            }),
        })
        localStorage.setItem("name", JSON.stringify(name))
    }
    const handleEdit = async() =>{
        const res = await fetch(`/api/update/edit/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                receiptNo: receipt,
                result: data
            }),
        })
        setTimeout(()=> {location.reload(true)}, 1000)
    }
    const handleDelete = async() =>{
        const res = await fetch(`/api/update/delete/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                receiptNo: receipt,
                result: currentResult
            }),
        })
        setTimeout(()=> {location.reload(true)}, 1000)
    }
    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name] : e.target?.value
        })
    }

    console.log(admin == "true" && currentResult?.hide == "false")
    return(
        <section className={styles.input}>
            {currentResult?.createdAt != undefined && <p><span className={styles.span}>Created On</span> : {currentResult?.createdAt}</p>}
            {!edit && parameters?.map((item, id)=>{
                const type = currentResult?.[item?.name] != undefined 
                return(
                    <>
                        {type && <div key={id} className={styles.result}>
                            <label htmlFor="hb">{item?.name}: </label>
                            {test?.levels && <p>{currentResult?.[item?.name+"level"]}</p>}
                            <p>{currentResult?.[item?.name]}</p>
                        </div>}
                    </>
                )
            })}
            {(!edit && test?.comment) && <p><span className={styles.span}>COMMENT</span> : {currentResult?.Comment}</p>}
            {(!edit && test?.culture) && <table>
                <thead>
                    <td>Antimicrobials</td>
                    <td>Interpretation</td>
                    <td>Grade</td>
                </thead>
                <tbody>
                    {test?.drugs?.map((drug, id)=>{
                        return(
                            <tr key={id}>
                                <td>{drug}</td>
                                <td>{currentResult?.[drug+"I"]}</td>
                                <td>{currentResult?.[drug+"G"]}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>}
            {(!edit && test?.writeUp) && <div dangerouslySetInnerHTML={{ __html: test?.writeUpDesc }}></div>}
            {edit && parameters?.map((item, id)=>{
                return(
                    <>
                        <div key={id}>
                            <label htmlFor="hb">{item?.name} {item?.antigen}: </label>
                            {item?.extra == undefined && <input type="text" name={item?.name} onChange={(e)=>handleChange(e)} value={data?.[item?.name]}/>}
                            {item?.extra != undefined && item?.extra?.map((i, id) => {
                                const antigen = ["D", "A", "B", "C"]
                                return(
                                    <input type="text" name={item?.antigen+i} onChange={(e)=>handleChange(e)} key={id} placeholder={i} value={data[item?.antigen+i]}/>
                                )
                            })}
                        </div> 
                    </>
                )
            })}
            {(edit && test?.culture) && <table>
                <thead>
                    <td>Antimicrobials</td>
                    <td>Interpretation</td>
                    <td>Grade</td>
                </thead>
                <tbody>
                    {oldDrugs?.map((drug, id)=>{
                        return(
                            <tr key={id}>
                                <td>{drug}</td>
                                <td><input type="text" name={drug + "I"} onChange={(e)=>handleChange(e)} value={data[drug + "I"]}/></td>
                                <td><input type="text" name={drug + "G"} onChange={(e)=>handleChange(e)} value={data[drug + "G"]}/></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>}
            {currentResult?.merged && currentResult?.results?.map((item, id)=>{
                return(
                    <>
                        <h3>{item?.name}</h3>
                        {currentResult?.parameters?.map((para, id)=>{
                            return(
                                <>
                                    {para?.extra == undefined && para?.parameters?.map((result, id)=>{
                                        const type = item?.[result?.name] != undefined 
                                        return(
                                            <>
                                                {type && <div key={id} className={styles.result}>
                                                    <label htmlFor="hb">{result?.name}: </label>
                                                <p>{item?.[result?.name]}</p>
                                                </div>}
                                            </>
                                        )
                                    })}
                                    {(para?.extra == true && item?.DO != undefined) && <table >
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
                                                return(
                                                    <tr key={id}>
                                                        <td>{i?.name}</td>
                                                        <td>{antigen[id]}</td>
                                                        <td>{item?.[antigen[id]+extra[0]]}</td>
                                                        <td>{item?.[antigen[id]+extra[1]]}</td>
                                                    </tr>
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
            {currentResult?.merged && <h3>Impression</h3>}
            {currentResult?.merged && currentResult?.results?.map((item, id)=>{
                return(
                    <>
                        <div>
                            {<div dangerouslySetInnerHTML={{ __html: item?.description }} />}
                        </div>
                    </>
                )
            })}
            {(!edit && test?.extra) && <table >
                <thead>
                    <th>Antigen</th>
                    <th> </th>
                    <th>O</th>
                    <th>H</th>
                </thead>
                <tbody>
                    {parameters?.map((i, id)=>{
                        const antigen = ["D", "A", "B", "C"]
                        const extra = ["O", "H"]
                        return(
                            <tr key={id}>
                                <td>{i?.name}</td>
                                <td>{antigen[id]}</td>
                                <td>{currentResult?.[antigen[id]+extra[0]]}</td>
                                <td>{currentResult?.[antigen[id]+extra[1]]}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>}
            {currentResult?.description?.[0] != undefined  ? <h3>Impression</h3> : ""}
            <div>
                {<div dangerouslySetInnerHTML={{ __html: currentResult?.description }} />}
            </div>
            {currentResult?.printed && <span className={styles.button}>Printed</span>}
            {(admin == "true" && currentResult?.hide == false) && <Link href={"/result"} target="_blank" className={styles.button} onClick={()=>handleClick(currentResult)}>Print</Link>}
            {edit? <span className={styles.button} onClick={handleEdit}> Save Result</span> : <span className={styles.button} onClick={()=> setEdit(true)}>Edit Result</span>}
            <span className={styles.button} onClick={handleDelete}> Delete Result</span>
        </section>
    )
}