function assess() {
  const scoreInput = document.querySelector('#score');
  const verdict = document.querySelector('#verdict');
  const score = Number(scoreInput.value);
  if (score <= 40) {
    verdict.textContent = 'CATASTROPHIC. We must speak with your parents';
  } else if (score <= 60) {
    verdict.textContent = 'Acceptable. You will not be expelled this time.';
  } else if (score <= 85) {
    verdict.textContent = 'Somewhat Good. At least you tried your best.';
  } else if (score <= 95) {
    verdict.textContent = 'Great Job. You\'re basically perfect!';
  } else {
    verdict.textContent = 'Seems a bit suspicious...';
  }
}
