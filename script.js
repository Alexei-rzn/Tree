document.getElementById('addMember').addEventListener('click', addMember);

function addMember() {
    const rectangle = document.createElement('div');
    rectangle.className = 'rectangle';

    const name = prompt("Введите имя члена семьи:");
    rectangle.innerText = name || "Новый член семьи";

    rectangle.style.width = '150px';
    rectangle.style.height = '100px';
    rectangle.style.left = `${Math.random() * window.innerWidth}px`;
    rectangle.style.top = `${Math.random() * window.innerHeight}px`;

    rectangle.onmousedown = function(event) {
        dragAndDrop(rectangle, event);
    };

    document.getElementById('canvas').appendChild(rectangle);
}

function dragAndDrop(element, event) {
    let shiftX = event.clientX - element.getBoundingClientRect().left;
    let shiftY = event.clientY - element.getBoundingClientRect().top;

    function moveAt(pageX, pageY) {
        element.style.left = pageX - shiftX + 'px';
        element.style.top = pageY - shiftY + 'px';
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

document.addEventListener('dragstart', function(event) {
    event.preventDefault();
});
