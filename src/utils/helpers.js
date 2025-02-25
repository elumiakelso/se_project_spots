function setButtonText(button, text) {
  button.textContent = text;
}

export function handleSubmit(request, evt, loadingText) {
  evt.preventDefault();

  const submitButton = evt.submitter;
  const defaultText = submitButton.textContent;

  setButtonText(submitButton, loadingText);

  request()
    .then(() => {
      evt.target.reset();
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitButton, defaultText);
    });
}
