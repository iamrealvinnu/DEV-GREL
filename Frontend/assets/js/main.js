document.addEventListener("DOMContentLoaded", () => {
  let addresses = [];
  let properties = [];
  let listings = [];

  // Fetch data and initialize the page
  fetch("./assets/data/GREL New.json")
    .then((res) => res.json())
    .then((data) => {
      addresses = data.Address;
      properties = data.Property;
      listings = data.PropertyListing;

      // Initial render of all properties
      renderProperties(properties, addresses, listings, true);

      // Attach search handlers
      attachSearchHandlers();
    })
    .catch((err) => console.error("JSON load error:", err));

  /**
   * Attaches event listeners to all search filter dropdowns and the search button.
   */
  function attachSearchHandlers() {
    const searchBtn = document.getElementById("mainSearchButton");

    if (searchBtn) {
      searchBtn.addEventListener("click", () => {
        const location = document.getElementById("searchLocation").value;
        const configuration = document.getElementById("searchConfiguration").value;
        const propertyType = document.getElementById("searchPropertyType").value;
        const toilets = document.getElementById("searchToilet").value;
        const balcony = document = document.getElementById("searchBalcony").value;

        const queryParams = new URLSearchParams();
        if(location) queryParams.append('location', location);
        if(configuration) queryParams.append('configuration', configuration);
        if(propertyType) queryParams.append('propertyType', propertyType);
        if(toilets) queryParams.append('toilets', toilets);
        if(balcony) queryParams.append('balcony', balcony);

        window.location.href = `search-results.html?${queryParams.toString()}`;
      });
    }
  }

  /**
   * Renders the property cards into the container.
   * @param {Array} propertyList - The list of properties to render.
   * @param {Array} addressList - The list of addresses.
   * @param {Array} listingList - The list of listings.
   * @param {boolean} isFeatured - Whether to display only a limited number of featured properties.
   */
  function renderProperties(propertyList, addressList, listingList, isFeatured = false) {
    const container = document.getElementById("properties-container");
    if (!container) return;

    container.innerHTML = "";

    if (propertyList.length === 0) {
      container.innerHTML = `<div class="col-12"><p class="text-center">No properties found matching your criteria.</p></div>`;
      return;
    }

    const propertiesToRender = isFeatured ? propertyList.slice(0, 6) : propertyList;
    console.log(`Rendering ${propertiesToRender.length} properties. isFeatured: ${isFeatured}`);


    propertiesToRender.forEach((p) => {
      const address = addressList.find((a) => a.Id === p.AddressId);
      const listing = listingList.find((l) => l.PropertyId === p.Id);
      const imageSrc = p.ImageUrl ? `./assets/images/${p.ImageUrl}` : 'https://via.placeholder.com/300x200.png?text=Image+Not+Available';

      container.innerHTML += `
        <div class="col-lg-4 col-md-6 mb-4">
          <div class="card property-card h-100">
            <img 
              src="${imageSrc}"
              class="card-img-top"
              alt="${p.PropertyName}"
              style="height: 220px; object-fit: cover;"
              onerror="this.onerror=null;this.src='https://via.placeholder.com/300x200.png?text=Image+Not+Available';"
            >
            <div class="card-body">
              <h5 class="card-title">${p.PropertyName}</h5>
              <p class="card-text text-muted small">
                <i class="bi bi-geo-alt-fill me-2"></i>
                ${address?.AddressLine1 ?? "N/A"}, ${address?.City ?? ""}
              </p>
              <div class="row text-center my-3">
                <div class="col">
                  <i class="bi bi-building"></i>
                  <div>${p.BedRoom} BHK</div>
                </div>
                <div class="col">
                  <i class="bi bi-bounding-box"></i>
                  <div>${p.SBA} sq.ft</div>
                </div>
                <div class="col">
                  <i class="bi bi-droplet"></i>
                  <div>${p.Toilet} Baths</div>
                </div>
              </div>
              <div class="d-flex justify-content-between align-items-center">
                <h5 class="fw-bold mb-0">₹ ${
                  listing ? (listing.Price / 100000).toFixed(1) + " L" : "Price on request"
                }</h5>
                <a href="buy-details.html?id=${
                  p.Id
                }&type=${listing ? listing.ListingType.toLowerCase() : 'sell'}" class="btn btn-primary">
                  View Details
                </a>
              </div>
            </div>
          </div>
        </div>`;
    });
  }

  // Initial render of all properties
  renderProperties(properties, addresses, listings, true);

  // Load footer
  fetch("./components/footer.html")
    .then((res) => res.text())
    .then((data) => {
      const footerContainer = document.getElementById("footer-container");
      if (footerContainer) {
        footerContainer.innerHTML = data;
      }
    });
});