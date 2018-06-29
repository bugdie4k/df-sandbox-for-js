const formatree = require('formatree');

const vertexStyles = {
    VERTEX_AS_OBJECT: '__VERTEX_AS_OBJECT_VERTEX_STYLE__',
    VERTEX_AS_FIELD: '__VERTEX_AS_FIELD_VERTEX_STYLE__'
}

/** @private */
function _toJsVertexAsObject(binaryTreeArray, curI) {
    if (curI < binaryTreeArray.length) {
        const children = [];
        const child1 = _toJsVertexAsObject(binaryTreeArray, 2 * curI + 1);
        const child2 = _toJsVertexAsObject(binaryTreeArray, 2 * curI + 2);
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
function _toJsVertexAsField(binaryTreeArray, curI, result = {}) {
    if (curI < binaryTreeArray.length) {
        const children = {};
        const child1 = _toJsVertexAsField(binaryTreeArray, 2 * curI + 1);
        const child2 = _toJsVertexAsField(binaryTreeArray, 2 * curI + 2);
        if (child1 !== undefined) Object.assign(children, child1);
        if (child2 !== undefined) Object.assign(children, child2);
        return Object.assign(result, {
            [binaryTreeArray[curI].toString()]: children
        });
    }
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

    /**
     * VERTEX_AS_OBJECT style produces object like { data: root , children: [ { data: v1, children: [ ... ]}, ... ] }
     * VERTEX_AS_FIELD style produces object like { root: { v1: {} } }
     * With VERTEX_AS_FIELD vertex contents are written into object field after .toString()
     */
    toJS(style = vertexStyles.VERTEX_AS_OBJECT) {
        if (style === vertexStyles.VERTEX_AS_OBJECT) {
            return _toJsVertexAsObject(this.treeArray, 0);
        }
        else if (style === vertexStyles.VERTEX_AS_FIELD) {
            return _toJsVertexAsField(this.treeArray, 0);
        }
        throw new Error(`Unknown style ${style}`);
    }


    toPrettyStr() {
        return formatree(
            this.toJS(vertexStyles.VERTEX_AS_FIELD), {
                sibling: '|-- ',
                lastSibling: '`-- ',
                indent: '|   '
            });
    }

    addOne(el) {
        // aliases
        const a = this.treeArray;
        const cmp = this.compare;
        // algorithm
        a.push(el);
        let elI = a.length - 1;
        if (elI !== 0) {
            while (true) {
                if (elI === 0)
                    break;
                const parentI = Math.floor(elI / 2);
                if (cmp(a[parentI], a[elI]))
                    break;
                const tmp = a[parentI];
                a[parentI] = a[elI];
                a[elI] = tmp;
                elI = parentI;
            }
        }
    }

    add(...elements) {
        for (const el of elements)
            this.addOne(el);
    }

    take() {
        // aliases
        const a = this.treeArray;
        const cmp = this.compare;
        // algorithm
        const result = a[0];
        a[0] = a[a.length - 1];
        a.pop();
        let curI = 0;
        while (true) {
            const child1I = 2 * curI + 1;
            const child2I = 2 * curI + 2;
            // if the child index is >= to length then then there is no child and cmp must succeed.
            // if curI has no children it is on the bootom and the algoritm must quit.
            const cmpWithChild1 = cmp(a[curI], a[child1I]) || (child1I >= a.length);
            const cmpWithChild2 = cmp(a[curI], a[child2I]) || (child2I >= a.length);
            if (cmpWithChild1 && cmpWithChild2)
                break;
            let swapWithI = child1I;
            // if there is no child1I, then swap must occur with child2I.
            // if there is no child1I and also no child2I on this iteration
            // the algorith would quit due to (cmpWithChild1 && cmpWithChild2).
            if (child1I >= a.length || cmp(a[child2I], a[child1I]))
                swapWithI = child2I;
            const tmp = a[curI];
            a[curI] = a[swapWithI];
            a[swapWithI] = tmp;
            curI = swapWithI;
        }
        return result;
    }

    takeSome(amount) {
        const result = [];
        for (let i = 0; i < amount; ++i)
            result.push(this.take());
        return result;
    }
}

module.exports = {
    BinaryHeap,
    vertexStyles
};