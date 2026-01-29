class Graph {
    constructor() {
        this.adjList = new Map();
        this.positions = new Map();
    }

    addVertex(taskName) {
        if (!this.adjList.has(taskName)) {
            this.adjList.set(taskName, []);
        }
    }

    addEdge(src, dest) {
        if (this.adjList.has(src) && this.adjList.has(dest)) {
            this.adjList.get(src).push(dest);
            this.adjList.get(dest).push(src);
        }
    }

    removeVertex(taskName) {
        if (!this.adjList.has(taskName)) return;
        // Remove edges
        for (let [key, neighbors] of this.adjList.entries()) {
            this.adjList.set(
                key,
                neighbors.filter((n) => n !== taskName)
            );
        }
        this.adjList.delete(taskName);
    }

    // Generate positions for visualization using simple circle layout
    layout(width = 800, height = 400) {
        const nodes = Array.from(this.adjList.keys());
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 3;

        nodes.forEach((node, i) => {
            const angle = (2 * Math.PI * i) / nodes.length;
            this.positions.set(node, {
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle),
            });
        });
    }

    draw(ctx) {
        if (this.adjList.size === 0) return;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        this.layout(ctx.canvas.width, ctx.canvas.height);

        ctx.font = '14px Poppins';
        ctx.strokeStyle = '#ffeaa7';
        ctx.fillStyle = '#fab1a0';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#e17055';
        ctx.shadowBlur = 8;

        // Draw edges
        for (let [node, neighbors] of this.adjList.entries()) {
            const pos = this.positions.get(node);
            neighbors.forEach((neighbor) => {
                const nPos = this.positions.get(neighbor);
                ctx.beginPath();
                ctx.moveTo(pos.x, pos.y);
                ctx.lineTo(nPos.x, nPos.y);
                ctx.stroke();
            });
        }

        // Draw nodes
        for (let node of this.adjList.keys()) {
            const pos = this.positions.get(node);
            ctx.beginPath();
            ctx.fillStyle = '#fab1a0';
            ctx.shadowColor = '#d63031';
            ctx.shadowBlur = 15;
            ctx.arc(pos.x, pos.y, 20, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();

            ctx.shadowBlur = 0;
            ctx.fillStyle = '#2d3436';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(node, pos.x, pos.y);
        }
    }
}
