import { ThemeState } from '../state/store';
import { useSelector } from 'react-redux';
import { downloadText } from '../utilities/AudioVideoHelper';
import TextEditor from './TextEditor';
import Menu from './Menu';
import Settings from './Settings';

export default function Home() {
  const currentTheme = useSelector((state: ThemeState) => state.theme.mode);
  return (
    <div className={currentTheme == 'light' ? 'lightTheme fullWidthFulllHeight' : 'darkTheme fullWidthFulllHeight'} >
      <Menu currentTheme={currentTheme}/>
      <Settings/>

      <TextEditor downloadFunction={downloadText}/>
    </div>
  );
}
