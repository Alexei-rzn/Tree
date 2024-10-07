document.getElementById('add-relative-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const relation = document.getElementById('relation').value;

    const li = document.createElement('li');
    li.textContent = `${name} (${relation})`;
    
    document.getElementById('tree').appendChild(li);

    document.getElementById('name').value = '';
    document.getElementById('relation').value = '';
});
