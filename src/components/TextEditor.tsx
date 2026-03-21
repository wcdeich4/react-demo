import React, { ChangeEvent, useState } from 'react';
import { ThemeState } from '../state/store';
import { useSelector } from 'react-redux';
import configs from '../../configurations.json';

const defaultFileName = 'file.txt';
const PIXELS_PER_ROW = 16;
const PIXELS_PER_COL = 16;

export default function TextEditor({downloadFunction}){
  const currentTheme = useSelector((state: ThemeState) => state.theme.mode);
  const [textAreaContent, setTextAreaContent] = useState('');
  const handleFileNameChange = (event: React.ChangeEvent<HTMLInputElement>) => { setFileName(event.target.value); };
  const [fileName, setFileName] = useState<string>(defaultFileName);
  const [showSpinner, setShowSpinner] = useState(false);
  const handleTextAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => { setTextAreaContent(event?.target?.value); };
  const handleSaveToFile = () => {
    if (textAreaContent.trim() === '') {
      alert('Please enter some text to save.');
      return;
    }
    downloadFunction(textAreaContent, fileName);
  };

  const handleFileUploadChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event?.target?.files;
    if (files && files.length > 0){ // Ensure a file was selected
      const file = files[0];
      setFileName(files[0].name);
      const reader = new FileReader(); // Use FileReader to read the file's content
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const content = e?.target?.result as string; // e.target.result contains the file content as a string
        setTextAreaContent(content);
      };
      reader.onerror = (e) => {
        alert(`Error reading file: ${e.target?.error?.name} ${e.toString()}`);
      };
      reader.readAsText(file); // Read the file as text
    }
  };

  const saveToMongoDB = async () => {
    if(configs.mongo_api.save_url){
      setShowSpinner(true);
      try{
        const response = await fetch(configs.mongo_api.save_url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json', // Specify the content type
            },
            body: JSON.stringify({
              Name: fileName,
              Contents: textAreaContent,
            }),
          });
          if(!response.ok){
            alert(`HTTP error! status: ${response.status}`);
          }
          const result = await response.json();
          console.log('response calling ', result);
      }catch(err: any){
        console.error('error calling ' + configs.mongo_api.save_url, err);
      }finally{
        setShowSpinner(false);
      }
    }
  };

  const loadFromMongo = async () => {
    if(configs.mongo_api.load_url){
      const url = configs.mongo_api.load_url + fileName;
      setShowSpinner(true);
      fetch(url) 
          .then(response => {
            if (!response.ok) {
              throw new Error('response from ' + url + ' was not ok');
            }
            return response.json();
          })
          .then(data => {
            setTextAreaContent(data)
          })
          .catch((err: any) => {
            console.error(err)
          })
          .finally(() => {
            setShowSpinner(false);
          });
    }
  };

  const deleteFromMongo = async () => {
    if(configs.mongo_api.delete_url){
      const url = configs.mongo_api.delete_url + fileName;
      setShowSpinner(true);
      fetch(url) 
          .then(response => {
            if (!response.ok) {
              throw new Error('response from ' + url + ' was not ok');
            }
            setFileName('');
            setTextAreaContent('');
          })
          .catch((err: any) => {
            console.error(err)
          })
          .finally(() => {
            setShowSpinner(false);
          })
    }
  };

  return (
    <div className={currentTheme == 'light' ? 'lightTheme fullWidthFulllHeight' : 'darkTheme fullWidthFulllHeight'} >
      <h1 className="center largeText">Text Editor</h1>
      <div>
        <label htmlFor="fileUploadNameInput">&nbsp;Upload </label>
        <input type="file" id="fileUploadNameInput" accept=".txt,text/plain" onChange={handleFileUploadChange} />
        <br/>
        <label htmlFor="fileSaveNameInput">&nbsp;Save to </label>
        <input type="text" id="fileSaveNameInput" value={fileName} onChange={handleFileNameChange} />
        <button onClick={handleSaveToFile}>download</button>
        <button onClick={() => {setTextAreaContent(''); setFileName(''); }}>Clear</button>

        { configs.mongo_api.enabled && (
          <button onClick={() => { loadFromMongo(); }}>Mongo Load</button>
        )}

        { configs.mongo_api.enabled && (
          <button onClick={() => { saveToMongoDB(); }}>Mongo Save</button>
        )}

        { configs.mongo_api.enabled && (
          <button onClick={() => { deleteFromMongo(); }}>Mongo Delete</button>
        )}

        <span className={showSpinner ? 'spinner' : ''} ></span>
      </div>

      <div>
        <textarea
          value={textAreaContent}
          onChange={handleTextAreaChange}
          className={currentTheme == 'light' ? 'lightTheme fullWidthFulllHeight orangeOutline' : 'darkTheme fullWidthFulllHeight orangeOutline'} 
          rows={ window.innerWidth / PIXELS_PER_ROW }
          cols={ window.innerHeight / PIXELS_PER_COL }
          placeholder="Start typing here..."
        />
      </div>

    </div>

  );
}