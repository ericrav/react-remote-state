# React Remote State

<a href="https://www.npmjs.com/package/react-remote-state">
  <img src="https://img.shields.io/npm/v/react-remote-state">
</a>

Cache & de-deduplicate queries and mutations across a React application's components with a convenient API mirroring `React.useState`. Immediately update the local cache with `setState` and let React Remote State call your mutation in the background with `debounce` or `throttle` options.

 Use the `entity` function to create separate cache scopes, set `onQuerySuccess` and `onMutateSuccess` callbacks, and automatically update

> !! in progress and not production ready !!

```tsx
import useRemoteState, { entity } from 'react-remote-state';

const post = entity({
  defaultValue: '',
  query: (id: string) => API.getPost(id),
  mutate: (post) => API.updatePost(post),
});

const PostEditor = ({ id }) => {
  const [post, setPost] = useRemoteState(post(id));

  return (
    <textarea
      value={post}
      onChange={e => setPost(e.target.value)}
    />
  );
};
```

## Usage

### Deriving multiple entities from queries or mutations

Often, API calls overlap in the data that is returned. For example, querying for a list of users may include the same data as querying for a single user by id. Use `entity.onQuerySuccess` to return other entities that can be derived from the query result. For example:


```ts
import { entity } from 'react-remote-state';

export const friendEntity = entity({
  query: (id) => fetch(`/friends/${id}`)
});

export const friendList = entity({
  query: () => fetch(`/friends`),
  onQuerySuccess: (friends) => friends.map(friend => friendEntity(friend.id)(friend))
});
```

When a component queries `friendList`, the cache will also be updated for each individual `friendEntity` by `id`, so that a component that uses the individual query will already have data loaded.
