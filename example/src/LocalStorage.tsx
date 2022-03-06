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
  query: (key) => localStorage.getItem(key) || '',
  mutate: (value, key) => localStorage.setItem(key, value),
});

function TextArea() {
  const [state, setState] = useRemoteState(storage("text1"), {
    defaultValue: "",
    query: (key) => localStorage.getItem(key) || '',
    mutate: (value, key) => {
      console.log(value, key)
      localStorage.setItem(key, value)
    }
  });
  console.log(state)
  return <textarea value={state} onChange={(e) => setState(e.target.value)} />;
}
