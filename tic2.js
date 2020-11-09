var oriPapan;
const orang = "O";
const AI = "X";
const kombinasi = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
]

const cells = document.querySelectorAll('.cell');
mulai();

function mulai(){
    document.querySelector(".end").style.display = "none";
    oriPapan = Array.from(Array(9).keys());
    for(var i = 0; i < cells.length; i++){
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
}
function turnClick(square) {
    if (typeof oriPapan[square.target.id] == 'number') {
        turn(square.target.id, orang)
    if (!cekImbang(oriPapan, orang) && !cekImbang()) turn(bestSpot(), AI);
    }
}
function turn(squareId, pemain) {
    oriPapan[squareId] = pemain;
    document.getElementById(squareId).innerText = pemain;
    let menang = cekMenang(oriPapan, pemain)
    if (menang) selesai(menang)
}

function cekMenang(papan, pemain){
    let main = papan.reduce((a, e, i) =>
    (e === pemain) ? a.concat(i) : a, []);
    let menang = null;
    for (let [index, win] of kombinasi.entries()){
        if (win.every(elem => main.indexOf(elem) > -1)) {
            menang = {index: index, pemain: pemain};
            break; 
        }
    }
    return menang;
}

function selesai(menang) {
    for (let index of kombinasi[menang.index]){
        document.getElementById(index).style.backgroundColor =
        menang.pemain == orang ? "green" : "blue";
    }
    for (var i = 0; i < cells; i++){
        cells[i].removeEventListener('click', turnClick. false);
    }
    hasil(menang.pemain == orang ? "Kamu menang" : "Kamu kalah");
}

function hasil(siapa){
    document.querySelector(".end").style.display = "block";
    document.querySelector(".end .text").innerText = siapa;
}

function kosong(){
    return oriPapan.filter(s => typeof s == 'number');
}

function bestSpot() {
    return minimax(oriPapan, AI).index;
}

function cekImbang(){
    if (kosong().length == 0){
        for (var i = 0; i < cells.length; i++){
            cells[i].style.backgroundColor = "red";
            cells[i].removeEventListener('click', turnClick, false);
        }
        hasil("SERI!")
        return true;
    }
    return false;
}

function minimax(papanBaru, pemain){
    var availSpots = kosong();

    if(cekMenang(papanBaru, orang)){
        return{score: -10};
    } else if (cekMenang(papanBaru, AI)){
        return{score: 20};
    } else if(availSpots.length === 0){
        return{score: 0};
    }
    var moves = [];
    for (var i = 0; i < availSpots.length; i++){
        var move = {};
        move.index = papanBaru[availSpots[i]];
        papanBaru[availSpots[i]] = pemain;

        if (pemain == AI) {
            var result = minimax (papanBaru, orang);
            move.score = result.score;
        } else {
            var result = minimax(papanBaru, AI);
            move.score = result.score;
        }

        papanBaru[availSpots[i]] = move.index;

        moves.push(move);
    }

    var bestMove;
    if (pemain === AI) {
        var bestScore = -1000;
        for (var i=0; i < moves.length; i++) {
            if(moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }else {
        var bestScore = 1000
        for (var i=0; i<moves.length; i++){
            if(moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove];
}