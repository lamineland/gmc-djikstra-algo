import { test } from 'node:test';
import assert from 'node:assert/strict';

import dijkstra from './dijkstra.js';

test('returns the shortest distances for the example graph', () => {
  const graph = {
    'A': { 'B': 4, 'C': 2 },
    'B': { 'A': 4, 'C': 5, 'D': 10 },
    'C': { 'A': 2, 'B': 5, 'D': 3 },
    'D': { 'B': 10, 'C': 3 }
  };

  assert.deepEqual(dijkstra(graph, 'A'), { 'A': 0, 'B': 4, 'C': 2, 'D': 5 });
});

test('works from every starting vertex of the example graph', () => {
  const graph = {
    'A': { 'B': 4, 'C': 2 },
    'B': { 'A': 4, 'C': 5, 'D': 10 },
    'C': { 'A': 2, 'B': 5, 'D': 3 },
    'D': { 'B': 10, 'C': 3 }
  };

  assert.deepEqual(dijkstra(graph, 'B'), { 'A': 4, 'B': 0, 'C': 5, 'D': 8 });
  assert.deepEqual(dijkstra(graph, 'C'), { 'A': 2, 'B': 5, 'C': 0, 'D': 3 });
  assert.deepEqual(dijkstra(graph, 'D'), { 'A': 5, 'B': 8, 'C': 3, 'D': 0 });
});

test('prefers a cheaper multi-hop route over an expensive direct edge', () => {
  const graph = {
    'A': { 'B': 100, 'C': 1 },
    'C': { 'B': 1 }
  };

  assert.deepEqual(dijkstra(graph, 'A'), { 'A': 0, 'B': 2, 'C': 1 });
});

test('handles a graph with a single vertex', () => {
  assert.deepEqual(dijkstra({ 'A': {} }, 'A'), { 'A': 0 });
});

test('reports Infinity for unreachable vertices', () => {
  const graph = {
    'A': { 'B': 1 },
    'B': {},
    'C': { 'D': 1 },
    'D': {}
  };

  const result = dijkstra(graph, 'A');
  assert.equal(result['A'], 0);
  assert.equal(result['B'], 1);
  assert.equal(result['C'], Infinity);
  assert.equal(result['D'], Infinity);
});

test('includes vertices that only appear as neighbours', () => {
  const graph = {
    'A': { 'B': 3 }
  };

  assert.deepEqual(dijkstra(graph, 'A'), { 'A': 0, 'B': 3 });
  assert.deepEqual(dijkstra(graph, 'B'), { 'A': Infinity, 'B': 0 });
});

test('finds the shortest path on a larger graph', () => {
  const graph = {
    'A': { 'B': 6, 'D': 1 },
    'B': { 'A': 6, 'C': 5, 'D': 2, 'E': 2 },
    'C': { 'B': 5, 'E': 5 },
    'D': { 'A': 1, 'B': 2, 'E': 1 },
    'E': { 'B': 2, 'C': 5, 'D': 1 }
  };

  // C is reached cheapest via A -> D -> E -> C (1 + 1 + 5 = 7).
  assert.deepEqual(dijkstra(graph, 'A'), { 'A': 0, 'B': 3, 'C': 7, 'D': 1, 'E': 2 });
});

test('throws when the start vertex is not in the graph', () => {
  const graph = { 'A': { 'B': 1 }, 'B': {} };

  assert.throws(() => dijkstra(graph, 'Z'), /not present in the graph/);
});

test('throws when an edge weight is negative', () => {
  const graph = { 'A': { 'B': -4 }, 'B': {} };

  assert.throws(() => dijkstra(graph, 'A'), RangeError);
});

test('throws when an edge weight is not a number', () => {
  const graph = { 'A': { 'B': '4' }, 'B': {} };

  assert.throws(() => dijkstra(graph, 'A'), TypeError);
});

test('throws when the graph is not an object', () => {
  assert.throws(() => dijkstra(null, 'A'), TypeError);
  assert.throws(() => dijkstra(['A'], 'A'), TypeError);
});
