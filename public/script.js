const url = new URL(
  "https://fonts.googleapis.com/css2?family=Dancing+Script&family=Lobster&family=Macondo&family=Merriweather:wght@300&family=Open+Sans:wght@300&family=Pacifico&family=Permanent+Marker&family=Roboto&family=Roboto+Mono:wght@200&family=Skranji&family=Smokum&family=Zen+Loop&display=swap"
);
const announcementBar = document.getElementById(
  "shopify-section-announcement-bar"
);
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
        font-family: 'Lobster', cursive;
          
      "
    >
      {{content}}
    </div>`;
