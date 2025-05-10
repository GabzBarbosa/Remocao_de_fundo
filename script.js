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

  const file = fileInput.files[0];
  if (!file.type.startsWith('image/')) {
    alert('Por favor, envie um arquivo de imagem válido.');
    return;
  }

  const formData = new FormData();
  formData.append('image_file', file);
  formData.append('size', 'auto');

  try {
    // Exibe indicador de carregamento
    const loadingIndicator = document.createElement('p');
    loadingIndicator.id = 'loading';
    loadingIndicator.textContent = 'Processando imagem...';
    document.body.appendChild(loadingIndicator);

    // Realiza a requisição
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': 'SUA_CHAVE_AQUI' // Substitua por uma solução segura
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Erro ao remover fundo: ${response.statusText}`);
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
      canvas.toBlob(function (blob) {
        const url = URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.style.display = 'inline';
        URL.revokeObjectURL(url); // Libera memória
      }, 'image/jpeg');
    };
    img.src = URL.createObjectURL(blob);

  } catch (error) {
    console.error('Erro ao processar imagem:', error);
    alert('Ocorreu um erro ao processar a imagem. Tente novamente.');
  } finally {
    // Remove indicador de carregamento
    const loadingIndicator = document.getElementById('loading');
    if (loadingIndicator) {
      loadingIndicator.remove();
    }
  }
}