import "./index.css";

import {
  enableValidation,
  settings,
  disableButton,
  resetValidation,
} from "../scripts/validation.js";

import Api from "../utils/Api.js";

// const initialCards = [
//   {
//     name: "Golden Gate bridge",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
//   },
//   {
//     name: "Val Thorens",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
//   {
//     name: "Restaurant terrace",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
//   },
//   {
//     name: "An outdoor cafe",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
//   },
//   {
//     name: "A very long bridge, over the forest and through the trees",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
//   },
//   {
//     name: "Tunnel with morning light",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
//   },
//   {
//     name: "Mountain house",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
// ];

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "2adde17f-b396-4bac-b466-9e32780c9b81",
    "Content-Type": "application/json",
  },
});

//desctructure the 2nd item in the callback of .then

api
  .getAppInfo()
  .then(([cards]) => {
    cards.forEach((card) => {
      const cardElement = getCardElement(card);
      cardsListElement.append(cardElement);
    });
    //handle the user's info
    //set src of the avatar image
    //set text content of both text elements
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

function handleLike(evt) {
  evt.target.classList.toggle("card__like-button_liked");
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

  // cardLikeButtonElement.addEventListener("click", () => {
  //   cardLikeButtonElement.classList.toggle("card__like-button_liked");
  // });

  cardLikeButtonElement.addEventListener("click", handleLike);

  // cardDeleteButtonElement.addEventListener("click", () => {
  //   cardElement.remove();
  // });

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

let exampleOpenModal = undefined;
function openModal(modal) {
  exampleOpenModal = modal;
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
  api
    .editUserInfo({
      name: profileNameInput.value,
      about: profileDescriptionInput.value,
    })
    .then((data) => {
      //TODO use data arg instead of input values
      profileNameElement.textContent = profileNameInput.value;
      profileDescriptionElement.textContent = profileDescriptionInput.value;
      closeModal(profileModalElement);
    })
    .catch((err) => {
      console.error(err);
    });
}

function handlePostFormSubmit(evt) {
  evt.preventDefault();
  const postInputValues = {
    name: postCaptionInput.value,
    link: postLinkInput.value,
  };
  const cardElement = getCardElement(postInputValues);
  cardsListElement.prepend(cardElement);
  evt.target.reset();
  disableButton(postSubmitButton, settings);
  closeModal(postModalElement);
}

function handleAvatarFormSubmit(evt) {
  evt.preventDefault();

  console.log(avatarLinkInput.value);

  api
    .editAvatarInfo(avatarLinkInput.value)
    .then((data) => {
      console.log(data.avatar);
      //TODO - set new avatar element with src of the avatar
    })
    .catch((err) => {
      console.error(err);
    });
}

function handleDeleteFormSubmit(evt) {
  evt.preventDefault();
  api
    .removeCard(selectedCardId)
    .then(() => {
      // remove the card from the DOM
      // close the modal
    })
    .catch((err) => {
      console.error(err);
    });
}

profileButtonElement.addEventListener("click", () => {
  profileNameInput.value = profileNameElement.textContent;
  profileDescriptionInput.value = profileDescriptionElement.textContent;
  //OPTIONAL
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

profileFormElement.addEventListener("submit", handleProfileFormSubmit);

postFormElement.addEventListener("submit", handlePostFormSubmit);

avatarFormElement.addEventListener("submit", handleAvatarFormSubmit);

deleteFormElement.addEventListener("submit", handleDeleteFormSubmit);

enableValidation(settings);
