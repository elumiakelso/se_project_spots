import "./index.css";

import {
  enableValidation,
  settings,
  disableButton,
  resetValidation,
} from "../scripts/validation.js";

import Api from "../utils/Api.js";

import { setButtonText } from "../utils/helpers.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "62e54e26-8fd2-4338-a021-e8177a2d325f", // Placeholder
    // authorization: "2adde17f-b396-4bac-b466-9e32780c9b81", // Bessie
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([userinfo, cards]) => {
    cards.forEach((card) => {
      const cardElement = getCardElement(card);
      cardsListElement.append(cardElement);
    });
    profileNameElement.textContent = userinfo.name;
    profileDescriptionElement.textContent = userinfo.about;
    avatarImageElement.src = userinfo.avatar;
  })
  .catch((err) => {
    console.error(err);
  });

const modalList = document.querySelectorAll(".modal");

const avatarModalElement = document.querySelector("#avatar-modal");
const avatarFormElement = document.forms["avatar-form"];
const avatarSubmitButton = avatarModalElement.querySelector(
  ".modal__submit-button"
);
const avatarCloseButtonElement = avatarModalElement.querySelector(
  ".modal__close-button"
);
const avatarLinkInput = avatarModalElement.querySelector("#avatar-link");
const avatarImageElement = document.querySelector(".profile__avatar");

const profileButtonElement = document.querySelector(".profile__edit-button");
const postButtonElement = document.querySelector(".profile__post-button");
const avatarButtonElement = document.querySelector(".profile__avatar-button");
const profileNameElement = document.querySelector(".profile__name");
const profileDescriptionElement = document.querySelector(
  ".profile__description"
);

const profileModalElement = document.querySelector("#edit-modal");
const profileFormElement = document.forms["profile-form"];
const profileCloseButtonElement = profileModalElement.querySelector(
  ".modal__close-button"
);

const profileNameInput = profileModalElement.querySelector("#name");
const profileDescriptionInput =
  profileModalElement.querySelector("#description");

const postModalElement = document.querySelector("#new-post-modal");
const postFormElement = document.forms["new-post-form"];
const postSubmitButton = postModalElement.querySelector(
  ".modal__submit-button"
);
const postCloseButtonElement = postModalElement.querySelector(
  ".modal__close-button"
);

const deleteModalElement = document.querySelector("#delete-modal");
const deleteFormElement = document.forms["delete-form"];
const deleteCloseButtonElement = deleteModalElement.querySelector(
  ".modal__close-button"
);
const deleteCancelButtonElement = deleteModalElement.querySelector(
  ".modal__submit-button_type_cancel"
);

const postLinkInput = postModalElement.querySelector("#image-link");
const postCaptionInput = postModalElement.querySelector("#caption");

const previewModalElement = document.querySelector("#preview-modal");
const previewImageElement = previewModalElement.querySelector(".modal__image");
const previewCaptionElement =
  previewModalElement.querySelector(".modal__caption");
const previewCloseButtonElement = previewModalElement.querySelector(
  ".modal__close-button"
);

const cardTemplate = document.querySelector("#card-template");
const cardsListElement = document.querySelector(".cards__list");

let selectedCard;
let selectedCardId;

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModalElement);
}

function handleLike(evt, id) {
  const likeButtonElement = evt.target;
  const isLiked = likeButtonElement.classList.contains(
    "card__like-button_liked"
  );

  api
    .changeLikeStatus(id, isLiked)
    .then((data) => {
      likeButtonElement.classList.toggle("card__like-button_liked");
    })
    .catch((err) => {
      console.error(err);
    });
}

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardNameElement = cardElement.querySelector(".card__label");
  const cardImageElement = cardElement.querySelector(".card__image");
  const cardLikeButtonElement = cardElement.querySelector(".card__like-button");
  const cardDeleteButtonElement = cardElement.querySelector(
    ".card__delete-button"
  );

  cardNameElement.textContent = data.name;
  cardImageElement.src = data.link;
  cardImageElement.alt = data.name;

  if (data.isLiked) {
    cardLikeButtonElement.classList.add("card__like-button_liked");
  }

  cardLikeButtonElement.addEventListener("click", (evt) =>
    handleLike(evt, data._id)
  );

  cardDeleteButtonElement.addEventListener("click", (evt) =>
    handleDeleteCard(cardElement, data._id)
  );

  cardImageElement.addEventListener("click", () => {
    openModal(previewModalElement);
    previewImageElement.src = data.link;
    previewImageElement.alt = data.name;
    previewCaptionElement.textContent = data.name;
  });

  return cardElement;
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", closeOnEscape);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", closeOnEscape);
}

function setupCloseOnOverlayClick(modalList) {
  modalList.forEach((modal) => {
    modal.addEventListener("click", (evt) => {
      if (evt.target === modal && modal.classList.contains("modal_opened")) {
        closeModal(modal);
      }
    });
  });
}

setupCloseOnOverlayClick(modalList);

function closeOnEscape(evt) {
  const openedModal = document.querySelector(".modal.modal_opened");
  if ((evt.key === "Escape" || evt.keyCode === "27") && openedModal) {
    closeModal(openedModal);
  }
}

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.submitter;
  setButtonText(submitButton, true, "Save", "Saving...");
  api
    .editUserInfo({
      name: profileNameInput.value,
      about: profileDescriptionInput.value,
    })
    .then((data) => {
      profileNameElement.textContent = data.name;
      profileDescriptionElement.textContent = data.about;
      closeModal(profileModalElement);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setButtonText(submitButton, false, "Save", "Saving...");
    });
}

function handlePostFormSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.submitter;
  setButtonText(submitButton, true, "Save", "Saving...");
  api
    .addCard({ name: postCaptionInput.value, link: postLinkInput.value })
    .then((data) => {
      const cardElement = getCardElement(data);
      cardsListElement.prepend(cardElement);
      evt.target.reset();
      disableButton(postSubmitButton, settings);
      closeModal(postModalElement);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setButtonText(submitButton, false, "Save", "Saving...");
    });
}

function handleAvatarFormSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.submitter;
  setButtonText(submitButton, true, "Save", "Saving...");

  api
    .editAvatarInfo(avatarLinkInput.value)
    .then((data) => {
      avatarImageElement.src = data.avatar;
      closeModal(avatarModalElement);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setButtonText(submitButton, false, "Save", "Saving...");
    });
}

function handleDeleteFormSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.submitter;
  setButtonText(submitButton, true, "Delete", "Deleting...");
  api
    .removeCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModalElement);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setButtonText(submitButton, false, "Delete", "Deleting...");
    });
}

profileButtonElement.addEventListener("click", () => {
  profileNameInput.value = profileNameElement.textContent;
  profileDescriptionInput.value = profileDescriptionElement.textContent;
  resetValidation(
    profileFormElement,
    [profileNameInput, profileDescriptionInput],
    settings
  );
  openModal(profileModalElement);
});

profileCloseButtonElement.addEventListener("click", () => {
  closeModal(profileModalElement);
});

postButtonElement.addEventListener("click", () => {
  openModal(postModalElement);
});

avatarButtonElement.addEventListener("click", () => {
  openModal(avatarModalElement);
});

avatarCloseButtonElement.addEventListener("click", () => {
  closeModal(avatarModalElement);
});

postCloseButtonElement.addEventListener("click", () => {
  closeModal(postModalElement);
});

previewCloseButtonElement.addEventListener("click", () => {
  closeModal(previewModalElement);
});

deleteCloseButtonElement.addEventListener("click", () => {
  closeModal(deleteModalElement);
});

deleteCancelButtonElement.addEventListener("click", () => {
  closeModal(deleteModalElement);
});

profileFormElement.addEventListener("submit", handleProfileFormSubmit);

postFormElement.addEventListener("submit", handlePostFormSubmit);

avatarFormElement.addEventListener("submit", handleAvatarFormSubmit);

deleteFormElement.addEventListener("submit", handleDeleteFormSubmit);

enableValidation(settings);
