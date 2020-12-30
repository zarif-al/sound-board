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

  //load audio set
  let audioSet = collection.filter(source => source.kitName === state.bankName);
  
  //trigger keys populated in audioSet map in App return method
  let triggerKeys = [];

  //keydown handler
  const handleKeyDown = (e) => {
    
    if(state.isOn){

        if(triggerKeys.find(source => source === e.key.toUpperCase())){
          play(e.key.toUpperCase());
        } 
      
    }
    
  };

  //audio play
  const play = (id) => {
     displayMessage.current.innerText = refs.current[id].id;
     refs.current[id].style.boxShadow = "white 0px 3px";
     refs.current[id].style.height = "2.8rem";
     refs.current[id].childNodes[0].volume = state.volume;
     refs.current[id].childNodes[0].load();
     refs.current[id].childNodes[0].play();
     setTimeout(function(){ 
     refs.current[id].style.boxShadow = "black 3px 3px 5px";
     refs.current[id].style.background = 'white';  
     refs.current[id].style.height = "3rem";
    }, 100);
  }

  //volume state
  const handleVolumeChange = (event, volume) => {
    displayMessage.current.innerText = 'Volume : '+Math.round(volume*100);
    setTimeout(()=>{
       displayMessage.current.innerText = ""
    }, 500)
    dispatch({type : "changeVolume", param : volume})
  }

  //ref array for creating div refs          
  const refs = useRef({});
  
  return (
    <div className="main" id="drum-machine">
      <div className="musical-controls">
      {
        //creating divs
        audioSet.map((source) => {
          triggerKeys.push(source.id);
          return(
            <div className="drum-pad" id={source.name} ref={ref => (refs.current[source.id] = ref)} onClick={()=>{if(state.isOn){play(source.id)}}} style={drumStyle()}>
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
          <p ref={displayMessage} id="display">{state.bankName}</p>
        </div>
        <Slider value={state.volume} onChange={handleVolumeChange} min={0} max={1} step={0.01} style={{color : "black"}}/>
        <button className="bank_switch" onClick={()=>{dispatch({type : "changeBank"})}}>Switch Bank</button>
      </div>
    </div>
  );
}

export default App;
