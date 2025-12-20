import React, { ChangeEvent, useState } from 'react';
import { RootState } from '../state/store';
import { useSelector } from 'react-redux';

const defaultFileName = 'file.txt';
const PIXELS_PER_ROW = 16;
const PIXELS_PER_COL = 16;

export default function TextEditor({downloadFunction}) {
  const currentTheme = useSelector((state: RootState) => state.theme.mode);
  const [textAreaContent, setTextAreaContent] = useState('');
  const handleFileNameChange = (event: React.ChangeEvent<HTMLInputElement>) => { setFileName(event.target.value); };
  const [fileName, setFileName] = useState<string>(defaultFileName);
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