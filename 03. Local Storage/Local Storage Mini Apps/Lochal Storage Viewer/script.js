const keyInput = document.getElementById("keyInput");
const valueInput = document.getElementById("valueInput");
const submitButton = document.getElementById("submitButton");
const storageList = document.getElementById("storageList");

const renderStorage = () => {
  storageList.innerHTML = "";
  const keys = Object.keys(localStorage).sort();

  if (keys.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "storage-item";
    emptyItem.textContent = "No items stored yet.";
    storageList.appendChild(emptyItem);
    return;
  }

  keys.forEach((key) => {
    const value = localStorage.getItem(key);
    const item = document.createElement("li");
    item.className = "storage-item";
    item.innerHTML = `<span>Key:</span> ${key}<br /><span>Value:</span> ${value}`;
    storageList.appendChild(item);
  });
};

const handleSubmit = () => {
  const key = keyInput.value.trim();
  const value = valueInput.value.trim();

  if (!key || !value) {
    alert("Please enter both a key and a value.");
    return;
  }

  localStorage.setItem(key, value);
  keyInput.value = "";
  valueInput.value = "";
  keyInput.focus();
  renderStorage();
};

submitButton.addEventListener("click", handleSubmit);

window.addEventListener("storage", renderStorage);

renderStorage();
