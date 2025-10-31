const letterWidth = 5;
const letterHeight = 7;
let startHeight = '';
var cols;
var rows;
var flickering = [];

const poem = [
  "TRAVELING WITH A SUITCASE FILLED WITH THE THINGS YOU LEFT IN YOUR PARENTS' BASEMENT",
  "UNPACKING YOURSELF ON THE TRAIN",
  "PASSENGERS PASS AROUND PIECES OF YOUR PAST",
  "YOU MISS YOUR STOP.",
  "THE TRAINS ARRIVE AND THE ANNOUNCEMENTS GROW LONGER EACH TIME",
  "LAY BACK AND WATCH THE GRAFFITI TWINKLE ON THE TUNNEL WALLS",
  "THE SOLDIERS MULTIPLY IN THE WINDOWS' REFLECTIONS AND THEY SMILE AT YOU",
  "YOU LOOK AT ME AND TELL ME YOU DON'T KNOW WHO I AM BUT IT IS A PLEASURE TO MEET YOU, STRANGER.",
  "I TAKE YOU HOME. I RIDE THE RAILS TO PASS THE TIME.",
  "I MAKE FRIENDS WITH THE OTHER KIDS AND NO ONE ASKS WHERE WE'RE GOING.",
  "I GET OFF AT THE NEXT STOP BECAUSE MY CLOTHES START TO UNRAVEL",
  "YOU SLEEP ALL AFTERNOON TO REMEMBER WHO I AM.",
  "",
]

let f1 = false;
let f2 = false;
let f3 = false;
let f1f = 0;

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

$(() => {
    startHeight = window.innerHeight;
    updateGrid();
    window.addEventListener('resize', updateGrid);
});

fuckShitUp = () => {
  let fuckUp = Math.floor(Math.random() * (3) + 1);

  switch (fuckUp) {
    case 1:
      f1 = true;
      break;
    case 2:
      f2 = true;
      break;
    case 3:
      f3 = true;
      break;
  }
}

// Function to generate the grid of circles
async function generateGrid(circleRadius) {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';

  // Calculate dimensions of the SVG container
  grid.setAttribute('width', circleRadius * 2 * cols);
  grid.setAttribute('height', circleRadius * 2 * rows);

  // Generate grid
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', circleRadius * (2 * j + 1));
        circle.setAttribute('cy', circleRadius * (2 * i + 1));
        circle.setAttribute('r', circleRadius);
        circle.setAttribute('id', `${j}_${rows - i - 1}`);
        circle.setAttribute('fill', '#303030');
        circle.setAttribute('stroke', '#606060');
        circle.setAttribute('stroke-width', 0.3);
        grid.appendChild(circle);
    }
  }

  for (line of poem) {
    writePoetry(line, circleRadius);

    let threshold = Math.floor(Math.random() * 10);

    if (threshold >= 8) { fuckShitUp(); }

    await sleep(8000);
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const currentCircle = document.getElementById(`${j}_${rows - i - 1}`);
        currentCircle.setAttribute('fill', '#303030');
        currentCircle.setAttribute('stroke', '#606060');
        currentCircle.setAttribute('stroke-width', 0.3);
      }
    }
  }
  generateGrid(circleRadius);
}

resetGrid = (circleRadius) => {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const currentCircle = document.getElementById(`${j}_${rows - i - 1}`);
      currentCircle.setAttribute('fill', '#303030');
      currentCircle.setAttribute('stroke', '#606060');
      currentCircle.setAttribute('stroke-width', 0.3);
    }
  }
}

// Function to update grid on window resize
updateGrid = () => {
  let circleRadius;

  if (window.innerWidth >= 1200) { circleRadius = 3.0; }
  else if (window.innerWidth >= 992) { circleRadius = 2.5; }
  else if (window.innerWidth >= 768) { circleRadius = 2.0; }
  else if (window.innerWidth >= 576) { circleRadius = 1.5; }
  else { circleRadius = 1.0; }

  rows = Math.floor(document.getElementById('grid').scrollHeight / (circleRadius * 2));
  cols = Math.floor((window.innerWidth * 0.75) / (circleRadius * 2));

  let tone = ((1 - (window.innerHeight / startHeight)) * 120).toString(10);
  document.getElementById('grid').style.background = `rgb(${tone}%,${tone}%,${tone}%)`;

  generateGrid(circleRadius);

  if ((window.innerWidth / window.screen.width) <= 0.35) {
    flickering.push(setInterval(flicker, Math.random() * 1000));
  }
  if ((window.innerWidth * 0.75) > 800) {
    for (id of flickering) { clearInterval(id);}
  }
}

// Function to select random lights and turn them proportionally gray, relative to their color
flicker = () => {
    let x = Math.floor(Math.random() * cols);
    let y = Math.floor(Math.random() * rows);

    let circle = document.getElementById(`${x}_${y}`);
    let color = hexToHSL(circle.attributes.getNamedItem('fill').value);
    circle.setAttribute('fill', color);
}

writePoetry = (line, circleRadius) => {
  let charCount = line.length;
  let lineCount = 0;
  const leading = 10;
  let perLine = Math.floor(cols / (letterWidth + 1)) + 1;

  let lines = Math.ceil(charCount / perLine);

  let buffer = Math.floor((rows - (lines * letterHeight)) / 2);

  for (i = 0; i < charCount; i++) {
    let letter = alphabet[line[i]];
    let points = letter.length;

    // if at end of line, move to next
    if (i % perLine + 1 == perLine) {
      lineCount = lineCount + letterHeight + leading;
    }

    for (j = 0; j < points; j++) {
        let point = letter[j].split(',');
        let x = (parseInt(point[0]) + (letterWidth * i) + i) % cols;

        if (f1) { f1f = j; }
        else if (f2) { f1f = -15; }
        else if (f3) { f1f = j / 5; }

        let y = rows - letterHeight + parseInt(point[1]) - lineCount - buffer + leading + f1f;

        let circle = document.getElementById(`${x}_${y}`);
        
        if (circle == null) { break; }

        let fill = '';
        if (parseInt(point[1]) < 2) { fill = '#73A078'; } 
        else if (parseInt(point[1]) < 5) { fill = '#C8826E'; }
        else { fill = '#BE6973'; }
        circle.setAttribute('fill', fill);
        circle.setAttribute('stroke', '#FFFFFF')
    }
  }
  f1 = false;
  f2 = false;
  f3 = false;
  f1f = 0;
}

// function from https://css-tricks.com/converting-color-spaces-in-javascript/
// this is neither my job nor my schooling so i will use the resources available to me!
// modified slightly for fun
// i am free!
hexToHSL = (H) => {
    // Convert hex to RGB first
    let r = 0, g = 0, b = 0;
    r = "0x" + H[1] + H[2];
    g = "0x" + H[3] + H[4];
    b = "0x" + H[5] + H[6];

    // Then to HSL
    r /= 255;
    g /= 255;
    b /= 255;
    let cmin = Math.min(r,g,b),
        cmax = Math.max(r,g,b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;
  
    if (delta == 0)
      h = 0;
    else if (cmax == r)
      h = ((g - b) / delta) % 6;
    else if (cmax == g)
      h = (b - r) / delta + 2;
    else
      h = (r - g) / delta + 4;
  
    h = Math.round(h * 60);
  
    if (h < 0)
      h += 360;
  
    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    l *= 2;
  
    return `hsl(${h},${s}%,${l}%)`;
}