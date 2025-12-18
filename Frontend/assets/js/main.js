document.addEventListener("DOMContentLoaded", () => {

  /* ------------------------------
     Load Navbar Component
  --------------------------------*/
  fetch("../components/navbar.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("navbar").innerHTML = data;
    });

  /* ------------------------------
     Load Property JSON
  --------------------------------*/
  let addresses = [];
  let properties = [];

  fetch("./assets/data/GREL.json")
    .then(res => res.json())
    .then(data => {
      addresses = data.Address;
      properties = data.Property;

      populateLocationDropdown(addresses);
      renderProperties(properties, addresses);

      attachSearchHandler(); // 👈 important
    })
    .catch(err => console.error("JSON load error:", err));

  /* ------------------------------
     Populate Location Dropdown
  --------------------------------*/
  function populateLocationDropdown(addressList) {
    const dropdown = document.getElementById("locationDropdown");
    if (!dropdown) return;

    dropdown.innerHTML = `<option value="">Select Location</option>`;

    const uniqueLocations = [
      ...new Set(addressList.map(a => a.AddressLine1))
    ];

    uniqueLocations.forEach(loc => {
      const option = document.createElement("option");
      option.value = loc;
      option.textContent = loc;
      dropdown.appendChild(option);
    });
  }

  /* ------------------------------
     Attach Search Handler SAFELY
  --------------------------------*/
  function attachSearchHandler() {
    const searchBtn = document.getElementById("mainSearchButton");
    const dropdown = document.getElementById("locationDropdown");

    if (!searchBtn || !dropdown) return;

    searchBtn.addEventListener("click", () => {
      filterByLocation(dropdown.value);
    });

    // ✅ Optional: auto-search on change
    dropdown.addEventListener("change", () => {
      filterByLocation(dropdown.value);
    });
  }

  /* ------------------------------
     Filter Logic
  --------------------------------*/
  function filterByLocation(selectedLocation) {
    if (!selectedLocation) {
      renderProperties(properties, addresses);
      return;
    }

    const matchedAddressIds = addresses
      .filter(a => a.AddressLine1 === selectedLocation)
      .map(a => a.Id);

    const filteredProperties = properties.filter(p =>
      matchedAddressIds.includes(p.AddressId)
    );

    renderProperties(filteredProperties, addresses);

    document
      .getElementById("featured-properties")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  /* ------------------------------
     Render Properties
  --------------------------------*/
  function renderProperties(propertyList, addressList) {
    const container = document.getElementById("properties-container");
    if (!container) return;

    container.innerHTML = "";

    if (propertyList.length === 0) {
      container.innerHTML = `
        <div class="col-12 text-center">
          <h5 class="text-muted">No properties found</h5>
        </div>`;
      return;
    }

    propertyList.forEach(p => {
      const address = addressList.find(a => a.Id === p.AddressId);

      container.innerHTML += `
        <div class="col-lg-4 col-md-6">
          <div class="premium-card h-100">
            <img src="./assets/images/property-placeholder.jpg"
                 class="img-fluid rounded-top">

            <div class="p-4">
              <h5>${p.Title}</h5>
              <p class="text-muted">
                <i class="bi bi-geo-alt"></i>
                ${address?.AddressLine1 ?? "N/A"},
                ${address?.City ?? ""}
              </p>
              <p><strong>${p.BedRoom} BHK</strong></p>

              <a href="buy.html?id=${p.Id}"
                 class="btn btn-primary w-100">
                View Details
              </a>
            </div>
          </div>
        </div>`;
    });
  }

});
