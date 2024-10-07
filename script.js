const addMemberBtn = document.getElementById('add-member-btn');
const addMemberModal = document.getElementById('add-member-modal');
const closeModal = document.getElementById('close-modal');
const memberForm = document.getElementById('member-form');
const treeContainer = document.getElementById('tree-container');
const canvas = document.getElementById('connections');
const connectMembersBtn = document.getElementById('connect-members-btn');

let members = [];
let selectedMembers = [];
let isConnecting = false;
let ctx = canvas.getContext('2d');

// Open modal to add member
addMemberBtn.addEventListener('click', () => {
    addMemberModal.style.display = 'flex';
});

// Close modal
closeModal.addEventListener('click', () => {
    addMemberModal.style.display = 'none';
});

// Add new member
memberForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const year = document.getElementById('year').value;
    const city = document.getElementById('city').value;
    const status = document.getElementById('status').value;

    const memberDiv = document.createElement('div');
    memberDiv.classList.add('member');
    memberDiv.innerHTML = `<p>${name}</p><p>${year}</p><p>${city}</p><p>${status}</p>`;

    memberDiv.style.left = '50px';
    memberDiv.style.top = '50px';

    // Enable drag and drop for members
    memberDiv.onmousedown = (event) => {
        dragMember(event, memberDiv);
    };

    treeContainer.appendChild(memberDiv);
    members.push(memberDiv);

    addMemberModal.style.display = 'none';
});

// Drag member function
function dragMember(event, member) {
    let shiftX = event.clientX - member.getBoundingClientRect().left;
    let shiftY = event.clientY - member.getBoundingClientRect().top;

    moveAt(event.pageX, event.pageY);

    function moveAt(pageX, pageY) {
        member.style.left = pageX - shiftX + 'px';
        member.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    document.addEventListener('mousemove', onMouseMove);

    member.onmouseup = () => {
        document.removeEventListener('mousemove', onMouseMove);
        member.onmouseup = null;
    };
}

// Handle connection mode
connectMembersBtn.addEventListener('click', () => {
    isConnecting = !isConnecting;
    selectedMembers = [];

    if (isConnecting) {
        connectMembersBtn.style.backgroundColor = '#FF5722';
    } else {
        connectMembersBtn.style.backgroundColor = '#2196F3';
        drawConnections();
    }
});

// Draw connection line between selected members
function drawConnections() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (selectedMembers.length === 2) {
        const rect1 = selectedMembers[0].getBoundingClientRect();
        const rect2 = selectedMembers[1].getBoundingClientRect();

        const x1 = rect1.left + rect1.width / 2;
        const y1 = rect1.top + rect1.height / 2;
        const x2 = rect2.left + rect2.width / 2;
        const y2 = rect2.top + rect2.height / 2;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

// Select members for connection
treeContainer.addEventListener('click', (e) => {
    if (isConnecting && e.target.classList.contains('member')) {
        if (!selectedMembers.includes(e.target)) {
            selectedMembers.push(e.target);
        }

        if (selectedMembers.length === 2) {
            drawConnections();
            selectedMembers = [];
        }
    }
});

// Resize canvas to fit window
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
