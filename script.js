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
const authUser = document.getElementById("authUser");
const authUsername = document.getElementById("authUsername");
const logoutBtn = document.getElementById("logoutBtn");

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
    const hasValidUser = currentUser && currentUser !== "Guest";

    if (hasValidUser && authUser && authUsername) {
        authUsername.textContent = currentUser;
        authUser.hidden = false;
        if (openAuth) {
            openAuth.hidden = true;
        }
    } else {
        if (currentUser === "Guest") {
            clearSessionUser();
        }
        if (authUser) {
            authUser.hidden = true;
        }
        if (openAuth) {
            openAuth.hidden = false;
        }
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

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        clearSessionUser();
        updateAuthUI();
    });
}

updateAuthUI();
