//Class to define a playing card and it's properties
class Cards {
    value;
    suit;
    flipFlag;

    constructor(value, suit){
        this.value = value;
        this.suit = suit;
        this.flipFlag = false;
    }
    get value() {
        return this.value;
    }
    get suit() {
        return this.suit;
    }
    get id() {
       return  this.value + "_of_" + this.suit;
    }
    get link() {
        if(this.flipFlag){
            return "Playing Cards/Back.png";
        }
        return "Playing Cards/" + this.value + "_of_" + this.getSuit(this.suit) + ".png";
    }
    getSuit(suit) {
        if (suit == 0) {
            return "hearts";
        } else if (suit == 1) {
            return "diamonds";
        } else if (suit == 2) {
            return "clubs";
        } else if (suit == 3) {
            return "spades";
        }
    }
    flip(){
        this.flipFlag = !this.flipFlag;
    }
}
        
        
    //For setting up the board. Placing cards, randomizing their order, etc.
function setGame() {
let initialStack = []
for (let suit = 0; suit < 4; suit++) {
    for (let value = 1; value <= 13; value++) {
        let card = new Cards(value, suit);
        initialStack.push(card);
        }
    }
    //Randomizes the order of the cards
    randomizer(initialStack);

    //Places the cards on the board in their correct initial spot
    let temp = 0;
    for (let i = (initialStack.length -1); i >= 0; i--) {
        if (i >= 28) {
            initialStack[i].flip();
            placeCard(initialStack[i], "stack");
        } else if (i == 27) {
            placeCard(initialStack[i], "column0");
        } else if (i >= 25) {
            if(i != 25){
                initialStack[i].flip();
            }
            addToColumn(initialStack[i], "column1");
        } else if (i >= 22) {
            if(i != 22){
                initialStack[i].flip();
            }
            addToColumn(initialStack[i], "column2");
        } else if (i >= 18) {
            if(i != 18){
                initialStack[i].flip();
            }
            addToColumn(initialStack[i], "column3");
        } else if (i >= 13) {
            if(i != 13){
                initialStack[i].flip();
            }
            addToColumn(initialStack[i], "column4");
        } else if (i >= 7) {
            if(i != 7){
                initialStack[i].flip();
            }
            addToColumn(initialStack[i], "column5");
        } else if (i >= 0) {
            if(i != 0){
                initialStack[i].flip();
            }
            addToColumn(initialStack[i], "column6");
        }
    }
}
//base for clicking on a card
let firstClickFlag = false;
var moving;
function clickHandler(){
        if(!firstClickFlag){//first card clicked, highlights it
        this.classList.toggle("highlight")
        let moving = getCardObj(this);
        firstClickFlag = !firstClickFlag;
        }
        else{
        let temp = this;
        if(temp.parentNode)
        location = 
        addToColumn(moving,)
    }
    
}

function whereCanPlace(card) {
    let placeArray = [];  //array of divs

    //Bellow if statements are for the card foundations at the top right of the board
    if (document.getElementById("heart_back").lastChild.id == undefined && card.id == "1_of_0") { //for aces
        placeArray.push(document.getElementById("heart_back").id);
    } else if (document.getElementById("diamond_back").lastChild.id == undefined && card.id == "1_of_1") {
        placeArray.push(document.getElementById("diamond_back").id);
    } else if (document.getElementById("club_back").lastChild.id == undefined && card.id == "1_of_2") {
        placeArray.push(document.getElementById("club_back").id);
    } else if (document.getElementById("spade_back").lastChild.id == undefined && card.id == "1_of_3") {
        placeArray.push(document.getElementById("spade_back").id);
    }  //for the rest of the cards
    else if (document.getElementById("heart_back").lastChild.id != undefined && canPlaceFoundation(card, getCardObj(document.getElementById("heart_back").lastChild))) {
        placeArray.push(document.getElementById("heart_back").lastChild.id);
    } else if (document.getElementById("diamond_back").lastChild.id != undefined && canPlaceFoundation(card, getCardObj(document.getElementById("diamond_back").lastChild))) {
        placeArray.push(document.getElementById("diamond_back").lastChild.id);
    } else if (document.getElementById("club_back").lastChild.id != undefined && canPlaceFoundation(card, getCardObj(document.getElementById("club_back").lastChild))) {
        placeArray.push(document.getElementById("club_back").lastChild.id);
    } else if (document.getElementById("spade_back").lastChild.id != undefined && canPlaceFoundation(card, getCardObj(document.getElementById("spade_back").lastChild))) {
        placeArray.push(document.getElementById("spade_back").lastChild.id);
    } 
    else { //This one is for the columns and kings
        for (let i = 0; i < 7; i++) {
            let columnCard = document.getElementById("column" + i).lastChild

            if (columnCard != null && canPlaceColumn(card, getCardObj(columnCard))) //for regular cards
                placeArray.push(columnCard.id);
            else if (columnCard == null && card == 13) {  //for kings
                placeArray.push(getElementById("column" + i).id);
            }
        } 
    }
}

function getCardObj(cardDiv) {
    let cardObj = JSON.parse(cardDiv.firstChild.innerText);
    cardObj.__proto__ = Cards.prototype;
    return cardObj;
}

function canPlaceColumn(cardTop, cardBottom) {
    let tempSuit;  //This makes it so we are checking for the same suit as the cardBottom suit
    if (cardTop.suit <= 1) {  //if 1 or 0 then add two to make it either 3 or 2
        tempSuit = cardTop.suit + 2;
    } else {
        tempSuit = cardTop.suit - 2;  //if 2 or 3 then subtract 2 to make it either 0 or 1
    }

    if (cardTop.value + 1 == cardBottom.value && tempSuit == cardBottom.suit) {
        return true;
    } else {
        return false;
    }
}

function canPlaceFoundation(cardTop, cardBottom) {
let tempSuit;  //This makes it so we are checking for the same suit as the cardBottom suit
if (cardTop.value - 1 == cardBottom.value && cardTop.suit == cardBottom.suit) {
return true;
} else {
return false;
}
} //Places a card in the column. Places it in the correct position away from the other card under it
function addToColumn(card, location) {
    let shift = 3.3;
    if (document.getElementById(location).childNodes.length == 0){
        placeCard(card, location);
    } else {
        placeCard(card, location);
        shiftDown(card.id, (Math.ceil(parseInt(window.getComputedStyle(document.getElementById(location).childNodes[document.getElementById(location).childNodes.length - 2])["top"])/parseInt(window.getComputedStyle(document.getElementById("board"))["height"]) * 10000) + shift * 100) / 100);
    }
}


function placeCard(card, location){
    let domCard = document.createElement("div");
    domCard.id = card.id;
    domCard.classList.add("card");
    document.getElementById(location).append(domCard);

    let cardObj = document.createElement("span");
    cardObj.style.display = "none";
    cardObj.innerText =  JSON.stringify(card);
    document.getElementById(domCard.id).append(cardObj);

    let img = document.createElement("img");
    img.src = card.link;
    img.style.width = "100%";
    document.getElementById(card.id).appendChild(img);
    document.getElementById(card.id).addEventListener("click",clickHandler);
}
 //For moving a card down a specific amount
function shiftDown(item, amount) {
    document.getElementById(item).style.top = (Math.ceil(parseInt(window.getComputedStyle(document.getElementById(item))["top"])/parseInt(window.getComputedStyle(document.getElementById("board"))["height"]) * 100) + amount) + "%";
}
 //Script for randomizing the order of any array
function randomizer(array){
    for (let i = 0; i < array.length; i++) {
        let temp = Math.floor(Math.random() * (array.length));
        [array[temp], array[i]] = [array[i], array[temp]];
    }
}