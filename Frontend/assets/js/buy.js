document.addEventListener("DOMContentLoaded", () => {

  let properties = [];
  let addresses = [];

  const locationSelect = document.getElementById("filter-location");

  /* -----------------------------
     Load Property Data
  ----------------------------- */
  fetch("./assets/data/GREL New.json")
    .then(res => res.json())
    .then(data => {
      properties = data.Property;
      addresses = data.Address;

      populateLocations(addresses);   // 👈 NEW
      renderProperties(properties);
      attachFilterHandler();
    })
    .catch(err => console.error("JSON error:", err));

  /* -----------------------------
     Populate Location Dropdown
  ----------------------------- */
  function populateLocations(addresses) {
  locationSelect.innerHTML = `<option value="">All</option>`;

  const uniqueLocations = [
    ...new Set(addresses.map(a => a.AddressLine1).filter(Boolean))
  ];

  uniqueLocations.forEach(location => {
    const option = document.createElement("option");
    option.value = location;
    option.textContent = location;
    locationSelect.appendChild(option);
  });
}


  /* -----------------------------
     Filter Button
  ----------------------------- */
  function attachFilterHandler() {
    document
      .getElementById("apply-filters")
      .addEventListener("click", applyFilters);
  }

  /* -----------------------------
     Apply Filters
  ----------------------------- */
  function applyFilters() {
  const location = locationSelect.value;
  const type = document.getElementById("filter-type").value;
  const config = document.getElementById("filter-config").value;

  let filtered = [...properties];

  if (location) {
    const addressIds = addresses
      .filter(a => a.AddressLine1 === location)
      .map(a => a.Id);

    filtered = filtered.filter(p =>
      addressIds.includes(p.AddressId)
    );
  }

  if (type) {
    filtered = filtered.filter(p =>
      p.Type?.toLowerCase() === type.toLowerCase()
    );
  }

  if (config) {
    const bhk = parseInt(config);
    filtered = filtered.filter(p => p.BedRoom === bhk);
  }

  updateSummary(filtered.length);
  renderProperties(filtered);
}


  /* -----------------------------
     Render Cards
  ----------------------------- */
  function renderProperties(list) {
    const container = document.getElementById("properties-container");
    container.innerHTML = "";

    if (list.length === 0) {
      container.innerHTML = `
        <div class="col-12 text-center">
          <h5 class="text-muted">No matching properties found</h5>
        </div>`;
      return;
    }

    list.forEach(p => {
      const address = addresses.find(a => a.Id === p.AddressId);

       // 🔑 Build image URL
      const imageSrc = `./assets/images/${p.ImageUrl}`;

      container.innerHTML += `
        <div class="col-lg-4 col-md-6">
          <div class="premium-card h-100">
            <img 
            src="${imageSrc}"
            class="img-fluid rounded-top object-fit-cover"
            alt="${p.Title}"
            style="height: 220px; width: 100%;"
          >

            <div class="p-4">
              <h5>${p.Title}</h5>
              <p class="text-muted">
                <i class="bi bi-geo-alt"></i>
                ${address?.AddressLine1 ?? ""}, ${address?.City ?? ""}
              </p>
              <p><strong>${p.BedRoom} BHK</strong></p>

              <a href="Form.html?id=${p.Id}"
                 class="btn btn-primary w-100">
                View Details
              </a>
            </div>
          </div>
        </div>`;
    });
  }

  /* -----------------------------
     Results Summary
  ----------------------------- */
  function updateSummary(count) {
    document.getElementById("search-results-summary").innerHTML = `
      <h6 class="text-muted">${count} properties found</h6>
    `;
  }

});
