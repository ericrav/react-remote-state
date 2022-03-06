import { useState } from 'react';
import useRemoteState, { entity } from 'react-remote-state';

export function LocalStorage() {
  return (
    <div>
      <h1>LocalStorage</h1>
      <TextArea />
      <div style={{ height: 36 }} />
      <TextArea />
    </div>
  );
}

const storage = entity<[string], any>({
  query: (key) => localStorage.getItem(key) || '',
  mutate: (value, key) => localStorage.setItem(key, value),
});

function TextArea() {
  const [id, setID] = useState('textA');
  const [state, setState, { loading }] = useRemoteState(storage(id), {
    defaultValue: '',
    query: (key) => new Promise(resolve => {
      setTimeout(() => resolve(localStorage.getItem(key) || ''), 1500);
    }),
    mutate: (value, key) => localStorage.setItem(key, value),
  });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 400 }}>
      <select value={id} onChange={(e) => setID(e.target.value)}>
        <option value="textA">Text A</option>
        <option value="textB">Text B</option>
        <option value="textC">Text C</option>
      </select>
      {loading ? (
        'Loading...'
      ) : (
        <textarea value={state} onChange={(e) => setState(e.target.value)} />
      )}
    </div>
  );
}
