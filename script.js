// business directory logic (modular, scalable)

const initialBusinesses = [
  {
    name: "Joe's Cafe",
    category: "Food",
    contact: "123-456-7890",
    address: "123 Main St, City",
    image: "https://via.placeholder.com/300x200?text=Joe's+Cafe",
  },
  {
    name: "HealthyLife Pharmacy",
    category: "Health",
    contact: "555-123-4567",
    address: "456 Health Ave, City",
    image: "https://via.placeholder.com/300x200?text=Pharmacy",
  },
  {
    name: "Corner Retail Store",
    category: "Retail",
    contact: "987-654-3210",
    address: "789 Market Rd, City",
    image: "https://via.placeholder.com/300x200?text=Retail+Store",
  },
];

let businesses = [];
let currentCategory = "All";
let searchQuery = "";

function saveBusinesses(list) {
  localStorage.setItem("businesses", JSON.stringify(list));
}

function getBusinesses() {
  const stored = JSON.parse(localStorage.getItem("businesses"));
  if (stored && Array.isArray(stored)) {
    return stored;
  }
  // first-time: bootstrap
  saveBusinesses(initialBusinesses);
  return initialBusinesses.slice();
}

function renderBusinesses(list) {
  const grid = document.getElementById("businessGrid");
  grid.innerHTML = "";
  list.forEach((b) => {
    const card = document.createElement("div");
    card.className =
      "bg-white rounded-lg shadow overflow-hidden flex flex-col";
    card.innerHTML = `
      <img src="${b.image || 'https://via.placeholder.com/300x200?text=No+Image'}" alt="${b.name}"
           class="h-32 w-full object-cover">
      <div class="p-4 flex flex-col flex-1">
        <h3 class="text-lg font-semibold">${b.name}</h3>
        <p class="text-sm text-gray-500">${b.category}</p>
        <p class="text-sm mt-2 truncate">${b.address}</p>
        <div class="mt-auto flex space-x-2">
          <a href="tel:${b.contact}" class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm">
            Call
          </a>
          <a href="https://www.google.com/maps/search/${encodeURIComponent(
            b.address
          )}" target="_blank"
             class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
            Location
          </a>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function filterAndRender() {
  const filtered = businesses.filter((b) => {
    const matchCategory =
      currentCategory === "All" || b.category === currentCategory;
    const matchSearch = b.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });
  renderBusinesses(filtered);
}

document.addEventListener("DOMContentLoaded", () => {
  businesses = getBusinesses();
  filterAndRender();

  const searchInput = document.getElementById("searchInput");
  const categoryFilters = document.getElementById("categoryFilters");
  const modal = document.getElementById("modal");
  const addBtn = document.getElementById("addBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  const addForm = document.getElementById("addForm");

  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    filterAndRender();
  });

  categoryFilters.addEventListener("click", (e) => {
    if (e.target.matches("button")) {
      currentCategory = e.target.dataset.category;
      Array.from(categoryFilters.children).forEach((btn) => {
        btn.classList.remove("bg-blue-500", "text-white");
        btn.classList.add("bg-gray-200");
      });
      e.target.classList.remove("bg-gray-200");
      e.target.classList.add("bg-blue-500", "text-white");
      filterAndRender();
    }
  });

  addBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
  });

  cancelBtn.addEventListener("click", () => {
    addForm.reset();
    modal.classList.add("hidden");
  });

  addForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newBiz = {
      name: document.getElementById("name").value.trim(),
      category: document.getElementById("category").value.trim(),
      contact: document.getElementById("contact").value.trim(),
      address: document.getElementById("address").value.trim(),
      image: document.getElementById("image").value.trim(),
    };
    if (!newBiz.image) {
      newBiz.image = "https://via.placeholder.com/300x200?text=No+Image";
    }
    businesses.push(newBiz);
    saveBusinesses(businesses);
    filterAndRender();
    addForm.reset();
    modal.classList.add("hidden");
  });
});
