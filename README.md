# react-remote-state

## Usage

### Entities


```ts
import { entity } from 'react-remote-state';

export const myEntity = entity({
  defaultValue: ???,
  query: (id: string) => api.query(id),
  mutate: (newValue, id) => api.update(id, newValue),
});
```
