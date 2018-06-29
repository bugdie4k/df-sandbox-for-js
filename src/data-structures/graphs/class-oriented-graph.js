/** [from, to) */
function randint(min, max) {
    if (max === undefined) {
        max = min;
        min = 0;
    }
    return Math.floor(Math.random() * (max - min)) + min;
}

const edgeTypes = {
    UNDIRECTED: '__UNDIRECTED_EDGE_TYPE__',
    DIRECTED: '__DIRECTED_EDGE_TYPE__'
}

class Edge {
    constructor(srcNode, dstNode, type) {
        this.srcNode = srcNode;
        this.dstNode = dstNode;
        this.type = type;
    }

    isDirected() {
        const isUndirected = this.type === edgeTypes.UNDIRECTED;
        const isDirected = this.type === edgeTypes.DIRECTED;
        assert(isUndirected || isDirected);
        return isDirected;
    }
}

// OMG: https://gist.github.com/jed/982883
function uuid(a) { return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuid) };

class Node {
    /** 
     * @arg id - id of a node. if null assigns new uuid
     * @arg data {any} - data of the node
     */
    constructor(id, data) {
        this.edges = [];
        this.id = (id === null) ? uuid() : id.toString();
        this.data = data;
    }

    get() {
        return this.data;
    }

    edges() {
        return this.edges;
    }

    outEdges() {
        return this.edges.filter(e => !e.isDirected || e.srcNode === this);
    }

    inEdges() {
        return this.edges.filter(e => !e.isDirected || e.dstNode === this);
    }
}

class Graph {
    constructor(type = edgeTypes.DIRECTED) {
        this.type = type;
        this.nodes = {};
        this.edges = {};
    }

    addNode(id, data) {
        const node = new Node(id, data);
        this.nodes[node.id] = node;
        this.edges[node.id] = {};
        return node;
    }

    addEdge(srcId, dstId) {
        const srcNode = this.getNode(srcId);
        const dstNode = this.getNode(dstId);
        const edge = new Edge(srcNode, dstNode);
        this.edges[edge.srcNode.id][edge.dstNode.id] = edge;
        return edge;
    }

    addEdges(...ids) {
        for (let i = 0; i < ids.length - 1; ++i) {
            this.addEdge(ids[i], ids[i + 1]);
        }
    }

    getNode(id) {
        return this.nodes[id.toString()];
    }

    getEdge(srcId, dstId) {
        return edges[srcId.toString()][dstId.toString()];
    }

    peekNode() {
        return this.nodes[0];
    }

    randomNode() {
        return this.nodes[randint(this.nodes.length)];
    }
}

module.exports = {
    Graph,
    edgeTypes
};
