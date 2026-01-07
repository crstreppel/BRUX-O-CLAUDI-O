// ======================================================================
// 🧙‍♂️ usuarios.js • PBQE-C V2 (AJUSTE CADASTRO)
// ----------------------------------------------------------------------
// Ajuste: salvar usuarioId no sessionStorage após cadastro
// ======================================================================

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formCadastro");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const usuario = document.getElementById("usuario").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    if (!usuario || !email || !senha) {
      alert("Preencha todos os campos.");
      return;
    }

    try {
      const response = await fetch("/api/usuarios/cadastrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, email, senha })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.erro || "Erro ao cadastrar.");
        return;
      }

      // ===============================
      // PBQE-C • Estado da confirmação
      // ===============================
      sessionStorage.clear();
      sessionStorage.setItem("usuarioId", data.usuarioId);

      window.location.href = "/modules/confirmacao/confirmacao.html";

    } catch (err) {
      console.error("Erro no cadastro:", err);
      alert("Erro inesperado.");
    }
  });
});
