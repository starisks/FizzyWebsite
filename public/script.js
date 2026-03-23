async function login() {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      email: email.value,
      password: password.value
    })
  });

  const text = await res.text(); // 👈 read raw response first

  console.log("SERVER RESPONSE:", text); // 👈 DEBUG

  try {
    const data = JSON.parse(text);

    if (!res.ok) {
      alert(data.error || "Login failed");
      return;
    }

    localStorage.token = data.token;
    alert("Logged in!");
  } catch (err) {
    console.error("NOT JSON RESPONSE:", text);
    alert("Server returned invalid response (not JSON)");
  }
}