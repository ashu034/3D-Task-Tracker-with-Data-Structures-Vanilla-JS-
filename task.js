// Import BST and Graph classes from bst.js and graph.js (in this setup, they're global)

// Tasks stored in memory as objects with name, completed, and dependencies (names of other tasks)
let tasks = [];
const bst = new BST();
const graph = new Graph();

const incompleteTasksUl = document.getElementById('incomplete-tasks');
const completedTasksUl = document.getElementById('completed-tasks');
const newTaskInput = document.getElementById('new-task');
const addBtn = document.getElementById('add-btn');

const bstCanvas = document.getElementById('bst-canvas');
const bstCtx = bstCanvas.getContext('2d');

const graphCanvas = document.getElementById('graph-canvas');
const graphCtx = graphCanvas.getContext('2d');

addBtn.addEventListener('click', () => {
    const taskName = newTaskInput.value.trim();
    if (!taskName) {
        alert('Please enter a valid task name.');
        return;
    }
    if (tasks.find(t => t.name === taskName)) {
        alert('Task with this name already exists. Choose another.');
        return;
    }

    const newTask = { name: taskName, completed: false, dependencies: [] };
    tasks.push(newTask);

    // Insert into BST and Graph
    bst.insert(newTask);
    graph.addVertex(taskName);

    newTaskInput.value = '';
    renderTasks();
    drawStructures();
});

// Render tasks in UI
function renderTasks() {
    incompleteTasksUl.innerHTML = '';
    completedTasksUl.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task.name;
        if (task.completed) li.classList.add('completed');

        // Buttons for each task
        const btnEdit = document.createElement('button');
        btnEdit.textContent = 'Edit';
        btnEdit.className = 'edit';

        const btnDelete = document.createElement('button');
        btnDelete.textContent = 'Delete';
        btnDelete.className = 'delete';

        li.appendChild(btnEdit);
        li.appendChild(btnDelete);

        if (!task.completed) {
            // Complete on click
            li.addEventListener('dblclick', () => toggleComplete(task.name));
            incompleteTasksUl.appendChild(li);
        } else {
            completedTasksUl.appendChild(li);
        }

        btnDelete.addEventListener('click', () => {
            if (confirm(`Delete task "${task.name}"?`)) {
                deleteTask(task.name);
            }
        });

        btnEdit.addEventListener('click', () => {
            editTask(task.name);
        });
    });
}

// Toggle complete status
function toggleComplete(taskName) {
    let task = tasks.find(t => t.name === taskName);
    if (!task) return;
    task.completed = !task.completed;

    if (task.completed) {
        showConfetti();
    }

    renderTasks();
    drawStructures();
}

// Delete task
function deleteTask(taskName) {
    tasks = tasks.filter(t => t.name !== taskName);

    bst.delete(taskName);
    graph.removeVertex(taskName);

    renderTasks();
    drawStructures();
}

// Edit task name
function editTask(oldName) {
    let newName = prompt("Enter new task name:", oldName);
    if (!newName || newName.trim() === '') return;
    newName = newName.trim();

    if (tasks.find(t => t.name === newName)) {
        alert("Task with this name already exists!");
        return;
    }

    // Update task object
    let task = tasks.find(t => t.name === oldName);
    if (!task) return;
    task.name = newName;

    // Update BST and Graph
    bst.delete(oldName);
    bst.insert(task);

    graph.removeVertex(oldName);
    graph.addVertex(newName);

    // Also update dependencies if any (not handled here for simplicity)
    renderTasks();
    drawStructures();
}

// Draw BST and Graph
function drawStructures() {
    bst.draw(bstCtx);
    graph.draw(graphCtx);
}

// Confetti on complete
function showConfetti() {
    const duration = 1500;
    const end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
        });
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    })();
}

// Initial render
renderTasks();
drawStructures();
