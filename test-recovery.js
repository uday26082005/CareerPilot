const url = 'https://reciaozkyxidqzditivy.supabase.co/auth/v1/recover?redirect_to=http://localhost:5173/reset-password';
const anonKey = 'sb_publishable_OeONrHDpqKVCDX4oWuGw7A_DqCa8hAV';

fetch(url, {
  method: 'POST',
  headers: {
    'apikey': anonKey,
    'Authorization': `Bearer ${anonKey}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ email: 'samathamvignesh73@gmail.com' })
})
.then(res => res.json().then(data => ({status: res.status, body: data})))
.then(result => console.log('Result:', result))
.catch(err => console.error('Error:', err));
