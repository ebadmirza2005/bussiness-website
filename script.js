const loader = document.getElementById("pageLoader");
let aosInitialized = false;
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("primaryNav");
const navLinks = document.querySelectorAll(".nav-menu a");
const year = document.getElementById("year");
const authModal = document.getElementById("authModal");
const openAuth = document.getElementById("openAuth");
const openAuthMenu = document.getElementById("openAuthMenu");
const closeAuth = document.getElementById("closeAuth");
const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const authMessage = document.getElementById("authMessage");

const USERS_KEY = "fastprotech_users";
const SESSION_KEY = "fastprotech_current_user";

const initAos = () => {
    if (aosInitialized || !window.AOS) {
        return;
    }

    window.AOS.init({
        duration: 1000,
        once: true,
    });
    aosInitialized = true;
};

if (loader) {
    document.body.classList.add("is-loading");

    const hideLoader = () => {
        loader.classList.add("is-hidden");
        document.body.classList.remove("is-loading");
        initAos();
        window.AOS?.refreshHard();
    };

    window.addEventListener("load", () => {
        window.setTimeout(hideLoader, 1000);
    });

    // Fallback in case load event is delayed by network.
    window.setTimeout(hideLoader, 5000);
} else {
    initAos();
}

if (year) {
    year.textContent = new Date().getFullYear();
}

if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("is-open");
        menuToggle.classList.toggle("is-active", isOpen);
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            nav.classList.remove("is-open");
            menuToggle.classList.remove("is-active");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });
}

const getUsers = () => {
    try {
        const raw = localStorage.getItem(USERS_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

const saveUsers = (users) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const setSessionUser = (name) => {
    localStorage.setItem(SESSION_KEY, name);
};

const clearSessionUser = () => {
    localStorage.removeItem(SESSION_KEY);
};

const setMessage = (message, isError = false) => {
    if (!authMessage) {
        return;
    }
    authMessage.textContent = message;
    authMessage.style.color = isError ? "#ffc7c7" : "#d7ffdf";
};

const updateAuthUI = () => {
    const currentUser = localStorage.getItem(SESSION_KEY);
    const hasValidUser = Boolean(currentUser && currentUser !== "Guest");

    if (currentUser === "Guest") {
        clearSessionUser();
    }

    if (openAuth) {
        openAuth.hidden = hasValidUser;
    }
};

const switchTab = (target) => {
    const showLogin = target === "login";

    if (loginTab) {
        loginTab.classList.toggle("is-active", showLogin);
        loginTab.setAttribute("aria-selected", String(showLogin));
    }

    if (signupTab) {
        signupTab.classList.toggle("is-active", !showLogin);
        signupTab.setAttribute("aria-selected", String(!showLogin));
    }

    if (loginForm) {
        loginForm.classList.toggle("is-active", showLogin);
    }

    if (signupForm) {
        signupForm.classList.toggle("is-active", !showLogin);
    }

    setMessage("");
};

const openModal = (targetTab = "login") => {
    if (!authModal) {
        return;
    }

    authModal.classList.add("is-open");
    authModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-loading");
    switchTab(targetTab);
};

const closeModal = () => {
    if (!authModal) {
        return;
    }

    authModal.classList.remove("is-open");
    authModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-loading");
    setMessage("");
};

if (openAuth) {
    openAuth.addEventListener("click", () => openModal("login"));
}

if (openAuthMenu) {
    openAuthMenu.addEventListener("click", () => {
        openModal("login");
        nav?.classList.remove("is-open");
        menuToggle?.classList.remove("is-active");
        menuToggle?.setAttribute("aria-expanded", "false");
    });
}

if (closeAuth) {
    closeAuth.addEventListener("click", closeModal);
}

if (authModal) {
    authModal.addEventListener("click", (event) => {
        if (event.target === authModal) {
            closeModal();
        }
    });
}

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && authModal?.classList.contains("is-open")) {
        closeModal();
    }
});

if (loginTab) {
    loginTab.addEventListener("click", () => switchTab("login"));
}

if (signupTab) {
    signupTab.addEventListener("click", () => switchTab("signup"));
}

if (signupForm) {
    signupForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = document.getElementById("signupName")?.value.trim();
        const email = document.getElementById("signupEmail")?.value.trim().toLowerCase();
        const password = document.getElementById("signupPassword")?.value || "";

        if (!name || !email || password.length < 6) {
            setMessage("Please fill all fields with a valid password (min 6 chars).", true);
            return;
        }

        const users = getUsers();
        const exists = users.some((user) => user.email === email);

        if (exists) {
            setMessage("This email is already registered. Please login.", true);
            switchTab("login");
            return;
        }

        users.push({ name, email, password });
        saveUsers(users);
        setSessionUser(name);
        updateAuthUI();
        signupForm.reset();
        setMessage("Account created successfully. You are now logged in.");

        window.setTimeout(closeModal, 700);
    });
}

if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const email = document.getElementById("loginEmail")?.value.trim().toLowerCase();
        const password = document.getElementById("loginPassword")?.value || "";
        const users = getUsers();
        const account = users.find((user) => user.email === email && user.password === password);

        if (!account) {
            setMessage("Invalid email or password.", true);
            return;
        }

        setSessionUser(account.name);
        updateAuthUI();
        loginForm.reset();
        setMessage("Login successful. Welcome back.");
        window.setTimeout(closeModal, 650);
    });
}

updateAuthUI();

// Spider web animation for side panel canvas
const canvas = document.getElementById("web");

if (canvas) {
        const ctx = canvas.getContext("2d");
        const particles = [];
        const particleCount = 70;
        const linkDistance = 110;

        if (ctx) {
                const clampToCanvas = (value, max) => Math.min(Math.max(value, 0), max);

                const setCanvasSize = () => {
                        const ratio = window.devicePixelRatio || 1;
                        const rect = canvas.getBoundingClientRect();
                        const width = Math.max(Math.floor(rect.width), 1);
                        const height = Math.max(Math.floor(rect.height), 1);

                        canvas.width = Math.floor(width * ratio);
                        canvas.height = Math.floor(height * ratio);
                        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

                        particles.forEach((particle) => {
                                particle.x = clampToCanvas(particle.x, width);
                                particle.y = clampToCanvas(particle.y, height);
                        });
                };

                class Particle {
                        constructor() {
                                this.reset();
                        }

                        reset() {
                                this.x = Math.random() * canvas.clientWidth;
                                this.y = Math.random() * canvas.clientHeight;
                                this.vx = Math.random() * 0.8 - 0.4;
                                this.vy = Math.random() * 0.8 - 0.4;
                        }

                        move() {
                                const width = canvas.clientWidth;
                                const height = canvas.clientHeight;

                                this.x += this.vx;
                                this.y += this.vy;

                                if (this.x <= 0 || this.x >= width) {
                                        this.vx *= -1;
                                        this.x = clampToCanvas(this.x, width);
                                }

                                if (this.y <= 0 || this.y >= height) {
                                        this.vy *= -1;
                                        this.y = clampToCanvas(this.y, height);
                                }
                        }

                        draw() {
                                ctx.beginPath();
                                ctx.arc(this.x, this.y, 1.8, 0, Math.PI * 2);
                                ctx.fillStyle = "rgba(255, 240, 214, 0.95)";
                                ctx.fill();
                        }
                }

                for (let i = 0; i < particleCount; i += 1) {
                        particles.push(new Particle());
                }

                const drawConnections = () => {
                        for (let i = 0; i < particles.length; i += 1) {
                                for (let j = i + 1; j < particles.length; j += 1) {
                                        const dx = particles[i].x - particles[j].x;
                                        const dy = particles[i].y - particles[j].y;
                                        const distance = Math.sqrt(dx * dx + dy * dy);

                                        if (distance < linkDistance) {
                                                const alpha = 1 - distance / linkDistance;
                                                ctx.beginPath();
                                                ctx.moveTo(particles[i].x, particles[i].y);
                                                ctx.lineTo(particles[j].x, particles[j].y);
                                                ctx.strokeStyle = `rgba(164, 220, 255, ${0.42 * alpha})`;
                                                ctx.lineWidth = 0.9;
                                                ctx.stroke();
                                        }
                                }
                        }
                };

                const animate = () => {
                        ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

                        particles.forEach((particle) => {
                                particle.move();
                                particle.draw();
                        });

                        drawConnections();
                        requestAnimationFrame(animate);
                };

                setCanvasSize();
                animate();

                const resizeHandler = () => setCanvasSize();
                window.addEventListener("resize", resizeHandler);

                if (window.ResizeObserver) {
                        const observer = new ResizeObserver(() => setCanvasSize());
                        observer.observe(canvas);
                }
        }
}
