(() => {
  // Año en footer
  document.getElementById("year").textContent = new Date().getFullYear();

  // Animaciones al hacer scroll (sin librerías extra)
  const targets = document.querySelectorAll(".animate-on-scroll");
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add("is-visible");
    });
  }, { threshold: 0.12 });

  targets.forEach(t => io.observe(t));

  // Bootstrap tooltips (WhatsApp + ControlZeta)
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.forEach((el) => new bootstrap.Tooltip(el));

  // SweetAlert - Info cursos
  const btnInfo = document.getElementById("btnVerInfoCursos");
  btnInfo?.addEventListener("click", () => {
    Swal.fire({
      icon: "info",
      title: "Información de cursos",
      html: `
        <div style="text-align:left">
          <p><strong>Instituto Artemisa</strong> - Formación Técnico-Profesional</p>
          <p>Consultá por fechas, modalidad y requisitos.</p>
          <p class="mb-0"><strong>Contacto:</strong> info@artemisa.edu.uy | 092099230</p>
        </div>
      `,
      confirmButtonText: "Entendido"
    });
  });

  // Botones "Consultar por este curso"
  document.querySelectorAll(".btnCurso").forEach(btn => {
    btn.addEventListener("click", () => {
      const curso = btn.getAttribute("data-curso") || "un curso";
      Swal.fire({
        icon: "question",
        title: "Consulta rápida",
        text: `¿Querés consultar por "${curso}" por WhatsApp?`,
        showCancelButton: true,
        confirmButtonText: "Sí, abrir WhatsApp",
        cancelButtonText: "Ahora no"
      }).then(res => {
        if (res.isConfirmed) {
          abrirWhatsapp(`Hola, quiero consultar por el curso: ${curso}.`);
        }
      });
    });
  });

  // Formulario contacto (demo)
  const form = document.getElementById("contactForm");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const mensaje = document.getElementById("mensaje").value.trim();

    if (!nombre || !email || !mensaje) {
      Swal.fire({ icon: "warning", title: "Faltan datos", text: "Completá todos los campos." });
      return;
    }

    Swal.fire({
      icon: "success",
      title: "¡Mensaje registrado!",
      text: "Gracias. Te contactaremos a la brevedad.",
      confirmButtonText: "OK"
    });

    form.reset();
  });

  // WhatsApp flotante
  const btnWhatsapp = document.getElementById("btnWhatsapp");
  btnWhatsapp?.addEventListener("click", (e) => {
    e.preventDefault();
    abrirWhatsapp("Hola, me gustaría recibir información sobre los cursos del Instituto Artemisa.");
  });

  // Ocultar botones flotantes al bajar, mostrar al subir
  const floaties = document.querySelectorAll(".floaty");
  let lastY = window.scrollY;

  const onScroll = () => {
    const y = window.scrollY;
    const goingDown = y > lastY + 6;  // umbral para evitar “parpadeo”
    const goingUp   = y < lastY - 6;

    if (goingDown) floaties.forEach(el => el.classList.add("is-hidden"));
    if (goingUp)   floaties.forEach(el => el.classList.remove("is-hidden"));

    // Si estás arriba del todo, que se vean
    if (y < 80) floaties.forEach(el => el.classList.remove("is-hidden"));

    lastY = y;
  };

  window.addEventListener("scroll", onScroll, { passive: true });

  // --- Helpers ---
  function abrirWhatsapp(texto) {
    // formato internacional para Uruguay: 598 + número (sin 0)
    const phone = "59892099230";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(texto)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }
})();
