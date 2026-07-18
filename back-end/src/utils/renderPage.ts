export function renderPage(
  title: string,
  message: string,
  downloadUrl?: string,
) {
  const isSuccess = Boolean(downloadUrl);

  return `
<!DOCTYPE html>
<html>
<head>
<title>${title}</title>
<style>
body{
font-family:Arial,sans-serif;
background:#f3f4f6;
display:flex;
justify-content:center;
align-items:center;
height:100vh;
}
.card{
background:white;
padding:40px;
border-radius:16px;
text-align:center;
box-shadow:0 10px 30px #0002;
}
.icon{
font-size:40px;
color:${isSuccess ? "green" : "red"};
}
</style>
</head>

<body>
<div class="card">
<div class="icon">
${isSuccess ? "✓" : "!"}
</div>

<h1>${title}</h1>
<p>${message}</p>

</div>
</body>
</html>
`;
}
