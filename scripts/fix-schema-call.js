// Simple script to call the schema fix endpoint
const adminCookie = "your-admin-session-cookie-here"; // Will work if running locally with active session

fetch('http://localhost:5000/api/admin/fix-products-schema', {
    method: 'POST',
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json'
    }
})
    .then(r => r.json())
    .then(data => {
        console.log('✅ Schema fix result:', data);
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Failed to fix schema:', err.message);
        process.exit(1);
    });
