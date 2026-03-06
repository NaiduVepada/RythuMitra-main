const url = 'http://localhost:3002';

async function post(path, body){
  const res = await fetch(url + path, {method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body)});
  const text = await res.text();
  return {status: res.status, body: text};
}

(async ()=>{
  console.log('Testing sign-up with new email...');
  try{
    const r1 = await post('/api/auth/sign-up/email', {email: 'auto.test+'+Date.now()+'@example.com', name: 'Auto Test', password: 'Password123!'});
    console.log('/sign-up =>', r1.status);
    console.log(r1.body);
  }catch(e){ console.error('sign-up error', e); }

  console.log('\nTesting sign-in (expected to fail if user not created)...');
  try{
    const r2 = await post('/api/auth/sign-in/email', {email: 'auto.test+'+Date.now()+'@example.com', password: 'Password123!'});
    console.log('/sign-in =>', r2.status);
    console.log(r2.body);
  }catch(e){ console.error('sign-in error', e); }

  console.log('\nTesting get-session...');
  try{
    const r3 = await fetch(url + '/api/auth/get-session');
    console.log('/get-session =>', r3.status);
    console.log(await r3.text());
  }catch(e){ console.error('get-session error', e); }
})();