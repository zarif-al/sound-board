import './App.css';
import {useRef, useEffect, createRef, useReducer} from 'react';
import collection from './Collection';
import Slider from '@material-ui/core/Slider';
function App() {
  //keydown action listener
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return function cleanup(){
       window.removeEventListener("keydown", handleKeyDown);
    }
  });

  //define reducer
  const reducer = (state, action) => {
    if(action.type === "changeVolume"){
      return {
        ...state,
        volume : action.param
      }
    }

    if(action.type === "setOn"){
      return {
        ...state,
        isOn : !state.isOn
      }
    }

    if(action.type === "changeBank"){
      if(state.bankName === "Heater Kit"){

        return {
          ...state,
          bankName : "Smooth Piano Kit"
        }

      }else{

        return {
          ...state,
          bankName : "Heater Kit"
        }

      }
    }

    throw new Error('No action received')
  }

  //define defaultState
  const defaultState = {
    bankName : "Heater Kit",
    volume : 0.5,
    isOn : true
  }
  //using reducer
  const [state, dispatch] = useReducer(reducer, defaultState)

  //reference declaration
  const displayMessage = useRef(null);

  //Drum pad styling
  const drumStyle = () => {
    if(state.isOn){
       return({
           background: "white",
           boxShadow: "black 3px 3px 5px"
        })
    }else{
       return({
        background : "darkGray",
        boxShadow : "none",
      })
    }
  }

  //ref array for declaring ref with map
  let divRefs = [];

  //setting display Message
  if(state.isOn){
    if(displayMessage.current != null){
      displayMessage.current.innerText = state.bankName
    }
  }else{
      displayMessage.current.innerText = ""
  }  

  //load audio set
  let audioSet = collection.filter(source => source.kitName === state.bankName);

  //keydown handler
  const handleKeyDown = (e) => {
    
    if(state.isOn){
        //get key object name
        const audioKey = audioSet.find((source) => e.key.toUpperCase() === source.id );

        //get associated div
        let audioDiv;
        if(audioKey !== undefined){
          audioDiv = divRefs.find((divRef)=> divRef.current.id === audioKey.name);
        }

        //play audio
        if(audioDiv !== undefined){
          play(audioDiv);
        }
    }

  };

 
  
  
  //audio play
  const play = (divRef) => {
     displayMessage.current.innerText = divRef.current.id;
     divRef.current.style.boxShadow = "white 0px 3px";
     divRef.current.style.height = "2.8rem";
     divRef.current.childNodes[0].volume = state.volume;
     divRef.current.childNodes[0].load();
     divRef.current.childNodes[0].play();
     setTimeout(function(){ 
     divRef.current.style.boxShadow = "black 3px 3px 5px";
     divRef.current.style.background = 'white';  
     divRef.current.style.height = "3rem";
    }, 100);
  }


  //volume state
  const handleVolumeChange = (volume) => {
    displayMessage.current.innerText = 'Volume : '+Math.round(volume*100);
    dispatch({type : "changeVolume", param : volume})
  }

  
  return (
    <div className="main" id="drum-machine">
      <div className="musical-controls">
      {
        //creating divs
        audioSet.map((source) => {
          const divRef = createRef();
          divRefs.push(divRef);
          return(
            <div className="drum-pad" id={source.name} ref={divRef} onClick={()=>{if(state.isOn){play(divRef)}}} style={drumStyle()}>
                <audio className="clip" src={source.src} id={source.id} ></audio>
                 {source.id}
            </div>
          )
        })
      }
      </div>
      <div className="operating-controls">
      <button className="power-btn" onClick={()=>{ dispatch({type : "setOn"}) }}>{state.isOn ? "ON" : "OFF"}</button>
        <div className="displayMessage" >
          <p ref={displayMessage} id="display"></p>
        </div>
        <Slider value={state.volume} onChange={handleVolumeChange} min={0} max={1} step={0.01} style={{color : "black"}}/>
        <button className="bank_switch" onClick={()=>{dispatch({type : "changeBank"})}}>Switch Bank</button>
      </div>
    </div>
  );
}

export default App;
