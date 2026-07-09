const storageGrid = document.getElementById("storageGrid");
const removeSelectedButton = document.getElementById("removeSelected");
const clearAllButton = document.getElementById("clearAll");

let selectedKey = null;

const renderStorage = () => {
  storageGrid.innerHTML = "";
  const keys = Object.keys(localStorage).sort();

  if (keys.length === 0) {
    const empty = document.createElement("div");
    empty.className = "storage-item";
    empty.textContent = "No items stored.";
    empty.style.cursor = "default";
    storageGrid.appendChild(empty);
    selectedKey = null;
    return;
  }

  keys.forEach((key) => {
    const value = localStorage.getItem(key);
    const item = document.createElement("div");
    item.className = "storage-item";
    if (key === selectedKey) {
      item.classList.add("selected");
    }

    item.innerHTML = `<span>Key</span>${key}<span>Value</span>${value}`;

    item.addEventListener("click", () => {
      selectedKey = key === selectedKey ? null : key;
      renderStorage();
    });

    storageGrid.appendChild(item);
  });
};

removeSelectedButton.addEventListener("click", () => {
  if (!selectedKey) {
    alert("Select an item to remove.");
    return;
  }

  localStorage.removeItem(selectedKey);
  selectedKey = null;
  renderStorage();
});

clearAllButton.addEventListener("click", () => {
  if (localStorage.length === 0) {
    alert("Local storage is already empty.");
    return;
  }

  const confirmed = confirm("Clear all local storage items?");
  if (!confirmed) {
    return;
  }

  localStorage.clear();
  selectedKey = null;
  renderStorage();
});

window.addEventListener("storage", renderStorage);

renderStorage();
