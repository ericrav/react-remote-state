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

const storage = entity({
  query: (key: string) => new Promise<string>(resolve => {
    console.log('query', key);
    setTimeout(() => resolve(localStorage.getItem(key) || ''), 1500);
  }),
  queryTTL: 10000,
  mutate: (value, [key]) => { localStorage.setItem(key, value); return value },
});

function TextArea() {
  const [id, setID] = useState('textA');
  const [state, setState, { query }] = useRemoteState(storage(id));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 400 }}>
      <select value={id} onChange={(e) => setID(e.target.value)}>
        <option value="textA">Text A</option>
        <option value="textB">Text B</option>
        <option value="textC">Text C</option>
      </select>
      {state !== undefined &&  (
        <textarea value={state} onChange={(e) => setState(e.target.value)} />
      )}
      {query.loading && <div>Loading...</div>}
    </div>
  );
}
