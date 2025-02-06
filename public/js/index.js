const username = document.getElementById("username");
const logoff = document.getElementById("logoff");
const artistFilter = document.getElementById("artistFilter");

artistFilter.addEventListener("dblclick", function () {
    artistFilter.value = "";
});

username.textContent = document.cookie.split("=")[1];

function logOff(event) {
    event.preventDefault();

    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    window.location.href = "/login";
}

logoff.addEventListener("click", logOff);