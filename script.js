const wrapper = document.getElementById('wrapper');
let count, selected, interval, disco;
let canRegenerate = true;
const elSize = 85;

function prepare() {
  const gap = 10;
  const padding = 10;
  const elInLine = Math.floor((document.body.clientWidth - padding * 2) / (elSize + gap));
  const elInRow = Math.floor((document.body.clientHeight - padding * 2) / (elSize + gap));
  count = Array.from(Array(elInLine * elInRow).keys());
}

function generate() {
  count.forEach((idx) => {
    const color = getRandomColor();
    const text = document.createElement('span');
    text.innerHTML = idx === 0 ? '🪩' : color;
    text.classList.add('hex');
    const block = document.createElement('div');
    block.classList.add('color');
    block.setAttribute('hex', color);
    block.style.background = color;
    block.style.width = elSize + 'px';
    block.style.height = elSize + 'px';
    block.onclick = (event) => idx === 0 ? toggleDisco() : copyColor(event);
    block.onmouseenter = () => {
      block.classList.add('hovered');
      selected = block;
    };
    block.onmouseleave = () => block.classList.remove('hovered');
    block.append(text);
    wrapper.append(block);
  });
}

function generatePastelHexColor() {
  let color = '#';
  for (let i = 0; i < 3; i++) {
    let pastelValue = Math.floor(Math.random() * 128) + 128;
    let hexValue = pastelValue.toString(16);
    color += hexValue;
  }
  return color;
}

function getRandomSoftPastelColor() {
  const letters = '3456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * letters.length)];
  }
  return color;
}

function getRandomColor() {
  return Math.random() <= 0.7 ? getRandomSoftPastelColor() : generatePastelHexColor();
}

function copyColor(event) {
  const hex = event.target.getAttribute('hex');
  navigator.clipboard.writeText(hex.toUpperCase());
}

function regenerate() {
  wrapper.childNodes.forEach((node, idx) => {
    setTimeout(() => {
      const color = getRandomColor();
      const text = node.childNodes[0];
      text.innerHTML = idx === 0 ? text.innerHTML : disco ? '' : color;
      node.setAttribute('hex', color);
      node.style.background = color;
    }, (disco ? Math.random() * 2 : 1.1) * idx);
  });
}

function toggleDisco() {
  if (interval) {
    clearInterval(interval);
    disco = false;
    interval = null;
    regenerate();
    wrapper.classList.remove('disco');
  } else {
    disco = true;
    wrapper.classList.add('disco');
    interval = setInterval(() => regenerate(), 250);
  }
}

window.onkeydown = () => {
  if (!canRegenerate) return;
  canRegenerate = false;
  regenerate();
};

window.onkeyup = () => {
  canRegenerate = true;
};

window.ontouchstart = (event) => {
  if (event.touches?.length >= 2 && canRegenerate) {
    regenerate();
    selected?.classList?.remove('hovered');
  }
};

prepare();
generate();
