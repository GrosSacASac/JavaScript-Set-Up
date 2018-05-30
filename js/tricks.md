# JS tricks

`Object.assign` is useful on arrays.

```
const initialScores = [0, 0, 0];
// player a, player b, total games
const scores = [5, 2, 7];

// reset scores
Object.assign(scores, initialScores);
```

`{}` can be used to create local scopes anywhere

```
const minMax = function (numbers) {
  const results = [];
  // variables localResult does not clash,
  // independent blocks are used
  {
    const localResult = Math.min(...numbers);
    results.push(localResult);
  }

  {
    const localResult = Math.max(...numbers);
    results.push(localResult);
  }
  return results;
};

```


Array destructuring syntax can be used to swap variables;

```
let a = 5;
let b = 2;
[a, b] = [b, a];
```

