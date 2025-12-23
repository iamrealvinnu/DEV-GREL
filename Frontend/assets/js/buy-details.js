document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const propertyId = params.get("id");
  const propertyType = params.get("type") || "sell"; 

  console.log("buy-details.js: Initializing. propertyId:", propertyId, "propertyType:", propertyType);

  let allProperties = [];
  let addresses = [];
  let listings = [];


  const fetchData = async () => {
    try {
      console.log("buy-details.js: Fetching GREL New.json...");
      const grelNewData = await fetch("./assets/data/GREL New.json").then(res => res.json());
      console.log("buy-details.js: GREL New.json fetched successfully.", grelNewData);

      addresses = grelNewData.Address;
      listings = grelNewData.PropertyListing.map(l => ({...l, ListingType: "Sell"}));
      
      console.log("buy-details.js: Processing properties from GREL New.json");
      allProperties = grelNewData.Property.map(prop => {
          const listing = listings.find(l => String(l.PropertyId) === String(prop.Id));
          const addressDetail = addresses.find(addr => String(addr.Id) === String(prop.AddressId));
          // Explicitly ensure prop.Id is retained by placing it after spreading other objects
          return {...prop, ...listing, ...addressDetail, Id: prop.Id, ListingType: "Sell"};
      });
      console.log("buy-details.js: allProperties created. Total:", allProperties.length, "Sample:", allProperties[0]);


      const property = allProperties.find(p => String(p.Id) === propertyId);
      console.log("buy-details.js: Found property:", property);

      if (!property) {
        console.error("buy-details.js: Property not found for ID:", propertyId, "and type:", propertyType);
        document.getElementById("property-title").textContent = "Property Not Found";
        return;
      }

      // ===== BASIC DETAILS =====
      document.getElementById("property-title").textContent = property.Title || property.PropertyName;
      document.getElementById("property-description").textContent = property.Description || "No description available.";
      console.log("buy-details.js: Populated title and description.");

      // ===== IMAGE =====
      if (property.ImageUrl) {
        document.getElementById("property-image").src = `assets/images/${property.ImageUrl}`; // FIX: Removed duplicated ApartmentImages/
        console.log("buy-details.js: Image URL set:", document.getElementById("property-image").src);
      } else {
        document.getElementById("property-image").src = 'https://via.placeholder.com/800x500.png?text=Image+Not+Available';
        console.log("buy-details.js: Placeholder image set.");
      }

      // ===== PRICE / RENT DISPLAY =====
      const propertyPriceDisplay = document.getElementById("property-price-display");
      const propertyDepositDisplay = document.getElementById("property-deposit-display");

      propertyPriceDisplay.innerHTML = `<strong>Price:</strong> ₹${property.Price ? (property.Price / 100000).toFixed(1) + " L" : "Price on request"}`;
      propertyDepositDisplay.style.display = 'none';
      console.log("buy-details.js: Populated price display.");


      // ===== OVERVIEW DETAILS (Card-based) =====
      document.getElementById("property-bedrooms").textContent = property.BedRoom ? `${property.BedRoom} BHK` : "-";
      document.getElementById("property-bathrooms").textContent = property.Toilet ? `${property.Toilet} Baths` : "-";
      document.getElementById("property-balcony").textContent = property.Balcony || "-";
      document.getElementById("property-sba").textContent = property.SBA ? `${property.SBA} Sq.ft` : "-";
      document.getElementById("property-carpet").textContent = property.CarpetArea ? `${property.CarpetArea} Sq.ft` : "-";
      document.getElementById("property-furnishing").textContent = property.FurnishingStatus || "-";
      document.getElementById("property-facing").textContent = property.Facing || "-";
      document.getElementById("property-floor").textContent = (property.Floor && property.TotalFloor) ? `${property.Floor} / ${property.TotalFloor}` : "-";
      document.getElementById("property-parking").textContent = property.NumberOfParking || "-";
      document.getElementById("property-year").textContent = property.YearBuilt || "-";
      console.log("buy-details.js: Populated overview details.");

    } catch (error) {
      console.error("buy-details.js: Error loading property details in fetchData:", error);
      document.getElementById("property-title").textContent = "Error Loading Details";
    }
  };

  fetchData();


  // ===== INQUIRY FORM SUBMISSION =====
  const inquiryForm = document.getElementById("inquiryForm");
  const formMessage = document.getElementById("formMessage");

  if (inquiryForm) {
    inquiryForm.addEventListener("submit", async function(e) {
      e.preventDefault();

      formMessage.style.display = 'none'; // Hide previous messages
      formMessage.className = 'mt-3 text-center'; // Reset classes

      const inquiryName = document.getElementById("inquiryName").value;
      const inquiryEmail = document.getElementById("inquiryEmail").value;
      const inquiryPhone = document.getElementById("inquiryPhone").value;
      const inquiryMessage = document.getElementById("inquiryMessage").value;
      const interested = document.getElementById("interestedCheckbox").checked;
      const currentPropertyTitle = document.getElementById("property-title").textContent;
      const currentPropertyId = propertyId; // Get from URL param

      // --- USER CONFIGURATION REQUIRED ---
      // IMPORTANT: To make this form work with your Google Form:
      // 1. Create a Google Form (e.g., for property inquiries).
      // 2. Open your Google Form, click 'Send', then go to the '< > Embed' tab, copy the 'action' URL.
      //    It will look something like: https://docs.google.com/forms/d/e/2PACX-1vR.../formResponse
      //    REPLACE 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse' below with YOUR_ACTION_URL.
      // 3. For each field in your Google Form (Name, Email, Phone, Message, Property Title, Property ID, Interested),
      //    find its 'name' attribute. You can do this by:
      //    - Right-clicking on the input field in your browser (after opening the live form) and selecting 'Inspect'.
      //    - Or, creating a pre-filled link in Google Forms and observing the 'entry.XXXXXXXXX' parameters.
      //    REPLACE 'entry.YOUR_ENTRY_ID_FOR_...' below with YOUR_FIELD_ENTRY_ID.
      // --- END USER CONFIGURATION ---

      // NOTE: These are GENERIC PLACEHOLDER VALUES. YOU MUST REPLACE THEM WITH YOUR OWN!
      const GOOGLE_FORM_ACTION_URL = "https://docs.google.com/forms/d/e/1FAIpQLSe8jVbpxZx8jY8gRfvLpnke5qw8KEklsFqrDYkNojPgXSA6Nw/formResponse"; // REPLACED WITH USER'S FORM ID!
      const ENTRY_ID_NAME = "entry.1834779991";
      const ENTRY_ID_EMAIL = "entry.1941615540";
      const ENTRY_ID_PHONE = "entry.640859683";
      const ENTRY_ID_MESSAGE = "entry.1965151538";
      const ENTRY_ID_PROPERTY_TITLE = "entry.826372443";
      const ENTRY_ID_PROPERTY_ID = "entry.146055337";
      const ENTRY_ID_INTERESTED = "entry.1599713145";

      // Remove the check for GOOGLE_FORM_ACTION_URL as it now has a placeholder value
      // The user is expected to replace these placeholders.

      const formData = new FormData();
      formData.append(ENTRY_ID_NAME, inquiryName);
      formData.append(ENTRY_ID_EMAIL, inquiryEmail);
      formData.append(ENTRY_ID_PHONE, inquiryPhone);
      formData.append(ENTRY_ID_MESSAGE, inquiryMessage);
      formData.append(ENTRY_ID_PROPERTY_TITLE, currentPropertyTitle);
      formData.append(ENTRY_ID_PROPERTY_ID, currentPropertyId);
      formData.append(ENTRY_ID_INTERESTED, interested ? "Yes" : "No");



      try {
        const response = await fetch(GOOGLE_FORM_ACTION_URL, {
          method: "POST",
          body: formData,
          mode: "no-cors",
        });

        formMessage.textContent = "Your inquiry has been sent successfully!";
        formMessage.classList.add('alert', 'alert-success');
        inquiryForm.reset();
      } catch (error) {
        console.error("buy-details.js: Error submitting inquiry:", error);
        formMessage.textContent = "There was an error sending your inquiry. Please try again.";
        formMessage.classList.add('alert', 'alert-danger');
      } finally {
        formMessage.style.display = 'block';
      }
    });
  }
});