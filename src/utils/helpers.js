export function setButtonText(
  button,
  isLoading,
  defaultText = "",
  loadingText = ""
) {
  if (isLoading) {
    button.textContent = loadingText;
  } else {
    button.textContent = defaultText;
  }
}
