const imageInput = document.getElementById("propertyImages");
const previewContainer = document.getElementById("imagePreview");

imageInput.addEventListener("change", () => {
  previewContainer.innerHTML = "";

  [...imageInput.files].forEach(file => {
    const reader = new FileReader();

    reader.onload = e => {
      const col = document.createElement("div");
      col.className = "col-4";

      col.innerHTML = `
        <div class="border rounded p-2">
          <img src="${e.target.result}" class="img-fluid rounded">
        </div>
      `;

      previewContainer.appendChild(col);
    };

    reader.readAsDataURL(file);
  });
});

document.getElementById("sellForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData();

  // Text fields
  formData.append("ownerName", ownerName.value);
  formData.append("ownerPhone", ownerPhone.value);
  formData.append("ownerEmail", ownerEmail.value);
  formData.append("location", propertyLocation.value);
  formData.append("type", propertyType.value);
  formData.append("bhk", propertyBHK.value);
  formData.append("area", propertyArea.value);
  formData.append("price", expectedPrice.value);
  formData.append("description", propertyDescription.value);

  // ✅ Multiple Images
  const files = propertyImages.files;
  for (let i = 0; i < files.length; i++) {
    formData.append("images", files[i]);
  }

  // DEBUG (optional)
  for (let pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }
    console.log("Sell Property Data:", formData);


  alert("Property submitted successfully! Our team will contact you.");
});
