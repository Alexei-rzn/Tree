let members = [];
const lineCanvas = document.getElementById('lineCanvas');
const ctx = lineCanvas.getContext('2d');

lineCanvas.width = document.getElementById('canvas').offsetWidth;
lineCanvas.height = document.getElementById('canvas').offsetHeight;

document.getElementById('addMember').addEventListener('click', addMember);

function addMember() {
    const name = prompt("Введите имя члена семьи:");
    const member = {
        id: members.length,
        name: name || "Новый член семьи",
        x: Math.random() * (lineCanvas.width - 150),
        y: Math.random() * (lineCanvas.height - 100),
    };
    members.push(member);
    drawMember(member);
}

function drawMember(member) {
    const rectangle = document.createElement('div');
    rectangle.className = 'rectangle';
    rectangle.innerText = member.name;
    rectangle.style.width = '150px';
    rectangle.style.height = '100px';
    rectangle.style.left = member.x + 'px';
    rectangle.style.top = member.y + 'px';

    rectangle.onmousedown = function(event) {
        dragAndDrop(rectangle, member);
    };

    document.getElementById('canvas').appendChild(rectangle);
    drawLines();
}

function dragAndDrop(element, member) {
    let shiftX = event.clientX - element.getBoundingClientRect().left;
    let shiftY = event.clientY - element.getBoundingClientRect().top;

    function moveAt(pageX, pageY) {
        element.style.left = pageX - shiftX + 'px';
        element.style.top = pageY - shiftY + 'px';
        
        member.x = pageX - shiftX;
        member.y = pageY - shiftY;
        drawLines();
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    document.addEventListener('mousemove', onMouseMove);

    element.onmouseup = function() {
        document.removeEventListener('mousemove', onMouseMove);
        element.onmouseup = null;
    };
}

function drawLines() {
    ctx.clearRect(0, 0, lineCanvas.width, lineCanvas.height);
    for (let i = 0; i < members.length; i++) {
        for (let j = i + 1; j < members.length; j++) {
            drawLine(members[i], members[j]);
        }
    }
}

function drawLine(member1, member2) {
    const x1 = member1.x + 75; // Центр первого прямоугольника
    const y1 = member1.y + 50; // Центр первого прямоугольника
    const x2 = member2.x + 75; // Центр второго прямоугольника
    const y2 = member2.y + 50; // Центр второго прямоугольника

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = '#000';
    ctx.stroke();
}

document.addEventListener('dragstart', function(event) {
    event.preventDefault();
});
