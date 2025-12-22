document.addEventListener("DOMContentLoaded", () => {

  const form = document.querySelector("form");

    // Get property id from URL if exists
  const params = new URLSearchParams(window.location.search);
  const propertyId = params.get("id");

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // stop page reload

    // Get values
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phoneNumber").value.trim();
    const email = document.getElementById("email").value.trim();

    // Basic validation
    if (!name || !phone || !email) {
      alert("Please fill all fields");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      alert("Enter a valid 10-digit phone number");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      alert("Enter a valid email address");
      return;
    }

    // Data object
    const contactData = {
      name: name,
      phoneNumber: phone,
      email: email,
      createdAt: new Date().toISOString()
    };

    console.log("Contact Data:", contactData);

    // ✅ SUCCESS MESSAGE
    alert("Thank you! Our team will contact you soon.");

    // Redirect with property id
    if (propertyId) {
      window.location.href = `buy-details.html?id=${propertyId}`;
    } else {
      window.location.href = "buy-details.html";
    }
  });

    // Reset form
    // form.reset();

    /* =============================
       OPTIONAL: API CALL (Uncomment when backend ready)
    ============================= */

    /*
    fetch("https://your-api-url.com/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(contactData)
    })
    .then(res => res.json())
    .then(data => {
      alert("Form submitted successfully!");
      form.reset();
    })
    .catch(err => {
      console.error(err);
      alert("Something went wrong. Please try again.");
    });
    */

  });

