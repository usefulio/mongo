# @useful/mongo

## Example usage

```js
import {
  connect,
  disconnect,
  getDatabase,
  getCollection,
  generateId
} from "@userful/mongo";

(async function() {
  await connect();
  const Users = await getCollection("users");
  const user = await Users.findOne({});
  await Users.insert({
    _id: generateId()
    /* Other fields */
  });
  await disconnect();
})();
```
