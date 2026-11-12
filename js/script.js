/* =========================================
   1. WEDDING CONFIGURATION
========================================= */

const CONFIG = {

    // Wedding date and time
    // Format: YYYY-MM-DDTHH:MM:SS+02:00

    weddingDate: "2027-05-08T15:00:00+02:00",

    // WhatsApp number with country code.
    // Mozambique: 258XXXXXXXXX
    // No + sign or spaces.

    whatsappNumber: "258874051610"

};


/* =========================================
   2. COUNTDOWN TIMER
========================================= */

const countdownTarget = new Date(CONFIG.weddingDate).getTime();

function updateCountdown() {

    const now = Date.now();
    const distance = countdownTarget - now;

    const msg = document.getElementById("countMessage");

    if (!Number.isFinite(countdownTarget)) {

        msg.textContent = "A data do evento ainda não foi configurada.";
        return;

    }

    if (distance <= 0) {

        ["days", "hours", "minutes", "seconds"].forEach(id => {

            document.getElementById(id).textContent = "00";

        });

        msg.textContent = "Chegou o grande dia. Que seja inesquecível!";

        return;

    }

    const values = {

        days: Math.floor(distance / 86400000),

        hours: Math.floor(distance % 86400000 / 3600000),

        minutes: Math.floor(distance % 3600000 / 60000),

        seconds: Math.floor(distance % 60000 / 1000)

    };

    Object.entries(values).forEach(([id, value]) => {

        document.getElementById(id).textContent =
            id === "days"
                ? String(value).padStart(3, "0")
                : String(value).padStart(2, "0");

    });

}

// Start countdown
updateCountdown();

// Update every second
setInterval(updateCountdown, 1000);


/* =========================================
   RSVP FORM & WHATSAPP INTEGRATION
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const rsvpForm = document.getElementById("rsvpForm");

    if (!rsvpForm) {
        console.error('Form with id="rsvpForm" not found.');
        return;
    }

    rsvpForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const whatsappNumber = "258874051610"; // digits only, no +

        const getValue = (id) => {
            const el = document.getElementById(id);
            if (!el) {
                console.error(`Element with id="${id}" not found.`);
                return "";
            }
            return el.value.trim();
        };

        const guestName  = getValue("guestName");
        const guestCount = getValue("guestCount");
        const attendance = getValue("attendance");
        const contact    = getValue("contact");
        const message    = getValue("message");
        const formStatus = document.getElementById("formStatus");

        const whatsappMessage =
`CONFIRMAÇÃO DE PRESENÇA — CASAMENTO

Nome: ${guestName}
Nº de pessoas: ${guestCount || "Não indicado"}
Resposta: ${attendance}
Contacto: ${contact || "Não indicado"}
Mensagem: ${message || "Sem mensagem adicional"}`;

        const whatsappURL =
            "https://wa.me/" + whatsappNumber +
            "?text=" + encodeURIComponent(whatsappMessage);

        window.open(whatsappURL, "_blank");

        if (formStatus) {
            formStatus.textContent = "A abrir o WhatsApp para enviar a confirmação...";
        }
    });
});


/* =========================================
   4. COPY BANK DETAILS
========================================= */

document.querySelectorAll("[data-copy]").forEach(button => {

    button.addEventListener("click", async () => {

        const value = button.getAttribute("data-copy");

        try {

            await navigator.clipboard.writeText(value);

            button.textContent = "Copiado";

            setTimeout(() => {

                button.textContent = "Copiar";

            }, 1600);

        } catch (error) {

            button.textContent = "Copie manualmente";

        }

    });

});


/* =========================================
   5. SCROLL ANIMATIONS
========================================= */

const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("visible");

            observer.unobserve(entry.target);

        }

    });

}, {

    threshold: 0.08

});

document.querySelectorAll(".reveal").forEach(element => {

    observer.observe(element);

});



/* =========================================
   WEDDING INVITATION OPENING & MUSIC
========================================= */

const invitationIntro = document.getElementById("invitationIntro");
const openInvitation = document.getElementById("openInvitation");

const weddingMusic = document.getElementById("weddingMusic");
const musicToggle = document.getElementById("musicToggle");
const musicIcon = document.getElementById("musicIcon");


/* =========================================
   UPDATE MUSIC BUTTON
========================================= */

function updateMusicButton() {

    if (!weddingMusic || !musicToggle || !musicIcon) return;

    if (weddingMusic.paused) {

        musicToggle.classList.remove("playing");
        musicIcon.textContent = "▶";
        musicToggle.setAttribute("aria-label", "Play music");

    } else {

        musicToggle.classList.add("playing");
        musicIcon.textContent = "Ⅱ";
        musicToggle.setAttribute("aria-label", "Pause music");

    }
}


/* =========================================
   OPEN INVITATION & START MUSIC
========================================= */

if (openInvitation && invitationIntro) {

    openInvitation.addEventListener("click", async () => {

        // Animate the envelope
        openInvitation.classList.add("open");

        // Open the invitation
        document.body.classList.add("invitation-open");
        invitationIntro.classList.add("closed");

        // Start music immediately after the click
        if (weddingMusic) {

            weddingMusic.volume = 0.5;

            try {

                await weddingMusic.play();

            } catch (error) {

                console.error("Music playback failed:", error);

            }

        }

        // Update music control
        updateMusicButton();

        // Return to the top of the invitation
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}


/* =========================================
   FLOATING MUSIC PLAY / PAUSE BUTTON
========================================= */

if (musicToggle && weddingMusic) {

    musicToggle.addEventListener("click", async () => {

        if (weddingMusic.paused) {

            try {

                await weddingMusic.play();

            } catch (error) {

                console.error("Music playback failed:", error);

            }

        } else {

            weddingMusic.pause();

        }

        updateMusicButton();

    });

    // Keep button synchronised with audio
    weddingMusic.addEventListener("play", updateMusicButton);
    weddingMusic.addEventListener("pause", updateMusicButton);
    weddingMusic.addEventListener("ended", updateMusicButton);

    // Report file-loading problems
    weddingMusic.addEventListener("error", () => {

        console.error(
            "Unable to load wedding music. Check the MP3 filename and file path."
        );

    });

}

// Initial button state
updateMusicButton();
