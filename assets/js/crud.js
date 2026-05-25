// Simple AJAX helpers for the CRUD demo (uses JSON API endpoint)
(function () {
    const CRUD_BASE = window.__CRUD_BASE__ || 'https://scure-bank.42web.io/public/crud_handler.php';
    const out = document.getElementById('result-output');
    const form = document.getElementById('crud-form');

    function show(obj) {
        out.textContent = typeof obj === 'string' ? obj : JSON.stringify(obj, null, 2);
    }

    async function listAll() {
        show('Loading...');
        try {
            const res = await fetch(`${CRUD_BASE}?api=1`);
            const json = await res.json();
            show(json);
        } catch (e) {
            show('Error: ' + e.message);
        }
    }

    async function getById() {
        const id = document.getElementById('item-id').value;
        if (!id) return show('Please enter an ID');
        show('Loading...');
        try {
            const res = await fetch(`${CRUD_BASE}?api=1&id=${encodeURIComponent(id)}`);
            const json = await res.json();
            show(json);
        } catch (e) {
            show('Error: ' + e.message);
        }
    }

    document.getElementById('btn-list').addEventListener('click', listAll);
    document.getElementById('btn-get').addEventListener('click', getById);

    // Intercept form submit for AJAX demo
    form.addEventListener('submit', async function (e) {
        const clickedButton = e.submitter;
        
        // Check if an AJAX button was clicked (by checking button text or data attribute)
        // For now, if it's a submit button, allow normal POST to demonstrate $_POST
        // We'll use the 'type' to determine behavior
        
        e.preventDefault();
        const action = document.getElementById('form-action').value;
        const id = document.getElementById('item-id').value;
        const name = document.getElementById('item-name').value;
        const email = document.getElementById('item-email').value;

        show('Working...');
        try {
            const payload = { action, id, name, email };
            const res = await fetch(`${CRUD_BASE}?api=1`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const json = await res.json();
            show(json);
        } catch (e) {
            show('Error: ' + e.message);
        }
    });
})();
