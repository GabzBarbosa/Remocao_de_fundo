async function processarImagem() {
  const fileInput = document.getElementById('upload');
  const bgColor = document.getElementById('bgColor').value;
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const downloadLink = document.getElementById('downloadLink');

  if (!fileInput.files[0]) {
    alert('Selecione uma imagem.');
    return;
  }

  const formData = new FormData();
  formData.append('image_file', fileInput.files[0]);
  formData.append('size', 'auto');

  const response = await fetch('https://api.remove.bg/v1.0/removebg', {
    method: 'POST',
    headers: {
      'X-Api-Key': 'gbm5KA6XCt9HNjSycLQgJ5Kb' // Chave de API do Remove.bg
    },
    body: formData
  });

  if (response.status != 200) {
    alert('Erro ao remover fundo.');
    return;
  }

  const blob = await response.blob();
  const img = new Image();
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;

    // Aplica o fundo colorido
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    canvas.style.display = 'block';
    canvas.toBlob(function(blob) {
      const url = URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.style.display = 'inline';
    }, 'image/jpeg');
  };
  img.src = URL.createObjectURL(blob);
}