class BSTNode {
    constructor(task) {
        this.task = task; // task object with unique name/id
        this.left = null;
        this.right = null;
        this.x = 0; // for canvas visualization
        this.y = 0;
    }
}

class BST {
    constructor() {
        this.root = null;
        this.positions = [];
    }

    insert(task) {
        if (!this.root) {
            this.root = new BSTNode(task);
            return true;
        }
        return this._insertNode(this.root, task);
    }

    _insertNode(node, task) {
        if (task.name === node.task.name) {
            // duplicate task name not allowed
            return false;
        }
        if (task.name < node.task.name) {
            if (node.left === null) {
                node.left = new BSTNode(task);
                return true;
            } else {
                return this._insertNode(node.left, task);
            }
        } else {
            if (node.right === null) {
                node.right = new BSTNode(task);
                return true;
            } else {
                return this._insertNode(node.right, task);
            }
        }
    }

    inOrder(node = this.root, arr = []) {
        if (node) {
            this.inOrder(node.left, arr);
            arr.push(node.task.name);
            this.inOrder(node.right, arr);
        }
        return arr;
    }

    delete(name) {
        this.root = this._deleteNode(this.root, name);
    }

    _deleteNode(node, name) {
        if (node == null) return null;

        if (name < node.task.name) {
            node.left = this._deleteNode(node.left, name);
            return node;
        } else if (name > node.task.name) {
            node.right = this._deleteNode(node.right, name);
            return node;
        } else {
            // node to delete found
            if (!node.left && !node.right) return null;
            if (!node.left) return node.right;
            if (!node.right) return node.left;

            // node with two children: get inorder successor
            let minLargerNode = node.right;
            while (minLargerNode.left) {
                minLargerNode = minLargerNode.left;
            }
            node.task = minLargerNode.task;
            node.right = this._deleteNode(node.right, minLargerNode.task.name);
            return node;
        }
    }

    // For visualization, set (x, y) coords to each node
    layout(width = 800, height = 400) {
        this.positions = [];
        const assignCoords = (node, depth, xMin, xMax) => {
            if (!node) return;
            node.y = depth * 70 + 50;
            node.x = (xMin + xMax) / 2;
            this.positions.push(node);
            assignCoords(node.left, depth + 1, xMin, node.x);
            assignCoords(node.right, depth + 1, node.x, xMax);
        };
        assignCoords(this.root, 0, 50, width - 50);
    }

    draw(ctx) {
        if (!this.root) return;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.strokeStyle = '#f8c291';
        ctx.fillStyle = '#6a89cc';
        ctx.lineWidth = 2;
        ctx.font = '16px Poppins';

        this.layout(ctx.canvas.width, ctx.canvas.height);

        // Draw edges
        for (let node of this.positions) {
            if (node.left) {
                ctx.beginPath();
                ctx.moveTo(node.x, node.y);
                ctx.lineTo(node.left.x, node.left.y);
                ctx.stroke();
            }
            if (node.right) {
                ctx.beginPath();
                ctx.moveTo(node.x, node.y);
                ctx.lineTo(node.right.x, node.right.y);
                ctx.stroke();
            }
        }

        // Draw nodes
        for (let node of this.positions) {
            ctx.beginPath();
            ctx.fillStyle = '#82ccdd';
            ctx.strokeStyle = '#0c2461';
            ctx.lineWidth = 3;
            ctx.shadowColor = '#22a6b3';
            ctx.shadowBlur = 10;
            ctx.arc(node.x, node.y, 22, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#0c2461';
            ctx.shadowBlur = 0;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(node.task.name, node.x, node.y);
        }
    }
}
