let X = 60;
let Y = 90;
let dense = .7;
let matrix = [];
const grid = document.getElementById('grid').children;
const fillBar = document.getElementById('fill');
const pathBar = document.getElementById('pathBar');

let visitedNode = 0;
let pathNode = 0;
generateGrid()
generateMaze()
draw(-1)


let timeDelay = 20;

let pathColor = '#f4a'
let visitedColor = '#000'

function changeVisitedColor(val){
    visitedColor = val
}
function changePathColor(val){
    pathColor = val
}

const generatenNewMaze = () => {
    X = +document.getElementById('xCord').value;
    Y = +document.getElementById('yCord').value;
    dense = 1 - document.getElementById('dense').value / 100;
    generateGrid()
    generateMaze()
    draw(-1)
}

function generateGrid() {
    document.getElementById('grid').innerHTML = ''
    for (let y = 0; y < Y; y++) {
        const node = document.createElement('p');
        document.getElementById('grid').appendChild(node);
        for (let x = 0; x < X; x++) {
            const node = document.createElement('span');
            node.setAttribute('cord', `${x} ${y}`)
            document.getElementById('grid').children[y].appendChild(node);
        }
    }
}

function generateMaze() {
    matrix = [];
    for (let y = 0; y < Y; y++) {
        matrix.push([]);
        for (let x = 0; x < X; x++) {
            matrix[y].push(Math.random() > dense ? -1 : 0)
        }
    }
}

function draw(stackPos) {
    for (let y = 0; y < Y; y++) {
        for (let x = 0; x < X; x++) {
            const elem = grid[y].children[x];
            if (!matrix[y][x])
                elem.style.background = '#000';
            else if (matrix[y][x] < 0)
                elem.style.background = '#fff';
            else if (matrix[y][x] <= stackPos)
                elem.style.background = pathColor;
            else {
                matrix[y][x] = Number.POSITIVE_INFINITY
                elem.style.background = visitedColor;
            }
        }
    }

}



let final = null;
async function dfs(start) {
    const stack = [];
    stack.push(start);
    colorNode(stack[0], 1)
    while (stack.length) {
        const curr = stack.pop();
        pathNode = stack.length
        if (await process(curr, stack.length + 1)) break;
        getChild(curr).forEach(child => stack.push(child));
    }
    // draw(stack.length)
}

async function process(currNode, stackPos) {
    colorNode(currNode, stackPos)
    const height = ((visitedNode / (X * Y)) * 100 / dense) + '%'
    fillBar.style.height = height
    const pathHeight = ((pathNode / (X * Y)) * 100 / dense) + '%'
    pathBar.style.height = pathHeight
    // wait 0 for giving time to reder queue
    await new Promise((r, _r) => { setTimeout(r, timeDelay) });
    draw(stackPos);
    if (currNode.x == final.x && currNode.y == final.y) {
        //if(currNode.y==final.y){
        pathColor = '#0f0'
        draw(stackPos);
        return true;
    }
    return false;
}

function getChild({ x, y }) {
    let res = [];
    if (y && !matrix[y - 1][x]) res.push({ x: x, y: y - 1 })
    if (x && !matrix[y][x - 1]) res.push({ x: x - 1, y: y })
    if (Math.random() > .5) {
        if (y < Y - 1 && !matrix[y + 1][x]) res.push({ x: x, y: y + 1 })
        if (x < X - 1 && !matrix[y][x + 1]) res.push({ x: x + 1, y: y })
    }
    else {
        if (x < X - 1 && !matrix[y][x + 1]) res.push({ x: x + 1, y: y })
        if (y < Y - 1 && !matrix[y + 1][x]) res.push({ x: x, y: y + 1 })
    }
    return res
}

function colorNode(node, stackPos) {
    matrix[node.y][node.x] = stackPos;
    visitedNode++;
    
}


let start = null;
document.getElementById('grid').addEventListener('click', e => {
    const [x, y] = e.target.getAttribute('cord').split(' ').map(e => +e);
    if(matrix[y][x]) return;
    if(final){
       window.location.reload()
    }
    else if (!start) {
        var dm = document.getElementById('startTag');
        dm.style.top = event.pageY - 25 + 'px';
        dm.style.left = event.pageX - 10 +'px';
        dm.style.display = 'block'
        start = { x, y };
        document.getElementsByClassName('inst')[0].innerHTML = 'Choose final'
    }
    else {
        final = { x, y }
        var dm = document.getElementById('endTag');
        dm.style.top = event.pageY - 18 + 'px';
        dm.style.display = 'block'
        dm.style.left = event.pageX - 10 +'px';
        dfs(start)
        document.getElementsByClassName('inst')[0].innerHTML = 'Choose start'
        start = null;
    }
})




function rangeSlide(value) {
    timeDelay = 100 - value;
}




//document.getElementById('grid').ond

