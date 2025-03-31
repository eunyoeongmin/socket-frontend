export async function POST() {
  const res = await fetch('http://localhost:7870/rooms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  
  return res.json();
}