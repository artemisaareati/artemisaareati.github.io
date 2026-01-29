(() => {
  // Año en footer
  document.getElementById("year").textContent = new Date().getFullYear();

  // Animaciones al hacer scroll
  const targets = document.querySelectorAll(".animate-on-scroll");
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add("is-visible");
    });
  }, { threshold: 0.12 });
  targets.forEach(t => io.observe(t));

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
        if (res.isConfirmed) abrirWhatsapp(`Hola, quiero consultar por el curso: ${curso}.`);
      });
    });
  });

  // WhatsApp flotante
  const btnWhatsapp = document.getElementById("btnWhatsapp");
  btnWhatsapp?.addEventListener("click", (e) => {
    e.preventDefault();
    abrirWhatsapp("Hola, me gustaría recibir información sobre los cursos del Instituto Artemisa.");
  });

  // CTA Inscripción: WhatsApp con mensaje prearmado
  const btnInscribirme = document.getElementById("btnInscribirme");
  btnInscribirme?.addEventListener("click", () => {
    abrirWhatsapp("Hola, quiero iniciar la inscripción. ¿Me indican requisitos, cupos y fechas de inicio?");
  });

  // FORMULARIO: Envío real con Formspree vía AJAX + SweetAlert solo si OK
  const form = document.getElementById("contactForm");
  const btnEnviar = document.getElementById("btnEnviarContacto");

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre")?.value?.trim();
    const email = document.getElementById("email")?.value?.trim();
    const mensaje = document.getElementById("mensaje")?.value?.trim();

    if (!nombre || !email || !mensaje) {
      Swal.fire({ icon: "warning", title: "Faltan datos", text: "Completá todos los campos." });
      return;
    }

    // reCAPTCHA v2: verificar que esté resuelto
    const recaptchaToken = (window.grecaptcha && typeof window.grecaptcha.getResponse === "function")
      ? window.grecaptcha.getResponse()
      : "";

    if (!recaptchaToken) {
      Swal.fire({
        icon: "warning",
        title: "Verificación requerida",
        text: "Por favor, completá el reCAPTCHA para poder enviar el mensaje."
      });
      return;
    }

    // Estado enviando
    if (btnEnviar) {
      btnEnviar.classList.add("btn-loading");
      btnEnviar.innerHTML = `<i class="fa-solid fa-spinner fa-spin me-2"></i>Enviando...`;
    }

    try {
      // Enviar a Formspree como FormData (Accept: application/json -> respuesta JSON)
      const formData = new FormData(form);

      const resp = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: { "Accept": "application/json" }
      });

      if (resp.ok) {
        // SOLO si OK -> SweetAlert success
        await Swal.fire({
          icon: "success",
          title: "¡Mensaje enviado!",
          text: "Gracias. Te contactaremos a la brevedad.",
          confirmButtonText: "OK"
        });

        form.reset();

        // Reset del reCAPTCHA
        if (window.grecaptcha && typeof window.grecaptcha.reset === "function") {
          window.grecaptcha.reset();
        }
        return;
      }

      // Si no OK, intentar leer detalle
      let detail = "No se pudo enviar el mensaje. Probá nuevamente en unos minutos.";
      try {
        const data = await resp.json();
        if (data?.errors?.length) {
          detail = data.errors.map(x => x.message).join(" ");
        }
      } catch (_) { /* ignore */ }

      Swal.fire({ icon: "error", title: "Error al enviar", text: detail });

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "No se pudo conectar para enviar el formulario. Verificá tu conexión e intentá de nuevo."
      });
    } finally {
      // Restaurar botón
      if (btnEnviar) {
        btnEnviar.classList.remove("btn-loading");
        btnEnviar.innerHTML = `<i class="fa-solid fa-paper-plane me-2"></i>Enviar`;
      }
    }
  });

  // --- Helpers ---
  function abrirWhatsapp(texto) {
    const phone = "59892099230";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(texto)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  // Botón "Volver al inicio": mostrar/ocultar según scroll
  const btnBackToTop = document.getElementById("btnBackToTop");
  if (btnBackToTop) {
    const toggleBackToTop = () => {
      if (window.scrollY > 300) btnBackToTop.classList.add("visible");
      else btnBackToTop.classList.remove("visible");
    };

    window.addEventListener("scroll", toggleBackToTop, { passive: true });
    toggleBackToTop(); // estado inicial
  }
})();
