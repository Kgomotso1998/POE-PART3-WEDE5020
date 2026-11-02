/* ==========================================================================
   NTHATI'S CRUST BAKERY - PART 3 JAVASCRIPT 
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    initMenuFilterAndSearch();
    initImageLightbox();
    initEnquiryFormValidation();
    initContactFormValidation();
});

/* ==========================================================================
   1. DYNAMIC CONTENT & INTERACTIVE SEARCH / FILTER 
   ========================================================================== */
function initMenuFilterAndSearch() {
    const searchInput = document.getElementById("menu-search");
    const categoryFilter = document.getElementById("category-filter");
    const menuItems = document.querySelectorAll(".menu-item, .menu-block");

    if (!searchInput && !categoryFilter) return;

    function filterMenu() {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
        const selectedCategory = categoryFilter ? categoryFilter.value.toLowerCase() : "all";

        menuItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            const matchesSearch = text.includes(query);
            const matchesCategory = selectedCategory === "all" || item.dataset.category === selectedCategory;

            if (matchesSearch && matchesCategory) {
                item.style.display = "";
            } else {
                item.style.display = "none";
            }
        });
    }

    if (searchInput) searchInput.addEventListener("input", filterMenu);
    if (categoryFilter) categoryFilter.addEventListener("change", filterMenu);
}

/* ==========================================================================
   2. INTERACTIVE LIGHTBOX GALLERY FOR IMAGES 
   ========================================================================== */
function initImageLightbox() {
    // Inject Lightbox Modal markup dynamically
    const modalHTML = `
        <div id="lightbox-modal" class="lightbox-modal" style="display:none;">
            <span class="lightbox-close">&times;</span>
            <img class="lightbox-content" id="lightbox-img" alt="Enlarged View">
            <div id="lightbox-caption"></div>
        </div>
    `;
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    const modal = document.getElementById("lightbox-modal");
    const modalImg = document.getElementById("lightbox-img");
    const captionText = document.getElementById("lightbox-caption");
    const closeBtn = document.querySelector(".lightbox-close");

    // Attach click handlers to all content images
    const images = document.querySelectorAll(".menu-image, .featured-image, .header-logo, .page-image");
    images.forEach(img => {
        img.style.cursor = "pointer";
        img.addEventListener("click", () => {
            modal.style.display = "block";
            modalImg.src = img.src;
            captionText.textContent = img.alt || "Nthati's Crust Bakery";
        });
    });

    // Close logic
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
        });
    }

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
}

/* ==========================================================================
   3. ENQUIRY FORM VALIDATION
   ========================================================================== */
function initEnquiryFormValidation() {
    const enquiryForm = document.querySelector("form[action='#']") || document.querySelector("form");
    if (!enquiryForm || !document.getElementById("enquiry-type")) return;

    // Create feedback message banner container
    const feedbackDiv = document.createElement("div");
    feedbackDiv.id = "form-response";
    feedbackDiv.style.marginTop = "15px";
    feedbackDiv.style.fontWeight = "bold";
    enquiryForm.appendChild(feedbackDiv);

    enquiryForm.addEventListener("submit", function (e) {
        e.preventDefault(); // Prevent default page refresh

        const fullName = document.getElementById("fullname").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const enquiryType = document.getElementById("enquiry-type").value;
        const pickupDate = document.getElementById("pickupdate").value;
        const details = document.getElementById("details").value.trim();

        // 1. Validation Logic
        if (fullName.length < 3) {
            showFeedback("Please enter a valid full name (minimum 3 characters).", "error");
            return;
        }

        const phoneRegex = /^[0-9+\s-]{10,15}$/;
        if (!phoneRegex.test(phone)) {
            showFeedback("Please enter a valid phone number (10–15 digits).", "error");
            return;
        }

        if (pickupDate) {
            const selectedDate = new Date(pickupDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selectedDate < today) {
                showFeedback("Pickup date cannot be in the past.", "error");
                return;
            }
        }

        if (details.length < 10) {
            showFeedback("Please provide at least 10 characters in your enquiry details.", "error");
            return;
        }

        // 2. Simulated AJAX Form Submission
        showFeedback("Processing your enquiry...", "info");

        setTimeout(() => {
            let estimatedCost = "Quote will be sent via email.";
            if (enquiryType === "custom-cake") estimatedCost = "Estimated starting price: R350.00";
            else if (enquiryType === "catering") estimatedCost = "Estimated starting price: R1,200.00 (depending on headcount)";
            else if (enquiryType === "wholesale") estimatedCost = "Wholesale catalog & pricing tier sent to " + email;

            showFeedback(
                `Thank you, ${fullName}! Your enquiry (${enquiryType}) has been received. ${estimatedCost}`,
                "success"
            );
            enquiryForm.reset();
        }, 1200);
    });

    function showFeedback(msg, type) {
        feedbackDiv.textContent = msg;
        if (type === "error") feedbackDiv.style.color = "#d9534f";
        else if (type === "success") feedbackDiv.style.color = "#2e7d32";
        else feedbackDiv.style.color = "#d96b27";
    }
}

/* ==========================================================================
   4. CONTACT FORM VALIDATION & MAILTO PREPARATION 
   ========================================================================== */
function initContactFormValidation() {
    const contactForm = document.getElementById("contact-form");
    if (!contactForm) return;

    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("contact-name").value.trim();
        const email = document.getElementById("contact-email").value.trim();
        const message = document.getElementById("contact-message").value.trim();

        if (!name || !email || !message) {
            alert("Please fill out all required fields.");
            return;
        }

        // Construct email payload as per rubric requirement
        const mailtoRecipient = "info@nthatiscrust.co.za";
        const subject = encodeURIComponent(`General Contact Form: ${name}`);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);

        window.location.href = `mailto:${mailtoRecipient}?subject=${subject}&body=${body}`;
    });
}