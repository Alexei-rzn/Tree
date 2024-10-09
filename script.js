const data = {
    name: "Ваше Имя",
    children: [
        {
            name: "Отец",
            children: []
        },
        {
            name: "Мать",
            children: []
        }
    ]
};

const width = 800;
const height = 400;

const svg = d3.select("#tree").attr("width", width).attr("height", height);
const root = d3.hierarchy(data);
const treeLayout = d3.tree().size([height, width - 100]);

treeLayout(root);

svg.selectAll(".link")
    .data(root.links())
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("d", d3.linkHorizontal().x(d => d.y).y(d => d.x));

svg.selectAll(".node")
    .data(root.descendants())
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", d => `translate(${d.y},${d.x})`)
    .append("circle")
    .attr("r", 5);

svg.selectAll(".node")
    .append("text")
    .attr("dy", 3)
    .attr("x", d => d.children ? -8 : 8)
    .style("text-anchor", d => d.children ? "end" : "start")
    .text(d => d.data.name);

// Функция для добавления нового члена семьи
document.getElementById('addPersonButton').addEventListener('click', () => {
    const newName = prompt("Введите имя нового члена семьи:");
    if (newName) {
        const newMember = { name: newName, children: [] };
        data.children.push(newMember);
        updateTree();
    }
});

function updateTree() {
    svg.selectAll("*").remove(); // Очистка svg

    const root = d3.hierarchy(data);
    treeLayout(root);

    svg.selectAll(".link")
        .data(root.links())
        .enter()
        .append("path")
        .attr("class", "link")
        .attr("d", d3.linkHorizontal().x(d => d.y).y(d => d.x));

    const nodeGroup = svg.selectAll(".node")
        .data(root.descendants())
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.y},${d.x})`);

    nodeGroup.append("circle").attr("r", 5);
    
    nodeGroup.append("text")
        .attr("dy", 3)
        .attr("x", d => d.children ? -8 : 8)
        .style("text-anchor", d => d.children ? "end" : "start")
        .text(d => d.data.name);
}
