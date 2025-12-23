document.addEventListener("DOMContentLoaded", () => {
  let properties = []; // This will hold the combined RentalProperty with Listing details
  let addresses = [];

  Promise.all([
    fetch("./assets/data/Rent.json").then(res => res.json()),
    fetch("./assets/data/GREL New.json").then(res => res.json()) // Fetch GREL New.json for addresses
  ])
  .then(([rentData, grelNewData]) => {
    const { RentalProperty, RentalListing } = rentData;
    addresses = grelNewData.Address; // Addresses from GREL New.json

    // Combine RentalProperty with their corresponding RentalListing and Address details
    properties = RentalProperty.map(prop => {
      const listing = RentalListing.find(l => l.PropertyId === prop.Id);
      // Find address details for the rental property
      const addressDetail = addresses.find(addr => addr.Id === prop.AddressId);
      return { ...prop, ...listing, ...addressDetail, ListingType: "Rent" }; // Merge all relevant data
    });
    
    // Initial render of all rental properties
    filterProperties();
    // Attach search handlers
    attachSearchHandlers();
  })
  .catch(err => console.error("JSON Load Error:", err));

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

  function filterProperties() {
    const location = document.getElementById("searchLocation").value;
    const configuration = document.getElementById("searchConfiguration").value;
    const propertyType = document.getElementById("searchPropertyType").value;
    const toilets = document.getElementById("searchToilet").value;
    const balcony = document.getElementById("searchBalcony").value;

    let filteredProperties = properties;

    if (location) {
        // Filter based on Locality from the merged address data in 'properties'
        filteredProperties = filteredProperties.filter(p => p.Locality === location);
    }

    if (configuration) {
      filteredProperties = filteredProperties.filter(
        (p) => p.BedRoom.toString() === configuration
      );
    }

    if (propertyType) {
        if (propertyType === "Apartment") {
            filteredProperties = filteredProperties.filter(p => !p.PropertyName.includes("Villa") && !p.PropertyName.includes("Independent House") && !p.PropertyName.includes("Penthouse"));
        } else if (propertyType) {
            filteredProperties = filteredProperties.filter(p => p.PropertyName.toLowerCase().includes(propertyType.toLowerCase()));
        }
    }

    if (toilets) {
      filteredProperties = filteredProperties.filter(
        (p) => p.Toilet.toString() === toilets
      );
    }

    if (balcony) {
      filteredProperties = filteredProperties.filter(
        (p) => p.Balcony.toString() === balcony
      );
    }

    renderRentProperties(filteredProperties);
  }

  function renderRentProperties(list) {
    const container = document.getElementById("rent-properties-container");
    if (!container) return;
    
    container.innerHTML = "";

    if (!list.length) {
      container.innerHTML = `<div class="col-12"><p class="text-center">No properties found matching your criteria.</p></div>`;
      return;
    }

    list.forEach(p => {
        const deposit = p.Deposit
        ? `₹${p.Deposit.toLocaleString()}`
        : "Contact for Deposit";
        // ImageUrl is now directly on the merged 'p' object
        const imageSrc = p.ImageUrl ? `./assets/images/RentalImages/${p.ImageUrl}` : 'https://via.placeholder.com/300x200.png?text=Image+Not+Available';

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
                ${p.AddressLine1 ?? "N/A"}, ${p.City ?? ""}
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
                <h5 class="fw-bold mb-0">₹ ${p.Price.toLocaleString()} / mo</h5>
                <a href="buy-details.html?id=${
                  p.Id
                }&type=rent" class="btn btn-primary">
                  View Details
                </a>
              </div>
               <div class="mt-2 small">
              <span class="badge bg-light text-dark">
                Deposit: ${deposit}
              </span>
            </div>
            </div>
          </div>
        </div>
      `;
    });
  }
});
