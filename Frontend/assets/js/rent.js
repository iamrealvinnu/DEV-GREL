let allProperties = [];

// ================= FETCH & MERGE JSON =================
fetch("./assets/data/Rent.json")
  .then(res => res.json())
  .then(data => {
    const { RentalProperty, RentalListing } = data;

    allProperties = RentalProperty.map(prop => {
      const listing = RentalListing.find(l => l.PropertyId === prop.Id);
      return { ...prop, ...listing };
    });

    populateFilters(allProperties);
    renderRentProperties(allProperties);
  })
  .catch(err => console.error("JSON Load Error:", err));


// ================= RENDER PROPERTIES =================
function renderRentProperties(list) {
  const container = document.getElementById("rent-properties-container");
  container.innerHTML = "";

  if (!list.length) {
    container.innerHTML = `<p class="text-center text-muted">No properties found</p>`;
    return;
  }

  list.forEach(p => {
    const deposit = p.Deposit
      ? `₹${p.Deposit.toLocaleString()}`
      : "Contact for Deposit";

    container.innerHTML += `
      <div class="col-md-6">
        <div class="card shadow h-100">

          <img src="assets/images/${p.ImageUrl}"
               class="card-img-top"
               style="height:250px;object-fit:cover"
               onerror="this.src='assets/images/property-placeholder.jpg'">

          <div class="card-body">
            <h5>${p.PropertyName}</h5>

            <p class="text-muted mb-1">
              <i class="bi bi-geo-alt"></i>
              ${formatLocation(p.AddressId)}
            </p>

            <small>${p.BedRoom} BHK • ${p.FurnishingStatus}</small>

            <div class="d-flex justify-content-between mt-3">
              <strong>₹${p.Price.toLocaleString()} / mo</strong>
              <span>${p.SBA} sq ft</span>
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


// ================= FILTER POPULATION =================
function populateFilters(data) {
  const locationSet = new Set();
  const bhkSet = new Set();
  const furnishingSet = new Set();

  data.forEach(p => {
    locationSet.add(p.AddressId);
    bhkSet.add(p.BedRoom);
    furnishingSet.add(p.FurnishingStatus);
  });

  fillSelect("locationFilter", [...locationSet]);
  fillSelect("bhkFilter", [...bhkSet].sort());
  fillSelect("furnishingFilter", [...furnishingSet]);
}

function fillSelect(id, values) {
  const select = document.getElementById(id);

  values.forEach(v => {
    const opt = document.createElement("option");
    opt.value = v;

    if (id === "locationFilter") {
      opt.textContent = formatLocation(v);
    } else {
      opt.textContent = v;
    }

    select.appendChild(opt);
  });
}


// ================= APPLY FILTER BUTTON =================
document.getElementById("apply-filters")
  .addEventListener("click", applyFilters);

function applyFilters() {
  const location = document.getElementById("locationFilter").value;
  const bhk = document.getElementById("bhkFilter").value;
  const furnishing = document.getElementById("furnishingFilter").value;

  const filtered = allProperties.filter(p =>
    (!location || p.AddressId === location) &&
    (!bhk || p.BedRoom == bhk) &&
    (!furnishing || p.FurnishingStatus === furnishing)
  );

  renderRentProperties(filtered);
}


// ================= HELPER =================
function formatLocation(addr) {
  return addr.replace("addr-", "").replace(/-/g, " ").toUpperCase();
}
