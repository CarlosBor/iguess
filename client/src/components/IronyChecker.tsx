import { useState } from 'react';
import style from './IronyChecker.module.css';

// @ts-ignore
import GaugeComponent from 'react-gauge-component';

declare global {
    interface Window {
      SpeechRecognition: any;
      webkitSpeechRecognition: any;
      SpeechRecognitionEvent: any;
    }
  }
  
function IronyChecker() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(0);
  const [sentText, setSentText] = useState('');

  const SpeechRecognition =  window.SpeechRecognition || window.webkitSpeechRecognition;

  const correctWeights = (text:string, score:number) =>{
    console.log(`This would be an api call to add to the model with the values ${text} and ${score} :^)`)
    setSentText('');
    alert("Thank you for your feedback!");
  }

  const localCacheCheck = (text:string) =>{
    if (localStorage.getItem(text)==null){
        return null;
    }else{
        setSentText(text)
        return localStorage.getItem(text);
    }
  }

  const checkIrony = async () => {
    if(text===""){
      alert("Please enter text");
      return;
    }
    const cached = localCacheCheck(text);
      if (cached !== null) {
        setResult(parseInt(cached));
      } else {
        const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
            body: JSON.stringify({ text }),
        });

        const data = await response.json();
        const adjustedData = data.result[0].label === 'irony' ? (data.result[0].score/2) + 0.5 : data.result[0].score/2;
        const dataTwoDigits = (adjustedData*100+"").substring(0,2);
        setResult(parseInt(dataTwoDigits));
        setSentText(text);
        localStorage.setItem(text, dataTwoDigits);
    }
  };

  const startListening = () => {
    if (!SpeechRecognition) {
      console.error('SpeechRecognition API not supported');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setText(transcript.trim());
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
    };

    recognition.start();
  };

  return (
    <div className={style.wrapper}>
        {SpeechRecognition ? <button onClick={startListening}>🎤 Speak</button> : <span>Speech recognition available on Chrome-based browsers</span>}
        <GaugeComponent
        style = {{width: '500px'}}
        arc={{
            subArcs: [
            { limit: 20, color: '#5BE12C', showTick: true },
            { limit: 40, color: '#F5CD19', showTick: true },
            { limit: 60, color: '#F58B19', showTick: true },
            { limit: 100, color: '#EA4228', showTick: true },
            ]
        }}
        value={result}
        />
      <textarea className={style.textInput}value={text} onChange={(e) => setText(e.target.value)} />
      <button className={style.checkButton} onClick={checkIrony}>Check Irony</button>
      <div className={style.feedBack}>
        {sentText && <>
            <div className={style.feedbackText}>
                <span>Fellow human! Give us your feedback, would you say the text:</span>
                <span className={style.relevantText}>{sentText}</span>
                <span>is ironic?</span>
            </div>
            <div className={style.weightCorrectContainer}>
                <button onClick={() => correctWeights(sentText, 1)}>Yes</button>
                <button onClick={() => correctWeights(sentText, -1)}>No</button>        
            </div> 
        </>
        }
      </div>
    </div>
  );
}

export default IronyChecker;
