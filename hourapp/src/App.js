import React, { useState } from 'react';
import './App.css';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import uuid from 'react-uuid';

function App() {
  const [data,setData] = useState([]);
  const [date,setDate] = useState();
  const [stime,setStime] = useState(0);
  const [etime,setEtime] = useState(0);
  const [ptime,setPtime] = useState(0);
  const [eptime,setEptime] = useState(0);
  const [staticWorktime,setStaticWorktime] = useState(0);
  const [pauseActive,setPauseActive] = useState(0);
  const add = () =>{
  if((pauseActive && stime && etime && ptime && eptime) || (!pauseActive && stime && ptime) || staticWorktime){
    let worktime,worktimeminutes=0;
    if(!staticWorktime){
      //początek pracy
      const startHour = parseInt(stime[0] + stime[1]);
      const startMinutes = parseInt(stime[3] + stime[4]);
      //początek przerwy
      const pauseHour = parseInt(ptime[0] + ptime[1]);
      const pauseMinutes = parseInt(ptime[3] + ptime[4]);
      //koniec przerwy
      const endpauseHour = pauseActive?parseInt(eptime[0] + eptime[1]):null;
      const endpauseMinutes = pauseActive?parseInt(eptime[3] + eptime[4]):null;
      //koniec pracy
      const endHour = pauseActive?parseInt(etime[0] + etime[1]):null;
      const endMinutes = pauseActive?parseInt(etime[3] + etime[4]):null;
      //czas pracy
      let startTime = startHour*60+startMinutes;
      let pauseStartTime = pauseHour*60+pauseMinutes;
      if(startTime>pauseStartTime) pauseStartTime+=(24*60);
      let timeToBreak = pauseStartTime - startTime;
      let timeAfterBreak = (endHour*60+endMinutes) - (endpauseHour*60+endpauseMinutes);
      
      worktimeminutes = pauseActive?timeAfterBreak + timeToBreak:timeToBreak;
      let workmin = worktimeminutes%60;
      if(workmin<10) workmin = "0"+workmin;
      worktime =(Math.floor(worktimeminutes/60)+":"+workmin);
    }
    else{
      worktime = staticWorktime;
      const workHour = parseInt(staticWorktime[0] + staticWorktime[1]);
      const workMinutes = parseInt(staticWorktime[3] + staticWorktime[4]);
      worktimeminutes = workHour*60+workMinutes;
    }
    let uid = "";
    while(uid.length===0){
      let counter = 0;
      let id = uuid();
      data.forEach((val)=>{
        if(val.uid === id) counter++;
      }) 
      if(counter===0) uid = id;
    }
    setData([...data,{
      uid,
      date,
      starttime:stime?stime:null,
      startpauza:ptime?ptime:null,
      endpauza:pauseActive?eptime:null,
      endtime:pauseActive?eptime:null,
      worktime,
      worktimeminutes
    }]);
    let newDate = new Date(document.getElementById("myDate").value);
    newDate.setDate(newDate.getDate() + 1);
    
    setDate(newDate.toISOString().slice(0,-14));
    document.getElementById("myDate").stepUp();
    
  }
  }
  return (
    <div className="App">
      <header className="App-header" style={{boxSizing:"border-box",height:"100vh",display:"flex",flexDirection:"row",justifyContent:"space-around"}}>
        <Card className="bg-dark text-white" style={{minWidth:"271px"}}>
        <Card.Header>Formularz pracy</Card.Header>
        <Card.Body>
          <ListGroup variant="flush">
            <ListGroup.Item className="bg-sedondary text-white">
            <Card.Subtitle className="mb-2 text-muted">Data</Card.Subtitle>
              <input type="date" id="myDate" onChange={e=>setDate(e.target.value)}/>
            </ListGroup.Item>

            <ListGroup.Item style={{display:'flex'}}>
              <ListGroup >
                <ListGroup.Item>
                  <Card.Subtitle className="mb-2 text-muted">Godziny pracy przed przerwą</Card.Subtitle>
                  <input type="time" disabled={staticWorktime?true:false} value={stime} onChange={e=>setStime(e.target.value)}/>-<input type="time" disabled={staticWorktime?true:false} value={ptime} onChange={e=>setPtime(e.target.value)}/>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Card.Subtitle className="mb-2 text-muted">Godziny pracy po przerwie <input type="checkbox" checked={pauseActive} onChange={e=>setPauseActive(!pauseActive)}/></Card.Subtitle>
                  <input type="time" disabled={staticWorktime?true:(pauseActive?false:true)} value={eptime} onChange={e=>setEptime(e.target.value)}/>-<input type="time" disabled={staticWorktime?true:(pauseActive?false:true)} value={etime} onChange={e=>setEtime(e.target.value)}/>
                </ListGroup.Item>
              </ListGroup>
              <ListGroup.Item style={{justifyContent:"space-around"}}>
                <Card.Subtitle className="mb-2 text-muted">Czas pracy</Card.Subtitle>
                <input type="time" disabled={(stime || eptime || ptime || etime)?true:false} value={staticWorktime} onChange={e=>setStaticWorktime(e.target.value)}/>
              </ListGroup.Item>
            </ListGroup.Item>

            <ListGroup.Item style={{display:"flex",justifyContent:"space-around"}}>
              <Button style={{width:"200px"}} variant="outline-primary" onClick={()=>add()}>Dodaj</Button><br/>
              <Button variant="outline-warning" onClick={()=>reset(setStime,setEtime,setPtime,setEptime,setStaticWorktime)}>Reset</Button><br/>
            </ListGroup.Item>
          </ListGroup>
          </Card.Body>
        </Card>
        <ListGroup className="bg-dark text-white" style={data.length===0?{display:"none"}:{display:"block"}}>
        <ListGroup.Item className="bg-dark text-white" style={{height:'80vh',overflow:"scroll"}}>
          {data.map((val,i)=>{
            return(
            <ListGroup.Item style={{paddingBottom:"10px",borderBottom:"solid 1px white",margin:"10px",fontSize:"10px",display:"flex",flexDirection:"row",justifyContent:"space-around"}}>
              <div style={{fontSize:"17px", padding:"20px"}}>
              < span style={{fontSize:"15px"}}><b>{val.date}</b></span>
              </div>
              <div>
                <span>{val.starttime}-{val.startpauza}</span><br/>
                <span>{val.endpauza}-{val.endtime}</span><br/>
                <hr color="white" height="1px"/>
                <span style={{fontSize:"15px"}}><b>{val.worktime}</b></span><br/>
              </div>
              <hr style={{margin:"10px"}} color="white" height="1px"/>
              <Button variant="outline-danger"  onClick={()=>deleteNote(val.uid,data,setData)}>Usuń</Button>
            </ListGroup.Item>)
          })}
          
        </ListGroup.Item>
          <ListGroup.Item className="bg-dark text-white">{data.length!==0?"Suma godzin:":null}
              {data.length>1?sum(data):data.length===0?null:data[0].worktime}
          </ListGroup.Item>
        </ListGroup>
      </header>
    </div>
  );
}

const sum = (array) =>{
  let itemSum = 0;
  array.forEach((val)=>{
    itemSum+=val.worktimeminutes;
  })
  let sumDec = itemSum%60;
  if(sumDec<10) sumDec = "0"+sumDec;
  const result =(Math.floor(itemSum/60)+":"+sumDec);
  return result;
}

const deleteNote = (uid,array,setArray) =>{
  let index = null;
  let newArray = array;
  array.forEach((val,i)=>{
    if(val.uid===uid) {
      index = i;
    }
  })
  newArray.splice(index,1);
  console.log(newArray)
  setArray(newArray);
  if(newArray.length===0)setArray([]);
}

const reset = (setStime,setEtime,setPtime,setEptime,setStaticWorktime) =>{
  setStime(0);
  setEtime(0);
  setPtime(0);
  setEptime(0);
  setStaticWorktime(0);
}
export default App;
