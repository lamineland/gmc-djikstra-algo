# Dijkstra's Algorithm in JavaScript

An implementation of [Dijkstra's algorithm](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm) that computes the shortest distance from a starting vertex to every other vertex of a weighted graph with non-negative edge weights.

## Usage

```js
import dijkstra from './dijkstra.js';

const graph = {
  'A': { 'B': 4, 'C': 2 },
  'B': { 'A': 4, 'C': 5, 'D': 10 },
  'C': { 'A': 2, 'B': 5, 'D': 3 },
  'D': { 'B': 10, 'C': 3 }
};

dijkstra(graph, 'A');
// => { 'A': 0, 'B': 4, 'C': 2, 'D': 5 }
```

### API

#### `dijkstra(graph, start)`

| Parameter | Type | Description |
| --- | --- | --- |
| `graph` | `Object<string, Object<string, number>>` | Weighted graph. Each key is a vertex; its value maps adjacent vertices to non-negative edge weights. |
| `start` | `string` | The vertex from which the shortest paths are measured. Must be a vertex of the graph. |

**Returns:** an object mapping every vertex to its shortest distance from `start`. Vertices that cannot be reached from `start` are given `Infinity`.

**Throws:**
- `TypeError` if the graph (or an adjacency map) is not an object, or an edge weight is not a number.
- `RangeError` if an edge weight is negative (Dijkstra's algorithm requires non-negative weights).
- `Error` if `start` is not a vertex of the graph.

## Implementation notes

- Uses a binary-heap min-priority queue, giving a time complexity of **O((V + E) log V)** and **O(V)** auxiliary space.
- Stale priority-queue entries are skipped lazily (lazy deletion), avoiding the need for a decrease-key operation.
- Vertices that only appear as neighbours of other vertices are treated as leaf vertices (no outgoing edges) and included in the result.

## Tests

```bash
npm test
```
