let members = [];
const lineCanvas = document.getElementById('lineCanvas');
const ctx = lineCanvas.getContext('2d');
const selectedMembers = new Set();
let isDrawingLine = false;

lineCanvas.width = document.getElementById('canvas').offsetWidth;
lineCanvas.height = document.getElementById('canvas').offsetHeight;

document.getElementById('addMember').addEventListener('click', openModal);
document.getElementById('lineButton').addEventListener('click', toggleLineDrawing);
document.querySelector('.close-button').addEventListener('click', closeModal);

function openModal() {
    document.getElementById('modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modal').classList.add('hidden');
    clearModalInputs(); // Очищаем поля ввода после закрытия
}

function clearModalInputs() {
    document.getElementById('name').value = '';
    document.getElementById('year').value = '';
    document.getElementById('location').value = '';
    document.getElementById('status').value = '';
}

document.getElementById('submit').addEventListener('click', function() {
    const name = document.getElementById('name').value;
    const year = document.getElementById('year').value;
    const location = document.getElementById('location').value;
    const status = document.getElementById('status').value;

    if (!name) {
        alert("ФИО обязательно!");
        return;
    }

    const member = {
        id: members.length,
        name: `${name}\nГод: ${year}\nЖитель: ${location}\nСтатус: ${status}`,
        x: Math.random() * (lineCanvas.width - 150),
        y: Math.random() * (lineCanvas.height - 100),
    };

    members.push(member);
    drawMember(member);
    closeModal(); // Закрыть модальное окно после добавления
});

function drawMember(member) {
    const rectangle = document.createElement('div');
    rectangle.className = 'rectangle';
    rectangle.innerText = member.name;
    rectangle.style.width = '150px';
    rectangle.style.height = '100px';
    rectangle.style.left = member.x + 'px';
    rectangle.style.top = member.y + 'px';

    rectangle.onmousedown = rectangle.ontouchstart = function(event) {
        event.preventDefault();
        dragAndDrop(rectangle, member);
    };

    rectangle.onclick = function() {
        if (isDrawingLine) {
            selectedMembers.has(member.id) ? selectedMembers.delete(member.id) : selectedMembers.add(member.id);
            rectangle.style.borderColor = selectedMembers.has(member.id) ? 'red' : 'black';
            drawLines();
        }
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

    // Обработка сенсорных событий
    element.ontouchstart = function(event) {
        event.preventDefault();
        moveAt(event.touches[0].pageX, event.touches[0].pageY);
        onMouseMove(event.touches[0]);
    };

    document.ontouchmove = function(event) {
        if (event.touches.length) {
            moveAt(event.touches[0].pageX, event.touches[0].pageY);
        }
    };

    document.ontouchend = function() {
        document.ontouchmove = null;
        document.ontouchend = null;
    };
}

function toggleLineDrawing() {
    isDrawingLine = !isDrawingLine;
    const buttonText = isDrawingLine ? "Сохранить линию" : "Линия";
    document.getElementById('lineButton').innerText = buttonText;

    if (!isDrawingLine) {
        selectedMembers.clear();
        drawLines();
    }
}

function drawLines() {
    ctx.clearRect(0, 0, lineCanvas.width, lineCanvas.height);
    const selectedArray = Array.from(selectedMembers);
    
    for (let i = 0; i < selectedArray.length; i++) {
        for (let j = i + 1; j < selectedArray.length; j++) {
            drawLine(members[selectedArray[i]], members[selectedArray[j]]);
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
