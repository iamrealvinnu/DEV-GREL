document.addEventListener('DOMContentLoaded', () => {
    fetch('assets/data/GREL New.json')
        .then(response => response.json())
        .then(data => {
            const properties = data.Property;
            const locations = [...new Set(data.Address.map(address => address.Locality))];
            const configurations = [...new Set(properties.map(p => p.BedRoom))].sort();
            const propertyTypes = ["Apartment", "Villa", "Independent House"]; // Temporary solution

            const propertiesDropdown = document.querySelector('.nav-item.dropdown');
            if (propertiesDropdown) {
                const dropdownMenu = propertiesDropdown.querySelector('.dropdown-menu');
                dropdownMenu.innerHTML = `
                    <li class="dropdown-submenu">
                        <a class="dropdown-item dropdown-toggle" href="#">Buy</a>
                        <ul class="dropdown-menu">
                            <li>
                                <div class="px-4 py-2">
                                    <h6>Location</h6>
                                    <select class="form-select mb-2" id="buy-nav-location">
                                        <option value="">All Locations</option>
                                        ${locations.map(l => `<option value="${l}">${l}</option>`).join('')}
                                    </select>
                                    <h6>Configuration</h6>
                                    <select class="form-select mb-2" id="buy-nav-configuration">
                                        <option value="">All Configurations</option>
                                        ${configurations.map(c => `<option value="${c}">${c} BHK</option>`).join('')}
                                    </select>
                                    <h6>Property Type</h6>
                                    <select class="form-select mb-3" id="buy-nav-property-type">
                                        <option value="">All Types</option>
                                        ${propertyTypes.map(p => `<option value="${p}">${p}</option>`).join('')}
                                    </select>
                                    <button class="btn btn-primary w-100" id="buy-nav-search">Search</button>
                                </div>
                            </li>
                        </ul>
                    </li>
                    <li class="dropdown-submenu">
                        <a class="dropdown-item dropdown-toggle" href="#">Rent</a>
                        <ul class="dropdown-menu">
                            <li>
                                <div class="px-4 py-2">
                                    <h6>Location</h6>
                                    <select class="form-select mb-2" id="rent-nav-location">
                                        <option value="">All Locations</option>
                                        ${locations.map(l => `<option value="${l}">${l}</option>`).join('')}
                                    </select>
                                    <h6>Configuration</h6>
                                    <select class="form-select mb-2" id="rent-nav-configuration">
                                        <option value="">All Configurations</option>
                                        ${configurations.map(c => `<option value="${c}">${c} BHK</option>`).join('')}
                                    </select>
                                    <h6>Property Type</h6>
                                    <select class="form-select mb-3" id="rent-nav-property-type">
                                        <option value="">All Types</option>
                                        ${propertyTypes.map(p => `<option value="${p}">${p}</option>`).join('')}
                                    </select>
                                    <button class="btn btn-primary w-100" id="rent-nav-search">Search</button>
                                </div>
                            </li>
                        </ul>
                    </li>
                    <li><a class="dropdown-item" href="sell.html">Sell</a></li>
                `;

                const buySearchBtn = document.getElementById('buy-nav-search');
                if(buySearchBtn) {
                    buySearchBtn.addEventListener('click', () => {
                        const location = document.getElementById('buy-nav-location').value;
                        const configuration = document.getElementById('buy-nav-configuration').value;
                        const propertyType = document.getElementById('buy-nav-property-type').value;
                        
                        const queryParams = new URLSearchParams({
                            listingType: 'Sell'
                        });
                        if(location) queryParams.append('location', location);
                        if(configuration) queryParams.append('configuration', configuration);
                        if(propertyType) queryParams.append('propertyType', propertyType);

                        window.location.href = `search-results.html?${queryParams.toString()}`;
                    });
                }

                const rentSearchBtn = document.getElementById('rent-nav-search');
                if(rentSearchBtn) {
                    rentSearchBtn.addEventListener('click', () => {
                        const location = document.getElementById('rent-nav-location').value;
                        const configuration = document.getElementById('rent-nav-configuration').value;
                        const propertyType = document.getElementById('rent-nav-property-type').value;

                        const queryParams = new URLSearchParams({
                            listingType: 'Rent'
                        });
                        if(location) queryParams.append('location', location);
                        if(configuration) queryParams.append('configuration', configuration);
                        if(propertyType) queryParams.append('propertyType', propertyType);

                        window.location.href = `search-results.html?${queryParams.toString()}`;
                    });
                }
            }
        });
});
