const initialCards = [
  {
    name: "Golden Gate bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

const profileButtonElement = document.querySelector(".profile__edit-button");
const postButtonElement = document.querySelector(".profile__post-button");
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
const postCloseButtonElement = postModalElement.querySelector(
  ".modal__close-button"
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

  cardLikeButtonElement.addEventListener("click", () => {
    cardLikeButtonElement.classList.toggle("card__like-button_liked");
  });

  cardDeleteButtonElement.addEventListener("click", () => {
    cardElement.remove();
  });

  cardImageElement.addEventListener("click", () => {
    openModal(previewModalElement);
    previewImageElement.src = data.link;
    previewImageElement.alt = data.name;
    previewCaptionElement.textContent = data.name;
  });

  return cardElement;
}

initialCards.forEach((card) => {
  const cardElement = getCardElement(card);
  cardsListElement.append(cardElement);
});

function openModal(modal) {
  modal.classList.add("modal_opened");
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
}

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  profileNameElement.textContent = profileNameInput.value;
  profileDescriptionElement.textContent = profileDescriptionInput.value;
  closeModal(profileModalElement);
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
  closeModal(postModalElement);
}

profileButtonElement.addEventListener("click", () => {
  profileNameInput.value = profileNameElement.textContent;
  profileDescriptionInput.value = profileDescriptionElement.textContent;
  openModal(profileModalElement);
});

profileCloseButtonElement.addEventListener("click", () => {
  closeModal(profileModalElement);
});

postButtonElement.addEventListener("click", () => {
  openModal(postModalElement);
});

postCloseButtonElement.addEventListener("click", () => {
  closeModal(postModalElement);
});

previewCloseButtonElement.addEventListener("click", () => {
  closeModal(previewModalElement);
});

profileFormElement.addEventListener("submit", handleProfileFormSubmit);

postFormElement.addEventListener("submit", handlePostFormSubmit);
