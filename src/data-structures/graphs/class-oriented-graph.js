const uuid = require('uuid/v1');
const assert = require('assert');
const { inspect } = require('util');

// OMG: https://gist.github.com/jed/982883
/* function uuid(a) {
    return a
        ? (a ^ ((Math.random() * 16) >> (a / 4))).toString(16)
        : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuid);
} */

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
};

/** @private */
function validateType(type) {
    const isUndirected = type === edgeTypes.UNDIRECTED;
    const isDirected = type === edgeTypes.DIRECTED;
    assert(isUndirected || isDirected);
}

class Edge {
    constructor(srcNode, dstNode, data, type) {
        this.srcNode = srcNode;
        this.dstNode = dstNode;
        this.data = data;
        validateType(type);
        this.type = type;
    }

    isDirected() {
        return this.type === edgeTypes.DIRECTED;
    }
}

class Node {
    /**
     * @param id - id of a node. if null assigns new uuid
     * @param data {any} - data of the node
     */
    constructor(id, data) {
        this.id = id === null ? uuid() : id.toString();
        this.data = data;
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

    addEdge(srcId, dstId, data) {
        const srcNode = this.getNode(srcId);
        const dstNode = this.getNode(dstId);
        const edge = new Edge(srcNode, dstNode, data, this.type);
        this.edges[edge.srcNode.id][edge.dstNode.id] = edge;
        // ???
        /* if (this.type === edgeTypes.UNDIRECTED) {
            this.edges[edge.dstNode.id][edge.srcNode.id] = edge;
        } */
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
        const id1 = srcId.toString();
        const id2 = dstId.toString();
        if (this.isDirected()) {
            return edges[id1][id2];
        }
        return edges[id1][id2] || edges[id2][id1];
    }

    peekNode() {
        return this.nodes[0];
    }

    randomNode() {
        return this.nodes[randint(this.nodes.length)];
    }

    isDirected() {
        return this.type === edgeTypes.DIRECTED;
    }

    toDotGv({
        name = 'UNNAMED',
        vertexLabel = v => inspect(v.data),
        edgeLabel = e => inspect(e.data),
        graphOptions = {
            size: '500,500',
            ratio: 1,
            rankdir: 'LR',
            color: '#000000',
            bgcolor: '#ffffff'
        }
    }) {
        let string = 'strict ';
        let edgeop;
        if (this.isDirected()) {
            string += 'digraph';
            edgeop = '->';
        } else {
            string += 'graph';
            edgeop = '--';
        }
        string += ` ${name.toString()}\n`;
        string += '{\n';
        for (const opt in graphOptions) {
            string += `    ${opt}="${graphOptions[opt]}";\n`;
        }
        for (const id in this.nodes) {
            string += `    ${id.toString()} [label="${vertexLabel(
                this.nodes[id]
            )}",shape=circle];\n`;
        }
        for (const id1 in this.edges) {
            for (const id2 in this.edges[id1]) {
                string += `    ${id1.toString()} ${edgeop} ${id2.toString()} [label="${edgeLabel(
                    this.edges[id1][id2]
                )}"];\n`;
            }
        }
        string += '}\n';
        return string;
    }

    // TODO:
    /* toPng() {

    } */
}

module.exports = {
    Graph,
    edgeTypes
};
