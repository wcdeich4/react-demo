import { useParams } from 'react-router-dom';
import { RootState } from '../state/store';
import { useSelector } from 'react-redux';
import Menu from './Menu';
import Settings from './Settings';

export default function About() {
  const params = useParams<{ id: string }>();
  //const { id } = useParams<string>();
  const currentTheme = useSelector((state: RootState) => state.theme.mode);
  return (
    <div className={currentTheme == 'light' ? 'lightTheme fullWidthFulllHeight' : 'darkTheme fullWidthFulllHeight'} >
      <Menu currentTheme={currentTheme}/>
      <Settings />

      <h1 className='center'>About Page with parameter {params.id}</h1>
    </div>
  );
}