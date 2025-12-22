document.addEventListener("DOMContentLoaded", () => {

  const params = new URLSearchParams(window.location.search);
  const propertyId = params.get("id"); // ex: prop-66

  fetch("assets/data/GREL New.json")
    .then(response => response.json())
    .then(data => {

      // ✅ Correct array
      const properties = data.Property;

      if (!Array.isArray(properties)) {
        console.error("Property array not found in JSON");
        return;
      }

      // ✅ Find property by Id
      const property = properties.find(p => p.Id === propertyId);

      if (!property) {
        console.error("Property not found for ID:", propertyId);
        return;
      }

      // ===== BASIC DETAILS =====
      document.getElementById("property-title").textContent = property.Title;
      document.getElementById("property-description").textContent = property.Description;
      document.getElementById("property-name").textContent = property.PropertyName;

      // ===== IMAGE =====
      if (property.ImageUrl) {
        document.getElementById("property-image").src =
          "assets/images/" + property.ImageUrl;
      }

      // ===== OVERVIEW DETAILS =====
      document.getElementById("property-bedrooms").textContent = property.BedRoom;
      document.getElementById("property-bathrooms").textContent = property.Toilet;
      document.getElementById("property-balcony").textContent = property.Balcony;

      document.getElementById("property-sba").textContent =
        property.SBA ? property.SBA + " Sq.ft" : "-";

      document.getElementById("property-carpet").textContent =
        property.CarpetArea ? property.CarpetArea + " Sq.ft" : "-";

      document.getElementById("property-furnishing").textContent =
        property.FurnishingStatus || "-";

      document.getElementById("property-facing").textContent =
        property.Facing || "-";

      document.getElementById("property-floor").textContent =
        property.Floor + " / " + property.TotalFloor;

      document.getElementById("property-parking").textContent =
        property.NumberOfParking || "-";

      document.getElementById("property-year").textContent =
        property.YearBuilt || "-";

    })
    .catch(error => {
      console.error("Error loading JSON:", error);
    });
});
