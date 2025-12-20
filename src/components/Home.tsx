import { RootState } from '../state/store';
import { useSelector } from 'react-redux';
import { download } from '../utilities/file';
import TextEditor from './TextEditor';
import Menu from './Menu';
import Settings from './Settings';

export default function Home() {
  const currentTheme = useSelector((state: RootState) => state.theme.mode);
  return (
    <div className={currentTheme == 'light' ? 'lightTheme fullWidthFulllHeight' : 'darkTheme fullWidthFulllHeight'} >
      <Menu currentTheme={currentTheme}/>
      <Settings/>

      <TextEditor downloadFunction={download}/>
    </div>
  );
}
