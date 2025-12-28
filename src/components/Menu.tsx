import { Link } from "react-router-dom";
import hamburger from '../assets/hamburger.svg';

export default function Menu({currentTheme}) {
  const aboutParameter = new Date().toString();
  return (
    <>
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
          <li>
            <Link to="/todo">AWS ToDo</Link>
          </li>
        </ul>
      </nav>
    </>
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
