import { useParams } from 'react-router-dom';

export default function About() {
  const params = useParams<{ id: string }>();
  //const { id } = useParams<string>();
  return (
    <div>
      <h1>About Page with parameter {params.id}</h1>
    </div>
  );
}