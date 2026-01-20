import { toggleTheme } from '../state/themeSlice';
import { AppDispatch, ThemeState } from '../state/store';
import { useDispatch, useSelector } from 'react-redux';
import { incrementByAmount } from '../state/counterSlice';
import gear from '../assets/gear.svg';

export default function Settings() {
  const currentTheme = useSelector((state: ThemeState) => state.theme.mode);
  const count = useSelector((state: ThemeState) => state.counter.value);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <>
      <img src={gear} id="mySettingsGearIconId" className="settingsGearIcon" width="64x" height="64px" onClick={() => openSettingsMenu() } />
      <nav id="mySettingsNavID" className={currentTheme == 'light' ? 'lightTheme settingsMenuStyle' : 'darkTheme settingsMenuStyle'} >
        <a className="closebtn" onClick={() => closeSettingsMenu() }  >&times;</a>
        <ul className="noBullets">
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
    </>
  );
}

//cross framework functions
function openSettingsMenu():void{
  document.getElementById('mySettingsNavID').style.display = 'block';
  document.getElementById('mySettingsGearIconId').style.display = 'none';
}

function closeSettingsMenu():void{
  document.getElementById('mySettingsNavID').style.display = 'none';
  document.getElementById('mySettingsGearIconId').style.display = 'block';
}