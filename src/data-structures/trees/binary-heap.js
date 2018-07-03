const formatree = require('formatree');

const vertexStyles = {
    VERTEX_AS_OBJECT: '__VERTEX_AS_OBJECT_VERTEX_STYLE__',
    VERTEX_AS_FIELD: '__VERTEX_AS_FIELD_VERTEX_STYLE__'
};

/** @private */
function toJsVertexAsObject(binaryTreeArray, curI) {
    if (curI < binaryTreeArray.length) {
        const child1 = toJsVertexAsObject(binaryTreeArray, 2 * curI + 1);
        const child2 = toJsVertexAsObject(binaryTreeArray, 2 * curI + 2);
        const children = [];
        if (child1 !== undefined) children.push(child1);
        if (child2 !== undefined) children.push(child2);
        if (children.length === 0) {
            return { data: binaryTreeArray[curI] };
        }
        return {
            data: binaryTreeArray[curI],
            children
        };
    }
}

/** @private */
function toJsVertexAsField(binaryTreeArray, curI) {
    if (curI < binaryTreeArray.length) {
        const child1 = toJsVertexAsField(binaryTreeArray, 2 * curI + 1);
        const child2 = toJsVertexAsField(binaryTreeArray, 2 * curI + 2);
        const children = {};
        if (child1 !== undefined) Object.assign(children, child1);
        if (child2 !== undefined) Object.assign(children, child2);
        return {
            [binaryTreeArray[curI].toString()]: children
        };
    }
}

function child1Index(i) {
    return 2 * i + 1;
}

function child2Index(i) {
    return 2 * i + 2;
}

function childrenIndexes(i) {
    return [child1Index[i], child2Index[i]];
}

function parentIndex(i) {
    return Math.floor(i / 2);
}

class BinaryHeap {
    /**
     * @param {Function(p, c)} compare - parent to children comparison.
     * If returns true then the order is correct.
     * Default enables the max-heap for integers.
     */
    constructor(compare = (p, c) => p > c) {
        this.treeArray = [];
        this.compare = compare;
    }

    __aliases() {
        return {
            a: this.treeArray,
            cmp: this.compare
        };
    }

    /**
     * VERTEX_AS_OBJECT style produces object like { data: root , children: [ { data: v1, children: [ ... ]}, ... ] }
     * VERTEX_AS_FIELD style produces object like { root: { v1: {} } }
     * With VERTEX_AS_FIELD vertex contents are written into object field after .toString()
     */
    toJS(style = vertexStyles.VERTEX_AS_OBJECT) {
        if (style === vertexStyles.VERTEX_AS_OBJECT) {
            return toJsVertexAsObject(this.treeArray, 0);
        } else if (style === vertexStyles.VERTEX_AS_FIELD) {
            return toJsVertexAsField(this.treeArray, 0);
        }
        throw new Error(`Unknown style ${style}`);
    }

    toPrettyStr() {
        return formatree(this.toJS(vertexStyles.VERTEX_AS_FIELD), {
            sibling: '|-- ',
            lastSibling: '`-- ',
            indent: '|   '
        });
    }

    get size() {
        return this.treeArray.length;
    }

    isEmpty() {
        return this.size === 0;
    }

    heapifyUp(curI) {
        const { a, cmp } = this.__aliases();
        while (true) {
            if (curI === 0) break;
            const parentI = parentIndex(curI);
            if (cmp(a[parentI], a[curI])) break;
            const tmp = a[parentI];
            a[parentI] = a[curI];
            a[curI] = tmp;
            curI = parentI;
        }
    }

    addOne(el) {
        this.treeArray.push(el);
        const elI = this.treeArray.length - 1;
        if (elI !== 0) {
            this.heapifyUp(elI);
        }
    }

    add(...elements) {
        for (const el of elements) this.addOne(el);
    }

    peek() {
        return this.treeArray[0];
    }

    heapifyDown(curI) {
        const { a, cmp } = this.__aliases();
        while (true) {
            const child1I = child1Index(curI);
            const child2I = child2Index(curI);
            // if the child index is >= to length then then there is no child and cmp must succeed.
            // if curI has no children it is on the bootom and the algoritm must quit.
            const cmpWithChild1 = cmp(a[curI], a[child1I]) || child1I >= a.length;
            const cmpWithChild2 = cmp(a[curI], a[child2I]) || child2I >= a.length;
            if (cmpWithChild1 && cmpWithChild2) break;
            let swapWithI = child1I;
            // if there is no child1I, then swap must occur with child2I.
            // if there is no child1I and also no child2I on this iteration
            // the algorith would quit due to (cmpWithChild1 && cmpWithChild2).
            if (child1I >= a.length || cmp(a[child2I], a[child1I])) swapWithI = child2I;
            const tmp = a[curI];
            a[curI] = a[swapWithI];
            a[swapWithI] = tmp;
            curI = swapWithI;
        }
    }

    _removeOnIndex(i) {
        const { a } = this.__aliases();
        const result = a[i];
        a[i] = a[a.length - 1];
        a.pop();
        this.heapifyDown(i);
        return result;
    }

    pop() {
        return this._removeOnIndex(0);
    }

    popFew(amount) {
        const result = [];
        for (let i = 0; i < amount; ++i) result.push(this.pop());
        return result;
    }

    find(predicate) {
        return this.treeArray.find(predicate);
    }

    removeOne(predicate) {
        const { a, cmp } = this.__aliases();
        const i = this.treeArray.findIndex(predicate);
        if (i === -1) {
            return { element: undefined, found: false };
        }
        return { element: this._removeOnIndex(i), found: true };
    }
}

module.exports = {
    BinaryHeap,
    vertexStyles
};
