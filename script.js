import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Create a single supabase client for interacting with your database
const supabase = createClient(
  "https://aafpmyeechssqtzooosl.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhZnBteWVlY2hzc3F0em9vb3NsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODc3Njg2MTMsImV4cCI6MjAwMzM0NDYxM30.PHm_cw_nMzcIu2ei5t6jsJrYs5aKQqqmusyacMR2wBI"
);
var currentUser = null;
var signedIn = false;
var liked = false;
var cars = [];
var index = 0;
var likedQuotes = []; // Array to store the liked quotes
var colors = [
  "#023047",
  "#219ebc",
  "#264653",
  "#e63946",
  "#fc3e3e",
  "#fc3e3e",
  "#3d348b",
  "#7678ed",
  "#2a9d8f",
];

var color_index = 0;
var choose_index = 0;
const likeIcon = document.getElementById("bi-heart");
const button = document.getElementById("screenshot-button");
const prevButton = document.getElementById("left-button");
const nextButton = document.getElementById("right-button");
const quoteContent = document.getElementById("content");
const authorContainer = document.getElementById("author");
const likeButton = document.getElementById("like-button");
const maskElement = document.getElementById("mask");
const quoteDecoElement = document.getElementById("quoteDeco");
const themeButton = document.getElementById("theme-button");
const colorPicker = document.getElementById("color-picker");
const signUpDiv = document.getElementById("signUp-div");
const signInButton = document.getElementById("signInButton");
const leftArrow = document.getElementById("left");
const rightArrow = document.getElementById("right");
const profileImage = document.getElementById("profile-image");
const dropdownContent = document.getElementById("dropdown-content");
const logOutButton = document.getElementById("logoutButton");
const googleBtn = document.getElementById("custom-google-btn");
const profilePictureDropDown = document.getElementById("profile-drop");
const userNameDropDown = document.getElementById("dropdown-user");
const closeDropdownButton = document.getElementById("closeDropdownButton");
const closeSignIn = document.getElementById("closeSignIn");
const closeLiked = document.getElementById("closeLiked");
const navLikeButton = document.getElementById("navLikeButton");
const gridContainer = document.getElementById("gridContainer");

button.addEventListener("click", captureScreenshot);
nextButton.addEventListener("click", nextQuote);
logOutButton.addEventListener("click", signOut);
signInButton.addEventListener("click", signInWithEmail);
googleBtn.addEventListener("click", signInWithGoogle);
closeDropdownButton.addEventListener("click", hideDropdown);
closeSignIn.addEventListener("click", hideSignIn);
window.addEventListener("resize", changeMaskPorperties);

navLikeButton.addEventListener("click", buildLikeGrid);

closeLiked.addEventListener("click", hideLiked);

function fetchQuotes() {
  fetch("https://api.quotable.io/quotes/random?limit=10&maxLength=200")
    .then((response) => response.json())
    .then((data) => {
      cars = data.map((quote) => ({
        content: quote.content,
        author: quote.author,
      }));

      updateQuote();
      index = 0;
    })
    .catch((error) => {
      console.log("An error occurred:", error);
    });
}

function updateQuote() {
  quoteContent.textContent = cars[index].content;
  authorContainer.textContent = "-" + cars[index].author;

  changeMaskPorperties();

  // Check if the current quote is in the liked quotes array
  const isLiked = likedQuotes.some(
    (quote) =>
      quote.content === cars[index].content &&
      quote.author === cars[index].author
  );
  console.log(isLiked);
  liked = isLiked;
  updateLikeButton();
}

document.body.onkeydown = async function (e) {
  if (e.key === " " || e.code === "Space" || e.keyCode === 32) {
    nextQuote();
  }
};

likeButton.addEventListener("click", function () {
  if (currentUser) {
    console.log("asdasdasd");
    if (liked) {
      // Remove the current quote index from the liked quotes array
      const likedIndex = likedQuotes.indexOf(cars[index]);
      if (likedIndex > -1) {
        likedQuotes.splice(likedIndex, 1);
      }
    } else {
      // Add the current quote index to the liked quotes array
      likedQuotes.push(cars[index]);
    }

    liked = !liked;
    updateLikeButton();

    upsertToDatabase();
  } else {
    openSignIn();
  }
});

function captureScreenshot() {
  // temporaarly remove elemnts to hide in the screenshot
  leftArrow.style.color = "transparent";
  rightArrow.style.color = "transparent";
  button.style.display = "none";
  themeButton.style.display = "none";

  const elementToCapture = document.documentElement;
  html2canvas(elementToCapture).then((canvas) => {
    const dataURL = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "screenshot.png";
    link.click();

    leftArrow.style.color = "white";
    rightArrow.style.color = "white";
    button.style.display = "block";
    themeButton.style.display = "block";
  });
}

prevButton.addEventListener("click", function () {
  if (index > 0) {
    index -= 1;
  }
  updateQuote();
});

function changeMaskPorperties() {
  // Get the computed width of mask
  var quoteWidth = quoteDecoElement.offsetWidth;
  // Get the computed height of mask
  var quoteHeight = quoteDecoElement.offsetHeight;
  // Assign the width and height of mask to quoteDeco
  maskElement.style.width = quoteWidth + "px";
  maskElement.style.height = quoteHeight + "px";
  // Get the computed left position of mask
  var decoLeft = quoteDecoElement.offsetLeft;
  // Get the computed top position of mask
  var decoTop = quoteDecoElement.offsetTop;
  // Assign the left and top positions of mask to quoteDeco
  maskElement.style.left = decoLeft + "px";
  maskElement.style.top = decoTop + "px";
}

function nextQuote() {
  if (index < cars.length - 1) {
    index += 1;
  } else {
    fetchQuotes();
  }
  updateQuote();
}

function updateLikeButton() {
  console.log("bruh");
  likeIcon.className = "bi bi-heart-fill";
  if (liked) {
    likeIcon.className = "bi bi-heart-fill";
  } else {
    likeIcon.className = "bi bi-heart";
  }
}

// Attach the resize event listener

// when site loaded
fetchQuotes();

function openTheme() {
  console.log("asasd");
}

themeButton.addEventListener("click", () => {
  colorPicker.style.display = "block";
  // themeButton.style.display = 'none';
});

themeButton.addEventListener("mousemove", () => {
  colorPicker.style.display = "block";
  // themeButton.style.display = 'none';
});

colorPicker.addEventListener("mouseleave", () => {
  colorPicker.style.display = "none";
  themeButton.style.display = "block";
});

const colorSquares = document.querySelectorAll(".color-square");
colorSquares.forEach((square) => {
  square.addEventListener("click", () => {
    const computedStyle = getComputedStyle(square);
    const backgroundColor = computedStyle.backgroundColor;

    document.body.style.backgroundColor = backgroundColor;
    signInButton.style.backgroundColor = backgroundColor;
    googleBtn.style.backgroundColor = backgroundColor;

    colorPicker.style.display = "none";
    themeButton.style.display = "block";
  });
});

// account handle
var accountInfo = {};

profileImage.addEventListener("click", async () => {
  if (currentUser == null) {
    openSignIn();
  } else {
    dropdownContent.style.display = "flex";
  }
});

function openSignIn() {
  signUpDiv.style.display = "flex";
  maskElement.style.display = "none";
  quoteContent.style.display = "none";
  authorContainer.style.display = "none";
  likeButton.style.display = "none";
}

async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });
}

async function signInWithEmail() {
  var email = document.querySelector("#emailValue").value;
  var password = document.querySelector("#passwordValue").value;

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });
  console.log(signUpError);

  if (signUpError && signUpError.message.includes("User already registered")) {
    const { user, error: signInError } = await supabase.auth.signInWithPassword(
      {
        email: email,
        password: password,
      }
    );

    console.log(signInError, email, password);
  }

  signUpDiv.style.display = "none";
  maskElement.style.display = "block";
  quoteContent.style.display = "block";
  authorContainer.style.display = "block";
  likeButton.style.display = "block";
}

supabase.auth.onAuthStateChange(async (event, session) => {
  console.log("aongus: ", event, "sus: ", session);
  currentUser = session;
  if (session) {
    getUserLikes();
    navLikeButton.style.display = "flex";
    if (session.user.user_metadata.avatar_url) {
      profileImage.src = session.user.user_metadata.avatar_url;
      profilePictureDropDown.src = session.user.user_metadata.avatar_url;
      userNameDropDown.textContent = session.user.email.split("@")[0];
    } else {
      userNameDropDown.textContent = session.user.email.split("@")[0];
      profileImage.src =
        "https://source.boringavatars.com/beam/80/" + session.user.email;
      profilePictureDropDown.src =
        "https://source.boringavatars.com/beam/80/" + session.user.email;
    }
  } else {
    profileImage.src = "user.png";
    profilePictureDropDown.src = "user.png";
  }

  if (event == "SIGNED_IN") {
    if (session.user.user_metadata.avatar_url) {
      profileImage.src = session.user.user_metadata.avatar_url;
      profilePictureDropDown.src = session.user.user_metadata.avatar_url;
    } else {
      profileImage.src =
        "https://source.boringavatars.com/beam/80/" + session.user.email;
      profilePictureDropDown.src =
        "https://source.boringavatars.com/beam/80/" + session.user.email;
    }
  }
});

async function signOut() {
  userNameDropDown.textContent = "____";
  const { error } = await supabase.auth.signOut();
  hideDropdown();
}

function hideSignIn() {
  signUpDiv.style.display = "none";
  maskElement.style.display = "block";
  quoteContent.style.display = "block";
  authorContainer.style.display = "block";
  likeButton.style.display = "block";
}

function hideLiked() {
  document.getElementById("gridWrap").style.display = "none";
  navLikeButton.style.display = "flex";
  maskElement.style.display = "block";
  quoteContent.style.display = "block";
  authorContainer.style.display = "block";
  likeButton.style.display = "block";
}

function hideDropdown() {
  dropdownContent.style.display = "none";
}

async function getUserLikes() {
  if (currentUser) {
    const { data, error } = await supabase
      .from("table")
      .select("liked_quotes")
      .eq("email", currentUser.user.email);

    if (error) {
      console.log(error);
    } else {
      console.log(data[0].liked_quotes);
      data[0].liked_quotes.forEach((element) => {
        console.log(element);
        likedQuotes.push(element);
      });
      sortLikedQuotes();
      console.log(likedQuotes);
    }
  }
}

function upsertToDatabase() {
  sortLikedQuotes();
  supabase
    .from("table")
    .upsert({
      email: currentUser.user.email,
      liked_quotes: likedQuotes,
    })
    .then((response) => {
      if (response.error) {
        console.error(response.error);
      } else {
        console.log("Upsert operation successful");
        getUserLikes();
      }
    })
    .catch((error) => {
      console.error("Error during upsert operation:", error);
    });
}

function sortLikedQuotes() {
  // Create a set of unique maps
  let uniqueMaps = new Set(likedQuotes.map(JSON.stringify));

  // Convert the set back to an array
  let uniqueMapsArray = Array.from(uniqueMaps).map(JSON.parse);

  // Print the unique maps
  uniqueMapsArray.forEach((mapItem) => {
    console.log(mapItem);
  });
  likedQuotes = uniqueMapsArray;
  console.log("sorted list: " + likedQuotes.toString());
}

async function buildLikeGrid() {
  maskElement.style.display = "none";
  quoteContent.style.display = "none";
  authorContainer.style.display = "none";
  likeButton.style.display = "none";
  navLikeButton.style.display = "none";
  document.getElementById("gridWrap").style.display = "flex";

  // Create div elements for each item in the array
  likedQuotes.forEach(function (item) {
    console.log(item);
    var div = document.createElement("div");
    var title = document.createElement("h3");
    var author = document.createElement("p");
    var contentWrap = document.createElement("div");
    contentWrap.style.padding = "20px";
    div.className = "grid-item";
    title.innerText = item.content;
    author.innerText = "-" + item.author;
    gridContainer.appendChild(div);
    div.appendChild(contentWrap);
    contentWrap.appendChild(title);
    contentWrap.appendChild(author);
    title.className = "title";
    author.className = "author";
  });
}
