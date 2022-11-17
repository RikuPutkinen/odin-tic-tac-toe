const gameBoard = (() => {
  'use strict';

  let current = ["", "", "",
                 "", "", "",
                 "", "", ""];

  return {current};

})();
// console.log(gameBoard.current)

const players = (() => {
  const Player = function(name, marker, textfield) {

    const changeName = (newName) => {
      name = newName;
      textfield.textContent = newName;
    }
    const getName = () => name;
    const getMarker = () => marker;

    return {
      changeName,
      getName,
      getMarker
    };
  }

  let p1NameBox = document.querySelector('#p1-name');
  let p2NameBox = document.querySelector('#p2-name');
  let player1 = new Player("Player 1", "X", p1NameBox);
  let player2 = new Player("Player 2", "O", p2NameBox);


  function changePlayerName(e, player) {
    let newName = prompt(`Enter the new name for ${player.getName()}`);
    if (newName) {
      player.changeName(newName);
    }
  }

  p1NameBox.addEventListener(
    'click',
    (e) => {changePlayerName(e, player1)}
  )

  p2NameBox.addEventListener(
    'click',
    (e) => {changePlayerName(e, player2)}
  )

  return {player1, player2};

})();


const displayControl = (() => {
  'use strict';

  let boxes = document.querySelectorAll('.box');
  let restartButton = document.querySelector('#restart-button');

  function update(){
    for (let i = 0; i < boxes.length; i++) {
      boxes[i].textContent = gameBoard.current[i];
      if (gameBoard.current[i] === "") boxes[i].classList.add("clickable");
      else boxes[i].classList.remove("clickable");
    }
  }

  function addBoardEvents() {  
    boxes.forEach((box) => {
      box.addEventListener(
        'click',
        game.placeMarker,
        {once: true});
    })
  }

  function removeBoardEvents() {
    boxes.forEach((box) => {
      box.removeEventListener(
        'click',
        game.placeMarker
      )
    })
  }

  function setup() {
    update();
    addBoardEvents();
    console.log("Setup done")
  }
  
  function clear() {
    gameBoard.current = ["", "", "", "", "", "", "", "", ""];
    removeBoardEvents()
    players.player1.changeName('Player 1');
    players.player2.changeName('Player 2');
    setup();
  }

  (() => {
    restartButton.addEventListener(
      'click',
      clear
    );
    })();

  return {update, setup, removeBoardEvents};

})();


const game = (() => {
  'use strict';

  let _gameOver = false;
  let turnNotifier = document.querySelector('.turn-notification');

  let _currentPlayer = players.player1;
  function changePlayer() {
    if (_gameOver) return;
    if (_currentPlayer === players.player1) _currentPlayer = players.player2;
    else _currentPlayer = players.player1;
    turnNotifier.textContent = `${_currentPlayer.getName()}'s turn`;
    //console.log(_currentPlayer);
  }

  const getCurrentPlayer = () => _currentPlayer;

  function placeMarker(e) {
    let index = e.target.attributes['data-cell'].value;
    gameBoard.current[index] = _currentPlayer.getMarker();
    console.log(gameBoard.current);
    displayControl.update();
    checkWin();
    checkTie();
    changePlayer();
  }

  function declareWinner() {
    alert(`${_currentPlayer.getName()} won!`);
    displayControl.removeBoardEvents();
  }

  function declareTie() {
    alert("It's a tie!");
    displayControl.removeBoardEvents();
  }

  function checkBoxes(box1, box2, box3) {
    return (gameBoard.current[box1] === gameBoard.current[box2] &&
            gameBoard.current[box1] === gameBoard.current[box3] &&
            gameBoard.current[box1] !== "" &&
            gameBoard.current[box2] !== "" &&
            gameBoard.current[box3] !== "") ? true : false;
  }

  const combinations = [
    // rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // columns
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // cross
    [0, 4, 8],
    [6, 4, 2]
  ]

  function checkWin() {
    combinations.forEach((combination) => {
      //console.log(checkBoxes(...combination));
      //console.log(combination);
      if (checkBoxes(...combination)) declareWinner();
    })
  }

  function checkTie() {
    let isFilled = (box) => box !== "";

    if (gameBoard.current.every(isFilled)) declareTie();
  }

  return {placeMarker, getCurrentPlayer};

})();


displayControl.setup();