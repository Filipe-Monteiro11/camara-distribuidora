export function enviarImagem(req, res) {
  if (!req.file) {
    return res.status(400).json({
      error: "Selecione uma imagem."
    });
  }

  const url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

  res.status(201).json({
    url
  });
}