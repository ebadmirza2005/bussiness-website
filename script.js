const loader = document.getElementById("pageLoader");
let aosInitialized = false;

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
