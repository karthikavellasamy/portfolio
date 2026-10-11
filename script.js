
const canvas = document.getElementById("art");
const ctx = canvas.getContext("2d");

const photo = new Image();
photo.src = "images/myphoto.jpg";

let mode = 0;
let imageReady = false;

photo.onload = () => {
  imageReady = true;
  drawArt();
};

photo.onerror = () => {
  ctx.fillStyle = "#ffffff";
  ctx.font = "16px Arial";
  canvas.width = 400;
  canvas.height = 150;
  ctx.fillText(
    "Check images/myphoto.jpg",
    20, 70
  );
};

function drawArt() {
  if (!imageReady) return;

  const maxWidth = 650;
  const scale = Math.min(1, maxWidth / photo.width);

  canvas.width = Math.round(photo.width * scale);
  canvas.height = Math.round(photo.height * scale);

  ctx.drawImage(photo, 0, 0, canvas.width, canvas.height);

  const pixels = ctx.getImageData(
    0, 0, canvas.width, canvas.height
  );

  ctx.fillStyle = "#03050b";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const chars = ["0", "1", "<", ">", "/", "*", "+", "{"];
  const step = 5;

  ctx.font = "5px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let y = 0; y < canvas.height; y += step) {
    for (let x = 0; x < canvas.width; x += step) {
      const i = (y * canvas.width + x) * 4;

      const r = pixels.data[i];
      const g = pixels.data[i + 1];
      const b = pixels.data[i + 2];

      const brightness = (r + g + b) / 3;

      if (brightness < 25) continue;

      if (mode === 0) {
        ctx.fillStyle = `rgb(${r},${g},${b})`;
      } else if (mode === 1) {
        ctx.fillStyle = `rgb(0,${Math.min(255, brightness + 30)},255)`;
      } else {
        ctx.fillStyle = `rgb(255,${Math.floor(brightness * 0.5)},190)`;
      }

      const char = chars[
        Math.floor((x + y + brightness) % chars.length)
      ];

      ctx.fillText(char, x, y);
    }
  }
}

document.getElementById("change").onclick = () => {
  mode = (mode + 1) % 3;
  drawArt();
};

document.getElementById("download").onclick = () => {
  const link = document.createElement("a");
  link.download = "my-code-art.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
};
