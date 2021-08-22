# qlearn

Reinforcement learning library, based on the Quality learning technique

The strength of qlearn is its simplicity, and its independence towards the decision taker.

## when to not use

If a situation is not going to happen twice. Or if the set of actions is infinite.

## concepts

### Set of state and actions

The library expects as input a reduced set of state and action as a String. Create a value that is minimal, sorted and canonical. When the set of actions are always the same omit it. Two situation where the possible actions are the same, and the observed state is the same, should have the same set of state and actions. Short is `stateActions`

### actions

An action that is taken should have an effect on the state, and sometimes a reward. `decide() and learn()` take an array of action names, not the actions themselves.

### reward

Rewards will be used to correct the behaviour of the intelligence over time. Use negative rewards for punishment.


## install

```
npm i qlearn
```

## import

```js
import { createIntelligence, learn, decide } from "qlearn";
import { createIntelligence, learn, decide } from "https://unpkg.com/qlearn/source/qlearn.js";
```

## usage

### creation

```js
const intelligence = createIntelligence();
```

### override all options

```js
Object.assign(intelligence, {
    defaultQuality: 0,
    learnFactor: 0.5,
    discountFactor: 0.9,
    exploreBonus: 0.04,
    qualityMap: new Map(),
});
```

### `decide()`

The actionName will be random if this set of state and actions was never encountered before.

Will use `.qualityMap`.


```js
const actionName = decide({intelligence, stateActions, actionNames});
```

Alternatively use partial random decide. It is the same function, except it randomly decides 20% of the time.

```js
import { partialRandomDecide } from "qlearn/source/partialRandomDecide.js";

const actionName = partialRandomDecide({intelligence, stateActions, actionNames});
```

### `learn()`

Use it as soon as reward is available after `decide()`.

previous set of state and actions and set of state and actions may be equal if the action taken had no consequences.

Will update `.qualityMap`.

Note: It is possible to learn even if the previous action did not come from `decide()`, for example: If a human decides, the `learn()` can still be used.

```js
learn({
    intelligence,
    previousStateActions,
    stateActions,
    previousAction,
    actionNames,
    reward,
});
```

### `.qualityMap`

```js
const { qualityMap } = intelligence;
```

```js
intelligence.qualityMap = new Map();
```

### `.defaultQuality`

```js
intelligence.defaultQuality = 0;
```

### `.learnFactor`

`0 < learnFactor < 1 `

```js
intelligence.learnFactor = 0.5;
```

### `.discountFactor`


`0 < discountFactor < 1 `

```js
intelligence.discountFactor = 0.9;
```

### `.exploreBonus`

A positive number to encourage exploration, a negative number to discourage exploration.
Ideally orders of magnitude smaller than a normal reward.

```js
intelligence.exploreBonus = 0.04;
```

## extras

### randomDecide

It decides randomly.

```js
import { randomDecide } from "qlearn/source/randomDecide.js";
```


## Related

https://github.com/acupajoe/node-qlearning

 * full flow integrated (state, reward, etc)
 * includes state hasher
 * more opinionated, less flexible

### License

[CC0](./license.txt)
