import './App.css';
import {useRef, useState, useEffect, createRef} from 'react';
import collection from './Collection';
import Slider from '@material-ui/core/Slider';
function App() {

  //states and refs declaration
  const [bank, setBank] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [isOn, setOn] = useState(true);
  const displayMessage = useRef(null);

  //ref array for declaring ref with map
  let divRefs = [];

  //setting display Message
  let bankName;
  if(bank){
    bankName = 'Heater Kit';
    if(isOn){
      if(displayMessage.current != null){
      displayMessage.current.innerText = "Heater Kit"
    }
    }else{
      displayMessage.current.innerText = ""
    }
  }else{
    bankName = "Smooth Piano Kit"
     if(isOn){
      if(displayMessage.current != null){
      displayMessage.current.innerText = "Smooth Piano Kit"
    }
    }else{
      displayMessage.current.innerText = ""
    }
  }

  //get currentCollection depending on bank state
  let currentCollection = collection.filter(source => {
          if(source.kitName === bankName){
            return source;
          }else{
        return null;
      }
  });

  //keydown function
  const handleKeyDown = (e) => {
    if(isOn){
      //get key object name
    const selectedName = currentCollection.filter((source)=>{
      if(e.key.toUpperCase() === source.id){
          return source;
      }
    });

    //get associated div
    let selectedDiv = [];
    if(selectedName.length === 1){
      selectedDiv = divRefs.filter((divRef)=>{
      if(divRef.current.id === selectedName[0].name){
        return divRef;
      }
    });
    }

    //start action
    if(selectedDiv.length === 1){
      displayMessage.current.innerText = selectedDiv[0].current.id;
      selectedDiv[0].current.style.background = '#f64c72';
      selectedDiv[0].current.style.boxShadow = "none";
      selectedDiv[0].current.childNodes[0].volume = volume;
      selectedDiv[0].current.childNodes[0].load();
      selectedDiv[0].current.childNodes[0].play();
      setTimeout(function(){ 
      selectedDiv[0].current.style.boxShadow = "2px 2px black";
      selectedDiv[0].current.style.background = '#99738E';  
    }, 100)
    }
    }
  };

  //keydown action listener
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    }
  })
  
  
  //click function
  const play = (divRef) => {
   if(isOn){
     displayMessage.current.innerText = divRef.current.id;
     divRef.current.style.background = '#f64c72';
     divRef.current.style.boxShadow = "none";
     divRef.current.childNodes[0].volume = volume;
     divRef.current.childNodes[0].load();
     divRef.current.childNodes[0].play();
     setTimeout(function(){ 
     divRef.current.style.boxShadow = "2px 2px black";
     divRef.current.style.background = '#99738E';  
    }, 100);
   }
  }


  //volume state
  const handleVolumeChange = (event ,volume) => {
    displayMessage.current.innerText = 'Volume : '+Math.round(volume*100);
    setVolume(volume);
  }

  
  return (
    <div className="main" id="drum-machine">
      <div className="musical-controls">
      {
        //creating divs
        currentCollection.map((source) => {
          const divRef = createRef();
          divRefs.push(divRef);
          return(
            <div className="drum-pad" id={source.name} style={{background: "#99738E"}} ref={divRef} onClick={()=>{play(divRef)}}>
                <audio className="clip" src={source.src} id={source.id} ></audio>
                 {source.id}
            </div>
          )
        })
      }
      </div>
      <div className="operating-controls">
      <button className="power-btn" onClick={()=>{setOn(!isOn)}} style={{background : isOn ? "green" : "red"}} >{isOn ? "ON" : "OFF"}</button>
        <div className="displayMessage" >
          <p ref={displayMessage} id="display"></p>
        </div>
        <Slider value={volume} onChange={handleVolumeChange} min={0} max={1} step={0.01} />
        <button className="bank_switch" onClick={()=>{setBank((bank)=>{return !bank})}}>Switch Bank</button>
      </div>
    </div>
  );
}

export default App;
