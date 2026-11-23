// North Star Bakery — Touchstone 4
// Interactive feature: Product Favorites tracker
// Form validation: Contact and Pre-Orders form
// Browser storage: localStorage saves the favorites list

// The bakery's products, stored as an array of objects so the
// favorites list, the buttons, and the prices all use one source.
var PRODUCTS = [
  { id: "country-sourdough", name: "Country Sourdough", category: "Breads", price: "$6 to $9 per loaf" },
  { id: "honey-oat-loaf", name: "Honey Oat Loaf", category: "Breads", price: "$5 to $8 per loaf" },
  { id: "multigrain-seeded", name: "Multigrain and Seeded Loaves", category: "Breads", price: "$6 to $9 per loaf" },
  { id: "baguettes-rolls", name: "Baguettes and Rolls", category: "Breads", price: "$3 to $6 each or per half dozen" },
  { id: "croissants", name: "Croissants", category: "Pastries", price: "$3.50 to $5.50 each" },
  { id: "muffins-scones", name: "Muffins and Scones", category: "Pastries", price: "$3 to $5 each" },
  { id: "cinnamon-rolls-danish", name: "Cinnamon Rolls and Danish", category: "Pastries", price: "$4 to $6 each" },
  { id: "pastry-boxes", name: "Pastry Boxes", category: "Pastries", price: "$18 to $36 per box" },
  { id: "everyday-cakes", name: "Everyday Cakes", category: "Cakes and Special Orders", price: "$24 to $40 each" },
  { id: "custom-celebration-cakes", name: "Custom Celebration Cakes", category: "Cakes and Special Orders", price: "$45 to $120 and up" },
  { id: "cupcakes", name: "Cupcakes", category: "Cakes and Special Orders", price: "$15 to $30 per dozen" }
];

var STORAGE_KEY = "northStarBakeryFavorites";

// Start with the saved favorites, or an empty list on a first visit.
var favorites = loadFavorites();

// ---------- Browser storage ----------

function loadFavorites() {
  try {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return [];
    }
    var parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) {
      return [];
    }
    // Keep only ids that match a real product, so old or mistyped
    // saved data can never break the list.
    return parsed.filter(function (id) {
      return getProductById(id) !== null;
    });
  } catch (error) {
    return [];
  }
}

function saveFavorites() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch (error) {
    // If storage is unavailable, the list still works for this visit.
  }
}

// ---------- Product helpers ----------

function getProductById(id) {
  for (var i = 0; i < PRODUCTS.length; i++) {
    if (PRODUCTS[i].id === id) {
      return PRODUCTS[i];
    }
  }
  return null;
}

function isFavorite(id) {
  return favorites.indexOf(id) !== -1;
}

// ---------- Favorites feature ----------

function toggleFavorite(id) {
  var product = getProductById(id);
  if (!product) {
    return;
  }
  if (isFavorite(id)) {
    favorites = favorites.filter(function (savedId) {
      return savedId !== id;
    });
  } else {
    favorites.push(id);
  }
  saveFavorites();
  renderFavorites();
  updateFavoriteButtons();
  updateFavoritesSummary();
}

function removeFavorite(id) {
  favorites = favorites.filter(function (savedId) {
    return savedId !== id;
  });
  saveFavorites();
  renderFavorites();
  updateFavoriteButtons();
  updateFavoritesSummary();
}

function clearFavorites() {
  favorites = [];
  saveFavorites();
  renderFavorites();
  updateFavoriteButtons();
  updateFavoritesSummary();
}

function renderFavorites() {
  var list = document.getElementById("favorites-list");
  var count = document.getElementById("favorites-count");
  if (!list || !count) {
    return;
  }
  list.innerHTML = "";
  if (favorites.length === 0) {
    count.textContent = "You have not saved any favorites yet. Tap \"Add to Favorites\" on a product below to start your list.";
    return;
  }
  count.textContent = "Your favorites (" + favorites.length + "):";
  favorites.forEach(function (id) {
    var product = getProductById(id);
    if (!product) {
      return;
    }
    var item = document.createElement("li");
    item.textContent = product.name + " — " + product.category + " — " + product.price + " ";
    var removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.textContent = "Remove";
    removeButton.setAttribute("data-product", product.id);
    removeButton.addEventListener("click", function () {
      removeFavorite(product.id);
    });
    item.appendChild(removeButton);
    list.appendChild(item);
  });
}

function updateFavoriteButtons() {
  var buttons = document.querySelectorAll(".favorite-button");
  buttons.forEach(function (button) {
    var id = button.getAttribute("data-product");
    var product = getProductById(id);
    if (!product) {
      return;
    }
    if (isFavorite(id)) {
      button.textContent = "Saved to Favorites";
      button.setAttribute("aria-pressed", "true");
    } else {
      button.textContent = "Add to Favorites";
      button.setAttribute("aria-pressed", "false");
    }
  });
}

function updateFavoritesSummary() {
  var summary = document.getElementById("favorites-summary");
  if (!summary) {
    return;
  }
  if (favorites.length === 0) {
    summary.textContent = "No favorites saved yet.";
  } else if (favorites.length === 1) {
    summary.textContent = "Your favorites: 1 item saved.";
  } else {
    summary.textContent = "Your favorites: " + favorites.length + " items saved.";
  }
}

function initFavorites() {
  var buttons = document.querySelectorAll(".favorite-button");
  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      toggleFavorite(button.getAttribute("data-product"));
    });
  });
  var clearButton = document.getElementById("clear-favorites");
  if (clearButton) {
    clearButton.addEventListener("click", clearFavorites);
  }
  renderFavorites();
  updateFavoriteButtons();
  updateFavoritesSummary();
}

// ---------- Form validation ----------

function showError(field, errorId, message) {
  var error = document.getElementById(errorId);
  if (error) {
    error.textContent = message;
  }
  field.setAttribute("aria-invalid", "true");
}

function clearError(field, errorId) {
  var error = document.getElementById(errorId);
  if (error) {
    error.textContent = "";
  }
  field.removeAttribute("aria-invalid");
}

function validateName() {
  var field = document.getElementById("full-name");
  if (!field) {
    return true;
  }
  var value = field.value.trim();
  if (value === "") {
    showError(field, "full-name-error", "Please enter your full name.");
    return false;
  }
  if (value.length < 2) {
    showError(field, "full-name-error", "Your name must be at least 2 characters long.");
    return false;
  }
  clearError(field, "full-name-error");
  return true;
}

function validateEmail() {
  var field = document.getElementById("email");
  if (!field) {
    return true;
  }
  var value = field.value.trim();
  if (value === "") {
    showError(field, "email-error", "Please enter your email address.");
    return false;
  }
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(value)) {
    showError(field, "email-error", "Please enter a valid email address, like you@example.com.");
    return false;
  }
  clearError(field, "email-error");
  return true;
}

function validateRequestType() {
  var field = document.getElementById("request-type");
  if (!field) {
    return true;
  }
  if (field.value === "") {
    showError(field, "request-type-error", "Please choose a request type.");
    return false;
  }
  clearError(field, "request-type-error");
  return true;
}

function validateItemDetails() {
  var field = document.getElementById("item-details");
  if (!field) {
    return true;
  }
  var value = field.value.trim();
  if (value === "") {
    showError(field, "item-details-error", "Please tell us which items you would like.");
    return false;
  }
  if (value.length < 10) {
    showError(field, "item-details-error", "Please give a little more detail — at least 10 characters — so we can prepare your order.");
    return false;
  }
  clearError(field, "item-details-error");
  return true;
}

function validatePickupDate() {
  var field = document.getElementById("pickup-date");
  if (!field) {
    return true;
  }
  if (field.value === "") {
    clearError(field, "pickup-date-error");
    return true;
  }
  var chosen = new Date(field.value + "T00:00:00");
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  if (chosen < today) {
    showError(field, "pickup-date-error", "Please choose a pickup date today or in the future.");
    return false;
  }
  clearError(field, "pickup-date-error");
  return true;
}

function handleFormSubmit(event) {
  var nameOk = validateName();
  var emailOk = validateEmail();
  var typeOk = validateRequestType();
  var detailsOk = validateItemDetails();
  var dateOk = validatePickupDate();
  var success = document.getElementById("form-success");
  if (!nameOk || !emailOk || !typeOk || !detailsOk || !dateOk) {
    event.preventDefault();
    if (success) {
      success.hidden = true;
    }
    var firstInvalid = document.querySelector("[aria-invalid=\"true\"]");
    if (firstInvalid) {
      firstInvalid.focus();
    }
    return;
  }
  // No server receives this form in the class project, so stop the
  // page from reloading and confirm the request on the page instead.
  event.preventDefault();
  if (success) {
    success.textContent = "Thank you! Your request was received. We will get back to you to confirm your pre-order details.";
    success.hidden = false;
  }
}

function initFormValidation() {
  var form = document.querySelector("form");
  if (!form) {
    return;
  }
  form.addEventListener("submit", handleFormSubmit);
  var nameField = document.getElementById("full-name");
  if (nameField) {
    nameField.addEventListener("input", validateName);
  }
  var emailField = document.getElementById("email");
  if (emailField) {
    emailField.addEventListener("input", validateEmail);
  }
  var typeField = document.getElementById("request-type");
  if (typeField) {
    typeField.addEventListener("change", validateRequestType);
  }
  var detailsField = document.getElementById("item-details");
  if (detailsField) {
    detailsField.addEventListener("input", validateItemDetails);
  }
  var dateField = document.getElementById("pickup-date");
  if (dateField) {
    dateField.addEventListener("change", validatePickupDate);
  }
}

// ---------- Start the page ----------

document.addEventListener("DOMContentLoaded", function () {
  initFavorites();
  initFormValidation();
});
