import { RootState } from '../state/store';
import { useSelector } from 'react-redux';
import { download } from '../utilities/file';
import TextEditor from './TextEditor';
import Menu from './Menu';
import Settings from './Settings';

export default function Home() {
  if(window.Worker){
    const myWorker = new Worker(new URL('../demo.webworker.ts', import.meta.url));
    myWorker.postMessage('Test data sent to demo web worker' );
    myWorker.onmessage = function(e) {
      console.log('Message received from worker: ' + e.data);
    };
  }
  else {
    console.log('Your browser doesn\'t support web workers.');
  }



  const currentTheme = useSelector((state: RootState) => state.theme.mode);
  return (
    <div className={currentTheme == 'light' ? 'lightTheme fullWidthFulllHeight' : 'darkTheme fullWidthFulllHeight'} >
      <Menu currentTheme={currentTheme}/>
      <Settings/>

      <TextEditor downloadFunction={download}/>
    </div>
  );
}
