let section = document.getElementById("card-game");
var clickAudio = new Audio("https://cdn.freesound.org/previews/240/240776_4107740-lq.mp3");
var failedAudio = new Audio("./audio/invalid-selection-39351.mp3");
var winAudio = new Audio("./audio/win.wav")
var finalWinAudio = new Audio("./audio/finalWin.wav")
var finalLostAudio = new Audio("./audio/finalLostAudio.wav")

let randomElement = [];

let timer = document.querySelector("#timer span");
let clickStartCount = document.querySelector("#move-count span")
let totalTime=timer.textContent
let overTime = totalTime

const cardMaterials = [
  { imgSrc: "./cardgame materials/card1.png", cardName: "card1" },
  { imgSrc: "./cardgame materials/card2.png", cardName: "card2" },
  { imgSrc: "./cardgame materials/card3.png", cardName: "card3" },
  { imgSrc: "./cardgame materials/card4.png", cardName: "card4" },
  { imgSrc: "./cardgame materials/card5.png", cardName: "card5" },
  { imgSrc: "./cardgame materials/card6.png", cardName: "card6" },
  { imgSrc: "./cardgame materials/card7.png", cardName: "card7" },
  { imgSrc: "./cardgame materials/card8.png", cardName: "card8" },
  { imgSrc: "./cardgame materials/card9.png", cardName: "card9" },
  { imgSrc: "./cardgame materials/K3.png", cardName: "K3" },
  { imgSrc: "./cardgame materials/K4.png", cardName: "K4" },
];

function shuffleCards(array) {
  array.sort(() => Math.random() - 0.5);
}
shuffleCards(cardMaterials); 

function collectElementsRandomly() {
  while (randomElement.length <= 8) {
    let randomCard =
      cardMaterials[Math.floor(Math.random() * cardMaterials.length)];
    if (!randomElement.some((item) => item === randomCard)) {
      if (randomElement.length <= 7) {
        randomElement.push(randomCard);
        randomElement.push(randomCard);
      } else {
        randomElement.push(randomCard);
      }
    }
  }
}
collectElementsRandomly();

shuffleCards(randomElement);

randomElement.forEach(() => {
  let card = document.createElement("div");
  section.appendChild(card);
  card.classList.add("card");

  let front = document.createElement("div");
  card.appendChild(front);
  front.classList.add("front");
  let frontimg = document.createElement("img");
  front.appendChild(frontimg);
  frontimg.src = "./cardgame materials/main.png";
});

function updateTimer() {
    timer.innerHTML = overTime;

    if (overTime === 0) {
      clearTimeout(timerId);
      checkTime(overTime)
    } else {
      overTime--;
      timerId = setTimeout(updateTimer, 1000); 
    }
  }

  let timerId = setTimeout(updateTimer, 1000);


let cards = document.querySelectorAll(".card");
let openCards =[]
let clickCounts=0
randomElement.forEach((item, index) => {
  cards[index].addEventListener("click", function () {
    
    let back = this.querySelector(".back")
    if(!back  && openCards.length < 2 && overTime!==0 && disappearedCard>0){
        clickAudio.play();
        clickCounts++;
        clickStartCount.innerHTML=clickCounts;
     back = document.createElement("div");
    this.appendChild(back); // 
    let backimg = document.createElement("img");
    back.appendChild(backimg);
    backimg.src = item.imgSrc;
    back.classList.add("back");
    this.classList.add("toggled");
    openCards.push({ cardElement: this, cardName: item.cardName });
   

if( openCards.length===2){
    setTimeout(() => checkCards(openCards), 1000);
}
}
  });
});

let matchedCards=0
let disappearedCard=9
function checkCards(openCards){
    if(openCards[0].cardName===openCards[1].cardName )
       {
        winAudio.play();
        openCards.forEach((item) => {item.cardElement.classList.add("disappearing-div"); });
        matchedCards+=2;
        disappearedCard-=2;
        checkWin(matchedCards, disappearedCard);
       }

    else{
        failedAudio.play();
        openCards.forEach((item) => {
            setTimeout(() => {
                item.cardElement.classList.remove("toggled");
              },400); 
               
       let dlte = item.cardElement.childNodes[1];
       setTimeout(() => {
        item.cardElement.removeChild(dlte);
         }, 1000); 
       }
       ); 

    }
        openCards.length=0;        
}

function checkTime(overTime){
    if(overTime===0){
      //  alert("Time's up! You lost.");
        let header = document.createElement("h1")
        header.textContent="Time's up! You lost."
        header.style.color="rgb(202, 95, 23)"
        let winConfetti=document.createElement("img");
        winConfetti.src="https://media.tenor.com/Lhlq72-SMvYAAAAM/lost-the.gif"
        winConfetti.classList.add("win-confetti")

        let scoreTable = document.createElement("table")
        scoreTable.innerHTML=`<tbody class="score-table"><tr>
        <th>Rank:</th>
        <th>Moves:</th>
        <th>Time:</th>
        
      </tr>
      <tr>
        <td>💩</td>
      
        <td>${clickCounts}</td>
        <td>over</td>
        </tr>
      </tbody>`

        setTimeout(() =>{showResult(header, winConfetti,scoreTable)},1000) 
        finalLostAudio.play();
        return false;
    }
}


function checkWin(matchedCards, disappearedCard) {

    if(!checkTime(overTime)){
    if (matchedCards === 8 || disappearedCard === 1) {
     //   alert("You WIN!");
        clearTimeout(timerId)
        let header = document.createElement("h1")
        header.textContent="You WIN!"
        header.style.color="rgb(202, 95, 23)"
        let winConfetti=document.createElement("img");
        winConfetti.src="https://usagif.com/wp-content/uploads/gif/confetti-29.gif"
        finalWinAudio.play()
        
        let scoreTable = document.createElement("table")
        scoreTable.innerHTML=`<tbody class="score-table"><tr>
        <th>Rank:</th>
        <th>Moves:</th>
        <th>Time:</th>
        
      </tr>
      <tr>
        <td>🥇</td>
      
        <td>${clickCounts}</td>
        <td>${totalTime-overTime-1}</td>
        </tr>
      </tbody>`
       setTimeout(() =>{showResult(header, winConfetti,scoreTable)},1000) 
    } }
}


function showResult(result, giph,scoreTable){
    let gameResult =  document.querySelector("#result")

    let showResults = gameResult.querySelector(".show-result")
    showResults.appendChild(result)
    showResults.appendChild(giph)
    let retryButton = document.createElement("button")
    retryButton.textContent="Retry"

    showResults.appendChild(scoreTable)
    showResults.appendChild(retryButton)
    retryButton.classList.add("retry-game")

    gameResult.style.visibility="visible";

}

document.addEventListener('DOMContentLoaded', function () {
    let gameResult =  document.querySelector("#result")
    gameResult.addEventListener("click", function(){
    window.location.reload();
    document.querySelector("#result").style.visibility="hidden";
})

})