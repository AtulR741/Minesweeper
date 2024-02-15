let main = document.getElementById('main');
let flag = document.getElementById('flag');
let msg = document.getElementById('msg');
let reset = document.getElementById('reset');
let Elements = [];
let firstClick;
let gameOver;
let flags;
let total;
let height = 14, width = 15;

for(let i = 0; i < height*width; i++)
{
    const html = `<img class = 'box' id = 'box${i}' src = 'Closed_Box.png' height="50px">`;
    main.insertAdjacentHTML('beforeend', html);
    Elements.push(document.getElementById(`box${i}`));
}
for(let i = 0; i < height*width; i++)
{
    let row = Math.floor(i/width), col = i % width;
    let temp = 20 + 50*row;
    Elements[i].style.top = temp + 'px';
    temp = 390 + 50*col;
    Elements[i].style.left = temp + 'px';
}

let bombs = [], visited = [], values = [];
let dim = [[0, 1], [0, -1], [1, 0], [1, 1], [1, -1], [-1, 0], [-1, 1], [-1, -1]];

function valid(row, col) {
    if(row < 0 || col < 0 || row >= height || col >= width)
        return false;
    return true;
}
function check(i, j) {
    for(let k = 0; k < 8; k++)
    {
        let row = i + dim[k][0], col = j + dim[k][1];
        if(valid(row, col) && bombs[row][col])
            return false;
    }
    return true;
}
function complete(i, j) {
    let temp = 0;
    for(let k = 0; k < 8; k++)
    {
        let row = i + dim[k][0], col = j + dim[k][1];
        if(valid(row, col) && visited[row][col] == -1)
            temp++;
    }
    if(temp == values[i][j])
        return true;
    return false;
}

function expand(i, j) {
    if(gameOver || visited[i][j] == -1)
        return;
    if(visited[i][j] == 1)
    {
        if(complete(i, j))
        {
            for(let k = 0; k < 8; k++)
            {
                let row = i + dim[k][0], col = j + dim[k][1];
                if(valid(row, col) && !visited[row][col])
                    expand(row, col);
            }
        }
        return;
    }
    let num = width*i + j;
    if(bombs[i][j])
    {
        for(let I = 0; I < height; I++)
        {
            for(let J = 0; J < width; J++)
            {
                if(bombs[I][J] && !visited[I][J])
                    Elements[width*I + J].src = 'blast.gif';
                else if(visited[I][J] == -1 && !bombs[I][J])
                    Elements[width*I + J].src = 'cross.png';
            }
        }
        gameOver = true;
        msg.textContent = 'Game Over!!!';
        setTimeout(function() {
            if(!gameOver)
                return;
            for(let I = 0; I < height; I++)
                for(let J = 0; J < width; J++)
                    if(bombs[I][J] && !visited[I][J])
                        Elements[width*I + J].src = 'black.png';
        }, 4200);
        return;
    }
    if(firstClick)
    {
        firstClick = 0;
        let limit = 35;
        while(limit)
        {
            for(let I = 0; I < height; I++)
            {
                if(!limit)
                    break;
                for(let J = 0; J < width; J++)
                {
                    if(!limit)
                        break;
                    if(Math.abs(i - I) <= 2 && Math.abs(j - J) <= 2)
                        continue;
                    let r = Math.trunc(Math.random() * 100);
                    if(!r && !bombs[I][J])
                        {
                            limit--;
                            bombs[I][J] = 1;
                        }
                    }
                }
            }
            for(let I = 0; I < height; I++)
            {
                for(let J = 0; J < width; J++)
                {
                    let temp = 0;
                    for(let k = 0; k < 8; k++)
                    {
                        let row = I + dim[k][0], col = J + dim[k][1];
                        if(valid(row, col) && bombs[row][col] == 1)
                            temp++;
                    }
                    values[I][J] = temp;
                }
            }
        }
        visited[i][j] = 1;
        total++;
        document.getElementById(`box${num}`).src = `${values[i][j]}.png`;
        if(total == width*height - 35)
        {
            gameOver = true;
            msg.textContent = 'You Win!!!';
            return;
        }
        if(check(i, j))
        {
            for(let k = 0; k < 8; k++)
            {
                let row = i + dim[k][0], col = j + dim[k][1];
                if(valid(row, col) && !visited[row][col])
                    expand(row, col);
            }
        }
    }

function flagIt(ev, i, j) {
    ev.preventDefault();
    if(gameOver || visited[i][j] == 1)
        return;
    let num = i*width + j;
    if(!visited[i][j])
    {
        flags--;
        document.getElementById(`box${num}`).src = 'flag.gif';
        visited[i][j] = -1;
    }
    else
    {
        flags++;
        document.getElementById(`box${num}`).src = 'Closed_Box.png';
        visited[i][j] = 0;
    }
    flag.textContent = flags;
}

for(let index = 0; index < width*height; index++)
{
    function final() {
        return expand(Math.trunc(index/width), index%width);
    }
    function final2(ev) {
        return flagIt(ev, Math.trunc(index/width), index%width);
    }
    Elements[index].addEventListener('click', final);
    Elements[index].addEventListener('contextmenu', final2);
}

function init() {
    firstClick = 1;
    gameOver = false;
    flags = 35;
    total = 0;
    msg.textContent = '';
    flag.textContent = '35';

    for(let i = 0; i < width*height; i++)
        Elements[i].src = 'Closed_Box.png';

    bombs.splice(0, height);
    visited.splice(0, height);
    values.splice(0, height);
    
    for(let i = 0; i < height; i++)
    {
        let temp = [];
        for(let j = 0; j < width; j++)
            temp.push(0);
        bombs.push(temp);
        visited.push(temp.slice());
        values.push(temp.slice());
    }
}
reset.addEventListener('click', init);
init();
console.log(bombs);
console.log(values);