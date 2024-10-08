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

// Load saved members from localStorage
window.onload = function () {
    if (localStorage.getItem('members')) {
        members = JSON.parse(localStorage.getItem('members'));
        members.forEach(member => {
            createMemberElement(member);
        });
    }
};

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

    const member = {
        id: Date.now(),
        name: document.getElementById('name').value,
        year: document.getElementById('year').value,
        city: document.getElementById('city').value,
        status: document.getElementById('status').value,
        left: 50,
        top: 50
    };

    members.push(member);
    saveMembersToLocalStorage();
    createMemberElement(member);
    addMemberModal.style.display = 'none';
});

// Create member HTML element
function createMemberElement(member) {
    const memberDiv = document.createElement('div');
    memberDiv.classList.add('member');
    memberDiv.innerHTML = `<p>${member.name}</p><p>${member.year}</p><p>${member.city}</p><p>${member.status}</p>`;

    memberDiv.style.left = member.left + 'px';
    memberDiv.style.top = member.top + 'px';

    memberDiv.dataset.id = member.id;

    // Enable drag and drop for members
    memberDiv.onmousedown = (event) => {
        dragMember(event, memberDiv);
    };

    treeContainer.appendChild(memberDiv);
}

// Drag member function
function dragMember(event, memberDiv) {
    let shiftX = event.clientX - memberDiv.getBoundingClientRect().left;
    let shiftY = event.clientY - memberDiv.getBoundingClientRect().top;

    function moveAt(pageX, pageY) {
        memberDiv.style.left = pageX - shiftX + 'px';
        memberDiv.style.top = pageY - shiftY + 'px';
    }

    moveAt(event.pageX, event.pageY);

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    document.addEventListener('mousemove', onMouseMove);

    memberDiv.onmouseup = () => {
        document.removeEventListener('mousemove', onMouseMove);
        memberDiv.onmouseup = null;

        // Save new position
        const member = members.find(m => m.id == memberDiv.dataset.id);
        member.left = parseInt(memberDiv.style.left);
        member.top = parseInt(memberDiv.style.top);
        saveMembersToLocalStorage();
    };
}

// Save members to localStorage
function saveMembersToLocalStorage() {
    localStorage.setItem('members', JSON.stringify(members));
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
