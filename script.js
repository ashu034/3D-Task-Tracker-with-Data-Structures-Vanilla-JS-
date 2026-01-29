let bst = new BST();
let hashMap = new HashMap();
let graph = new Graph();
let heap = new MinHeap();

function addTask() {
  const taskName = document.getElementById("taskInput").value.trim();
  const priority = parseInt(document.getElementById("priorityInput").value);

  if (!taskName || isNaN(priority)) return alert("Fill both fields!");

  bst.insert(taskName);
  hashMap.set(taskName, { name: taskName, priority });
  graph.addNode(taskName);
  heap.insert({ task: taskName, priority });

  updateTaskList();
  updateGraphView();
}

function updateTaskList() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  bst.inOrder((task) => {
    const li = document.createElement("li");
    li.textContent = `${task} (Priority: ${hashMap.get(task).priority})`;
    list.appendChild(li);
  });
}

function updateGraphView() {
  document.getElementById("graphView").textContent = JSON.stringify(graph.adjList, null, 2);
}

function getTopPriorityTask() {
  const top = heap.extractMin();
  if (top) alert(`🔥 Most Urgent Task: ${top.task} (Priority ${top.priority})`);
  else alert("No tasks!");
}
class Node {
    constructor(value, text) {
        this.value = value;
        this.text = text;
        this.left = null;
        this.right = null;
    }
}

class BinarySearchTree {
    constructor() {
        this.root = null;
    }

    insert(value, text) {
        const newNode = new Node(value, text);
        if (!this.root) {
            this.root = newNode;
            return;
        }
        let current = this.root;
        while (true) {
            if (value < current.value) {
                if (!current.left) {
                    current.left = newNode;
                    return;
                }
                current = current.left;
            } else {
                if (!current.right) {
                    current.right = newNode;
                    return;
                }
                current = current.right;
            }
        }
    }

    // For visualization
    draw(ctx, node = this.root, x = 400, y = 30, dx = 150, dy = 70) {
        if (!node) return;

        ctx.beginPath();
        ctx.arc(x, y, 20, 0, 2 * Math.PI);
        ctx.fillStyle = "#0FC57C";
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "white";
        ctx.font = "14px Arial";
        ctx.textAlign = "center";
        ctx.fillText(node.text, x, y + 5);

        if (node.left) {
            ctx.moveTo(x, y);
            ctx.lineTo(x - dx, y + dy);
            ctx.stroke();
            this.draw(ctx, node.left, x - dx, y + dy, dx / 1.5, dy);
        }

        if (node.right) {
            ctx.moveTo(x, y);
            ctx.lineTo(x + dx, y + dy);
            ctx.stroke();
            this.draw(ctx, node.right, x + dx, y + dy, dx / 1.5, dy);
        }
    }
}
