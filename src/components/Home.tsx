import React, { ChangeEvent, useState } from 'react';
import { Link } from "react-router-dom";
import gear from '../assets/gear.svg';
import hamburger from '../assets/hamburger.svg';
import { AppDispatch, RootState } from '../state/store';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../state/themeSlice';
import { incrementByAmount } from '../state/counterSlice';
import { download } from '../utilities/file';
import TextEditor from './TextEditor';
const defaultFileName = 'file.txt';



export default function Home() {
  const aboutParameter = '123';
  const currentTheme = useSelector((state: RootState) => state.theme.mode);
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch<AppDispatch>();
  const [textAreaContent, setTextAreaContent] = useState('');
  const handleFileNameChange = (event: React.ChangeEvent<HTMLInputElement>) => { setFileName(event.target.value); };
  const [fileName, setFileName] = useState<string>(defaultFileName);
  const handleTextAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => { setTextAreaContent(event?.target?.value); };
  const handleSaveToFile = () => {
    if (textAreaContent.trim() === '') {
      alert('Please enter some text to save.');
      return;
    }
    download(textAreaContent, fileName);
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

      <img src={hamburger} id="myHamburgerIconId" className="hamburgericon" width="64x" height="64px" onClick={() => openHamburgerMenu() } />
      <nav id="myHamburgerNavID" className={currentTheme == 'light' ? 'lightTheme hamburgerMenuStyle' : 'darkTheme hamburgerMenuStyle'} >
        <a className="hamburgerClosebtn" onClick={() => closeHamburgerMenu() }  >&times;</a>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to={`/about/${aboutParameter}`}>About</Link>
          </li>
        </ul>
      </nav>

      <img src={gear} id="mySettingsGearIconId" className="settingsGearIcon" width="64x" height="64px" onClick={() => openSettingsMenu() } />
      <nav id="mySettingsNavID" className={currentTheme == 'light' ? 'lightTheme settingsMenuStyle' : 'darkTheme settingsMenuStyle'} >
        <a className="closebtn" onClick={() => closeSettingsMenu() }  >&times;</a>
        <ul>
          <li>
            <button onClick={() => dispatch(toggleTheme())} >
              theme is {currentTheme}
            </button>
          </li>
          <li>
            <button onClick={() => dispatch(incrementByAmount(10))} >
              count is {count}
            </button>
          </li>
        </ul>
      </nav>

      <TextEditor downloadFunction={download}/>

    </div>
  );
}

//cross framework functions
function openHamburgerMenu():void{
  document.getElementById('myHamburgerNavID').style.display = 'block';
  document.getElementById('myHamburgerIconId').style.display = 'none';
}

function closeHamburgerMenu():void{
  document.getElementById('myHamburgerNavID').style.display = 'none';
  document.getElementById('myHamburgerIconId').style.display = 'block';
}

function openSettingsMenu():void{
  document.getElementById('mySettingsNavID').style.display = 'block';
  document.getElementById('mySettingsGearIconId').style.display = 'none';
}

function closeSettingsMenu():void{
  document.getElementById('mySettingsNavID').style.display = 'none';
  document.getElementById('mySettingsGearIconId').style.display = 'block';
}