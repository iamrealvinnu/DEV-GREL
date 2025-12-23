document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const propertyId = params.get("id");
  const propertyType = params.get("type") || "sell"; // Default to 'sell'

  let allProperties = [];
  let addresses = [];
  let listings = [];

  const fetchData = async () => {
    try {
      if (propertyType === "rent") {
        const [rentData, grelNewData] = await Promise.all([
          fetch("./assets/data/Rent.json").then(res => res.json()),
          fetch("./assets/data/GREL New.json").then(res => res.json())
        ]);
        addresses = grelNewData.Address;
        allProperties = rentData.RentalProperty.map(prop => {
          const listing = rentData.RentalListing.find(l => l.PropertyId === prop.Id);
          const addressDetail = addresses.find(addr => addr.Id === prop.AddressId);
          return { ...prop, ...listing, ...addressDetail, ListingType: "Rent" };
        });
      } else { // 'sell' or default
        const [grelNewData, grelData] = await Promise.all([
          fetch("./assets/data/GREL New.json").then(res => res.json()),
          fetch("./assets/data/GREL.json").then(res => res.json())
        ]);

        const combinedAddresses = [...new Map([...grelNewData.Address, ...grelData.Address].map(item => [item.Id, item])).values()];
        const combinedProperties = [...new Map([...grelNewData.Property, ...grelData.Property].map(item => [item.Id, item])).values()];
        const combinedListings = [...new Map([...grelNewData.PropertyListing, ...grelData.PropertyListing].map(item => [item.Id, item])).values()];

        addresses = combinedAddresses;
        listings = combinedListings.filter(l => l.ListingType === 'Sell'); // Only sell listings
        
        allProperties = combinedProperties.map(prop => {
            const listing = listings.find(l => l.PropertyId === prop.Id);
            const addressDetail = addresses.find(addr => addr.Id === prop.AddressId);
            return {...prop, ...listing, ...addressDetail, ListingType: "Sell"};
        }).filter(prop => prop.ListingType === "Sell"); // Ensure only sell properties are here
      }

      const property = allProperties.find(p => p.Id === propertyId);

      if (!property) {
        console.error("Property not found for ID:", propertyId, "and type:", propertyType);
        document.getElementById("property-title").textContent = "Property Not Found";
        return;
      }

      // ===== BASIC DETAILS =====
      document.getElementById("property-title").textContent = property.Title || property.PropertyName;
      document.getElementById("property-description").textContent = property.Description || "No description available.";
      document.getElementById("property-name").textContent = property.PropertyName;

      // ===== IMAGE =====
      if (property.ImageUrl) {
        // Correct path for images based on type
        const imageBase = propertyType === "rent" ? "RentalImages" : "ApartmentImages";
        document.getElementById("property-image").src = `assets/images/${imageBase}/${property.ImageUrl}`;
      } else {
        document.getElementById("property-image").src = 'https://via.placeholder.com/600x400.png?text=Image+Not+Available';
      }

      // ===== OVERVIEW DETAILS =====
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

      // Price / Rent Specific Details
      const priceElement = document.getElementById("property-price"); // Add this ID to your HTML for price/rent
      const depositRow = document.getElementById("property-deposit-row"); // Add this ID to a <tr> for deposit

      if (propertyType === "rent") {
        if (priceElement) priceElement.innerHTML = `<strong>Rent:</strong> ₹${property.Price?.toLocaleString()} / mo`;
        if (depositRow) {
            depositRow.style.display = 'table-row'; // Make row visible
            document.getElementById("property-deposit").textContent = property.Deposit ? `₹${property.Deposit.toLocaleString()}` : "N/A";
        }
      } else { // sell
        if (priceElement) priceElement.innerHTML = `<strong>Price:</strong> ₹${property.Price ? (property.Price / 100000).toFixed(1) + " L" : "Price on request"}`;
        if (depositRow) depositRow.style.display = 'none'; // Hide deposit row for sell properties
      }


    } catch (error) {
      console.error("Error loading property details:", error);
      document.getElementById("property-title").textContent = "Error Loading Details";
    }
  };

  fetchData();
});
