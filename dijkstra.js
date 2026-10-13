/**
 * Dijkstra's algorithm — shortest paths in a weighted graph.
 *
 * The graph is an object where each key is a vertex and each value is an
 * object mapping adjacent vertices to the (non-negative) weight of the edge
 * connecting them, e.g.
 *
 *   const graph = {
 *     'A': { 'B': 4, 'C': 2 },
 *     'B': { 'A': 4, 'C': 5, 'D': 10 },
 *     'C': { 'A': 2, 'B': 5, 'D': 3 },
 *     'D': { 'B': 10, 'C': 3 }
 *   };
 */

/**
 * Minimal binary-heap min-priority queue (lowest priority dequeued first).
 */
class MinPriorityQueue {
  #heap = [];

  get size() {
    return this.#heap.length;
  }

  /**
   * Adds an element with the given priority.
   * @param {*} element
   * @param {number} priority
   */
  enqueue(element, priority) {
    this.#heap.push({ element, priority });
    this.#bubbleUp(this.#heap.length - 1);
  }

  /**
   * Removes and returns the { element, priority } with the smallest priority.
   * @returns {{ element: *, priority: number } | undefined}
   */
  dequeue() {
    if (this.#heap.length === 0) return undefined;

    const top = this.#heap[0];
    const last = this.#heap.pop();
    if (this.#heap.length > 0) {
      this.#heap[0] = last;
      this.#sinkDown(0);
    }
    return top;
  }

  #bubbleUp(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.#heap[parent].priority <= this.#heap[index].priority) break;
      [this.#heap[parent], this.#heap[index]] = [this.#heap[index], this.#heap[parent]];
      index = parent;
    }
  }

  #sinkDown(index) {
    const length = this.#heap.length;
    while (true) {
      let smallest = index;
      const left = 2 * index + 1;
      const right = 2 * index + 2;

      if (left < length && this.#heap[left].priority < this.#heap[smallest].priority) {
        smallest = left;
      }
      if (right < length && this.#heap[right].priority < this.#heap[smallest].priority) {
        smallest = right;
      }
      if (smallest === index) break;

      [this.#heap[smallest], this.#heap[index]] = [this.#heap[index], this.#heap[smallest]];
      index = smallest;
    }
  }
}

/**
 * Validates the graph structure and edge weights, and collects every vertex
 * (graph keys plus any vertices that only appear as neighbours).
 *
 * @param {Object<string, Object<string, number>>} graph
 * @returns {string[]} all vertices, in a stable order
 */
function validateGraph(graph) {
  if (graph === null || typeof graph !== 'object' || Array.isArray(graph)) {
    throw new TypeError('graph must be an object mapping vertices to their adjacency maps');
  }

  const vertices = [];
  const seen = new Set();

  const addVertex = (vertex) => {
    if (!seen.has(vertex)) {
      seen.add(vertex);
      vertices.push(vertex);
    }
  };

  // First pass: graph keys, in declaration order, then any vertices that
  // only appear as neighbours of other vertices.
  for (const vertex of Object.keys(graph)) {
    addVertex(vertex);
  }

  for (const [vertex, neighbours] of Object.entries(graph)) {
    if (neighbours === null || typeof neighbours !== 'object' || Array.isArray(neighbours)) {
      throw new TypeError(`Adjacency map for vertex "${vertex}" must be an object`);
    }
    for (const [neighbour, weight] of Object.entries(neighbours)) {
      addVertex(neighbour);
      if (typeof weight !== 'number' || Number.isNaN(weight)) {
        throw new TypeError(
          `Weight of edge "${vertex}" -> "${neighbour}" must be a number, got ${JSON.stringify(weight)}`
        );
      }
      if (weight < 0) {
        throw new RangeError(
          `Weight of edge "${vertex}" -> "${neighbour}" must be non-negative, got ${weight}. ` +
            'Dijkstra\'s algorithm does not support negative weights.'
        );
      }
    }
  }

  return vertices;
}

/**
 * Computes the shortest distance from `start` to every vertex of `graph`
 * using Dijkstra's algorithm.
 *
 * @param {Object<string, Object<string, number>>} graph
 *   Weighted graph: each key is a vertex, each value maps adjacent vertices
 *   to non-negative edge weights.
 * @param {string} start
 *   The vertex from which to measure the shortest paths. Must exist in the graph.
 * @returns {Object<string, number>}
 *   An object mapping every vertex to its shortest distance from `start`.
 *   Unreachable vertices get `Infinity`.
 *
 * @throws {TypeError}  If the graph or an edge weight has an invalid type.
 * @throws {RangeError} If an edge weight is negative.
 * @throws {Error}      If `start` is not a vertex of the graph.
 *
 * @example
 *   const graph = {
 *     'A': { 'B': 4, 'C': 2 },
 *     'B': { 'A': 4, 'C': 5, 'D': 10 },
 *     'C': { 'A': 2, 'B': 5, 'D': 3 },
 *     'D': { 'B': 10, 'C': 3 }
 *   };
 *   dijkstra(graph, 'A'); // => { A: 0, B: 4, C: 2, D: 5 }
 */
export function dijkstra(graph, start) {
  const vertices = validateGraph(graph);

  if (!vertices.includes(start)) {
    throw new Error(`Start vertex "${start}" is not present in the graph`);
  }

  // Initialise all distances to Infinity, except the start vertex (distance 0).
  const distances = {};
  for (const vertex of vertices) {
    distances[vertex] = Infinity;
  }
  distances[start] = 0;

  const queue = new MinPriorityQueue();
  queue.enqueue(start, 0);

  while (queue.size > 0) {
    const { element: vertex, priority: distance } = queue.dequeue();

    // Skip stale entries: this vertex has already been reached via a shorter path.
    if (distance > distances[vertex]) continue;

    const neighbours = graph[vertex] ?? {};
    for (const [neighbour, weight] of Object.entries(neighbours)) {
      const candidate = distance + weight;
      if (candidate < distances[neighbour]) {
        distances[neighbour] = candidate;
        queue.enqueue(neighbour, candidate);
      }
    }
  }

  return distances;
}

export default dijkstra;
