import emailjs from "@emailjs/browser";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("feedbackForm");
  const status = document.getElementById("feedbackStatus");

  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    status.textContent = "Mengirim...";
    status.classList.remove("text-green-400", "text-red-400");
    status.classList.add("text-gray-400");

    emailjs
      .sendForm(
        "service_4vrws49",   // SERVICE ID
        "template_j7kzkh5",  // TEMPLATE ID
        this,
        "JYhlTDDIMyePEPshR"  // PUBLIC KEY
      )

      //MESSAGE STATUS
      .then(
        () => {
          status.textContent = "Status : Success ,Feedback berhasil dikirim!";
          status.classList.remove("text-gray-400");
          status.classList.add("text-green-400");
          form.reset();
        },
        (error) => {
          console.error("EmailJS Error:", error);
          status.textContent = "Status : Error, Gagal mengirim. Coba lagi.";
          status.classList.remove("text-gray-400");
          status.classList.add("text-red-400");
        }
      );
  });
});
