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

function drawTree() {
    svg.selectAll("*").remove(); // Очистка svg

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

// Открытие формы для добавления нового члена семьи
document.getElementById('addPersonButton').addEventListener('click', () => {
    document.getElementById('formPopup').style.display = 'block';
});

// Закрытие формы
document.getElementById('closeForm').addEventListener('click', () => {
    document.getElementById('formPopup').style.display = 'none';
});

// Добавление члена семьи по форме
document.getElementById('submitPerson').addEventListener('click', () => {
    const fullName = document.getElementById('fullName').value;
    const birthDate = document.getElementById('birthDate').value;
    const birthPlace = document.getElementById('birthPlace').value;
    const status = document.getElementById('status').value;

    if (fullName) {
        const newMember = { name: `${fullName} (${birthDate} ${birthPlace}, ${status})`, children: [] };
        data.children.push(newMember);
        drawTree();

        // Сброс формы и закрытие
        document.getElementById('formPopup').style.display = 'none';
        document.getElementById('fullName').value = '';
        document.getElementById('birthDate').value = '';
        document.getElementById('birthPlace').value = '';
        document.getElementById('status').value = '';
    }
});

// Реализация перетаскивания формы
let isDragging = false;
let offset = { x: 0, y: 0 };

const formPopup = document.getElementById('formPopup');
const formContent = document.querySelector('.form-content');

formContent.addEventListener('mousedown', (e) => {
    isDragging = true;
    offset.x = e.clientX - formPopup.getBoundingClientRect().left;
    offset.y = e.clientY - formPopup.getBoundingClientRect().top;
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        formPopup.style.left = (e.clientX - offset.x) + 'px';
        formPopup.style.top = (e.clientY - offset.y) + 'px';
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

// Отрисовка дерева при загрузке
drawTree();
