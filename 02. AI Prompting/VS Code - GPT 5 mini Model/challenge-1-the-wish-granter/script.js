function grantWish() {
  const wishInput = document.querySelector('#wishBox');
  const verdict = document.querySelector('#verdict');
  const randomValue = Math.random();
  if (randomValue < 0.5) {
    verdict.textContent = 'WISH HAS BEEN GRANTED';
  } else {
    verdict.textContent = 'WISH DENIED';
  }
}
