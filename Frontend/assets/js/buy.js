document.addEventListener("DOMContentLoaded", () => {
  let properties = [];
  let addresses = [];
  let listings = [];

  Promise.all([
    fetch("./assets/data/GREL New.json").then(res => res.json()),
    fetch("./assets/data/GREL.json").then(res => res.json())
  ])
  .then(([newData, oldData]) => {
    // Combine and de-duplicate data
    const combinedAddresses = [...new Map([...newData.Address, ...oldData.Address].map(item => [item.Id, item])).values()];
    const combinedProperties = [...new Map([...newData.Property, ...oldData.Property].map(item => [item.Id, item])).values()];
    const combinedListings = [...new Map([...newData.PropertyListing, ...oldData.PropertyListing].map(item => [item.Id, item])).values()];

    properties = combinedProperties;
    addresses = combinedAddresses;
    listings = combinedListings.filter(l => l.ListingType === 'Sell');

    // Initial render of all properties
    filterProperties();

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
      searchBtn.addEventListener("click", filterProperties);
    }
    
    const filters = [
      "searchLocation",
      "searchConfiguration",
      "searchPropertyType",
      "searchToilet",
      "searchBalcony",
    ];

    filters.forEach((filterId) => {
      const dropdown = document.getElementById(filterId);
      if (dropdown) {
        dropdown.addEventListener("change", filterProperties);
      }
    });
  }

  /**
   * Filters properties based on the selected values in the search filters.
   */
  function filterProperties() {
    const location = document.getElementById("searchLocation").value;
    const configuration = document.getElementById("searchConfiguration").value;
    const propertyType = document.getElementById("searchPropertyType").value;
    const toilets = document.getElementById("searchToilet").value;
    const balcony = document.getElementById("searchBalcony").value;

    let listingIds = listings.map(l => l.PropertyId);
    let filteredProperties = properties.filter(p => listingIds.includes(p.Id));

    // Filter by location
    if (location) {
      const matchedAddressIds = addresses
        .filter((a) => a.Locality === location)
        .map((a) => a.Id);
      filteredProperties = filteredProperties.filter((p) =>
        matchedAddressIds.includes(p.AddressId)
      );
    }

    // Filter by configuration (BedRoom)
    if (configuration) {
      filteredProperties = filteredProperties.filter(
        (p) => p.BedRoom.toString() === configuration
      );
    }

    // Filter by Property Type
    if (propertyType) {
        if (propertyType === "Apartment") {
            filteredProperties = filteredProperties.filter(p => !p.PropertyName.includes("Villa") && !p.PropertyName.includes("Independent House") && !p.PropertyName.includes("Penthouse"));
        } else if (propertyType) {
            filteredProperties = filteredProperties.filter(p => p.PropertyName.toLowerCase().includes(propertyType.toLowerCase()));
        }
    }


    // Filter by toilets
    if (toilets) {
      filteredProperties = filteredProperties.filter(
        (p) => p.Toilet.toString() === toilets
      );
    }

    // Filter by balcony
    if (balcony) {
      filteredProperties = filteredProperties.filter(
        (p) => p.Balcony.toString() === balcony
      );
    }

    renderProperties(filteredProperties, addresses, listings);

  }

  /**
   * Renders the property cards into the container.
   * @param {Array} propertyList - The list of properties to render.
   * @param {Array} addressList - The list of addresses.
   * @param {Array} listingList - The list of listings.
   */
  function renderProperties(propertyList, addressList, listingList) {
    const container = document.getElementById("properties-container");
    if (!container) return;

    container.innerHTML = "";

    if (propertyList.length === 0) {
      container.innerHTML = `<div class="col-12"><p class="text-center">No properties found matching your criteria.</p></div>`;
      return;
    }

    propertyList.forEach((p) => {
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
                }&type=sell" class="btn btn-primary">
                  View Details
                </a>
              </div>
            </div>
          </div>
        </div>`;
    });
  }
});
