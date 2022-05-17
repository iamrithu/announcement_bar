const announcementBar = document.getElementById(
  "shopify-section-announcement-bar"
);
const style = document.getElementsByTagName("style")[0];

style.textContent += `@import url('https://fonts.googleapis.com/css2?family=Zen+Loop&display=swap');');

`;
announcementBar.style.marginBottom = "10px";
announcementBar.innerHTML = `<div
      style="
        height: 35px;
        width: 100%;
        background: url();
        background:{{background}};
        margin: 0px;
        margin-bottom:10px;
        display: flex;
        position:{{position}};
        align-items: center;
        justify-content: center;
        color: {{color}};
        font-size: {{font-size}};
       font-family: 'Zen Loop', cursive;
      "
    >
      {{content}}
    </div>`;
