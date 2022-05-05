const announcementBar = document.getElementById(
  "shopify-section-announcement-bar"
);
announcementBar.style.marginBottom = "10px";
announcementBar.innerHTML = `<div
      style="
        height: 35px;
        width: 100%;
        background: url();
        background: {{background}};
        margin: 0px;
        margin-bottom:10px;
        display: flex;
        position:{{position}};
        align-items: center;
        justify-content: center;
        color: {{color}};
        font-size: {{font-size}};
        font-family: {{font-family}}
          ;
      "
    >
      {{content}}
    </div>`;
