function decide() {
  const optA = document.querySelector('#opt-a');
  const optB = document.querySelector('#opt-b');
  const optC = document.querySelector('#opt-c');
  const verdict = document.querySelector('#verdict');
  const randomValue = Math.random();
  if (randomValue < 0.33) {
    verdict.textContent = 'FATE PICKED: ' + optA.value;
  } else if (randomValue < 0.66) {
    verdict.textContent = 'FATE PICKED: ' + optB.value;
  } else {
    verdict.textContent = 'FATE PICKED: ' + optC.value;
  }
}
