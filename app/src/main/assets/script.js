const cat = document.getElementById("cat");
const leftPaw = document.getElementById("leftPaw");
const rightPaw = document.getElementById("rightPaw");

let keyCount = 0;
let clickCount = 0;
let currentMode = "home";

function showScreen(name) {
    document.querySelectorAll(".screen").forEach(screen => {
        screen.classList.remove("active");
    });

    document.getElementById(name).classList.add("active");
    currentMode = name;

    document.getElementById("status").textContent =
        "Modo: " + name;
}

function selectMode(mode) {
    showScreen(mode);
    document.getElementById("status").textContent =
        mode === "emulator"
        ? "Esperando teclado y mouse..."
        : "Modo táctil activado";
}

function animatePaw(paw, className) {
    paw.classList.remove(className);
    void paw.offsetWidth;
    paw.classList.add(className);

    setTimeout(() => {
        paw.classList.remove(className);
    }, 200);
}

function leftTap() {
    animatePaw(leftPaw, "left-active");
}

function rightTap() {
    animatePaw(rightPaw, "right-active");
}

function updateStatus(text) {
    document.getElementById("status").textContent = text;
}

document.addEventListener("keydown", event => {

    if (currentMode !== "emulator") return;

    const key = event.key.toLowerCase();

    if ([
        "w", "a", "s", "d", " ",
        "arrowup", "arrowdown",
        "arrowleft", "arrowright"
    ].includes(key)) {

        if (event.repeat) return;

        keyCount++;
        document.getElementById("keyCount").textContent = keyCount;

        if (key === " ") {
            cat.classList.add("cat-jump");
            setTimeout(() => cat.classList.remove("cat-jump"), 350);
        } else {
            leftTap();
        }

        updateStatus("Tecla presionada: " + event.key);
    }
});

document.addEventListener("keyup", event => {
    if (currentMode === "emulator") {
        updateStatus("Esperando actividad...");
    }
});

document.addEventListener("mousedown", event => {

    if (currentMode !== "emulator") return;

    if (event.button === 0 || event.button === 2) {
        clickCount++;
        document.getElementById("clickCount").textContent = clickCount;
        rightTap();
        updateStatus("Mouse: clic");
    }
});

document.addEventListener("contextmenu", event => {
    event.preventDefault();
});

document.addEventListener("mousemove", event => {

    if (currentMode !== "emulator") return;

    const movement = Math.min(Math.abs(event.movementX), 20);

    if (movement > 1) {
        rightPaw.style.transform =
            `translateX(${Math.sign(event.movementX) * movement}px)`;
    }
});

document.addEventListener("mouseup", () => {
    rightPaw.style.transform = "";
});

function mobileAction(action) {

    switch(action) {

        case "W":
        case "A":
        case "S":
        case "D":
            leftTap();
            updateStatus("Joystick: " + action);
            break;

        case "FIRE":
            rightTap();
            clickCount++;
            document.getElementById("clickCount").textContent = clickCount;
            updateStatus("¡Disparando!");
            break;

        case "JUMP":
            cat.classList.add("cat-jump");
            setTimeout(() => cat.classList.remove("cat-jump"), 350);
            updateStatus("¡Saltando!");
            break;

        case "AIM":
            rightTap();
            updateStatus("Apuntando...");
            break;

        case "CROUCH":
            cat.style.transform = "scaleY(.75)";
            setTimeout(() => cat.style.transform = "", 400);
            updateStatus("Agachándose");
            break;

        case "RELOAD":
            leftTap();
            rightTap();
            updateStatus("Recargando...");
            break;
    }
}

function changeSkin(skin) {

    const colors = {
        white: "#ffffff",
        black: "#555555",
        orange: "#ffad55",
        pink: "#ffb6d9",
        blue: "#a6d9ff"
    };

    cat.style.setProperty("--fur", colors[skin]);

    showScreen("home");
    updateStatus("Skin seleccionada: " + skin);
}

function resizeCat(value) {
    cat.style.transform = `scale(${value / 100})`;
}

document.addEventListener("touchstart", () => {
    if (currentMode === "mobile") {
        updateStatus("Controles táctiles de prueba");
    }
}, {passive: true});
