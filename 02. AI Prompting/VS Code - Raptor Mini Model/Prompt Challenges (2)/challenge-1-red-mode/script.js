function goRed() {
  const page = document.querySelector('#page');
  const title = document.querySelector('#title');
  const tagline = document.querySelector('#tagline');
  const goRedButton = document.querySelector('#go-red');
  const goBlackButton = document.querySelector('#go-black');

  page.style.backgroundColor = '#fee5e5';
  page.style.color = '#990000';
  title.style.color = '#990000';
  tagline.style.color = '#990000';
  goRedButton.style.color = '#990000';
  goRedButton.style.borderColor = '#990000';
  goBlackButton.style.color = '#990000';
  goBlackButton.style.borderColor = '#990000';
}

function goBlack() {
  const page = document.querySelector('#page');
  const title = document.querySelector('#title');
  const tagline = document.querySelector('#tagline');
  const goRedButton = document.querySelector('#go-red');
  const goBlackButton = document.querySelector('#go-black');

  page.style.backgroundColor = '#ffffff';
  page.style.color = '#000000';
  title.style.color = '#000000';
  tagline.style.color = '#000000';
  goRedButton.style.color = '#000000';
  goRedButton.style.borderColor = '#000000';
  goBlackButton.style.color = '#000000';
  goBlackButton.style.borderColor = '#000000';
}
