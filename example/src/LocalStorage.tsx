import useRemoteState, { entity } from "react-remote-state";

export function LocalStorage() {
  return (
    <div>
      <h1>LocalStorage</h1>
      <TextArea />
    </div>
  );
}

const storage = entity<[string], any>({
  query: (key) => localStorage.getItem(key),
});

function TextArea() {
  const [state, setState] = useRemoteState(storage("text1"), { defaultValue: '' });
  return <textarea value={state} onChange={(e) => setState(e.target.value)} />;
}
