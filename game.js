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

    //Adds event listeners to specific divs
    for (let i = 0; i < 7; i++) {
        document.getElementById("column" + i).addEventListener("click",clickHandlerCards);
    }
    // document.getElementById("heart_back").lastElementChild.addEventListener("click",clickHandler);
    // document.getElementById("diamond_back").addEventListener("click",clickHandler);
    // document.getElementById("club_back").addEventListener("click",clickHandler);
    // document.getElementById("spade_back").addEventListener("click",clickHandler);
    document.getElementById("redo").addEventListener("click",clickHandlerRedo);
}

//base for clicking on a card
let firstClickFlag = false;
var movingDiv;

function clickHandlerCards(){
    let arr;
    let wasNull;
    if (this.parentNode.id == "stack") {
        let temp = this;
        
        flipCard(getCardObj(this));
        removeCard(this);
        placeCard(getCardObj(temp), "showStack");
    } else {
        if(!firstClickFlag){//sets movingDiv and the first click flag, checking takes place after the else condiditon
            if (this.id.substring(0,6) != "column" && this.lastChild.src != "Playing Cards/Back.png") {
                console.log("if statement ran");
                movingDiv = this;
                arr = whereCanPlace(getCardObj(movingDiv));
                if (arr.length == 0) {  //For is the user clicks on a card that doesn't have any legal moves
                    firstClickFlag = !firstClickFlag;  //flips the flag so when it is flipped at the end, it starts at the if statement
                }
            }
        }
        else{//if a collumn is clicked after a first card is selected
            console.log("else statemnet ran");
            arr = whereCanPlace(getCardObj(movingDiv));
            let legal = false;
            for(i = 0; i < arr.length; i++){
                if(this.id == arr[i]){
                    legal = true;
                }
            }
            if(legal){//only moves the card if the moving target is legal

                //declarations of temp and capsule variables and select target desination
                let temp = movingDiv
                moveFrom = movingDiv.parentNode.id;
                if (this.id.substring(0,6) != "column" && this.classList != "foundation") { /*If the column is not clicked or the foundation is not clicked*/ 
                    destination = this.parentNode.id;
                } else {
                    destination = this.id;
                }
                
                //Checks to see if the legal move was an empty column
                if (this.lastChild == null) {
                    wasNull = true;
                }

                //removing and adding the card from and to a specified div
                if (movingDiv.nextSibling == null) {
                    removeCard(movingDiv);
                    if (destination.substring(0,6) == "column") {
                        addToColumn(getCardObj(temp), destination);
                    } else if (desination == "foundation") {
                        console.log("There was an error somehow");
                    }
                } else {  //moves all the cards on top of the specific card you're moving
                    if (movingDiv.previousSibling != undefined) {
                        let previousSib = movingDiv.previousSibling;
                        while (previousSib.nextSibling != null) {
                            let tempSib = previousSib.nextSibling;
                            removeCard(previousSib.nextSibling);
                            addToColumn(getCardObj(tempSib), destination);
                        }
                    } else {
                        let parentDiv = movingDiv.parentNode;
                        while (parentDiv.firstChild != null) {
                            let tempChild = parentDiv.firstChild;
                            removeCard(parentDiv.firstChild);
                            addToColumn(getCardObj(tempChild), destination);
                        }
                    }
                }
                
                //Checks to see if there is a flippable card and flip it if there is one
                if (document.getElementById(moveFrom).lastChild != null) { 
                    //makes a variable that contains the card that was underneath the moving card before the move
                    let cardBelowFrom = getCardObj(document.getElementById(moveFrom).lastChild);

                    //checks if the card below the moved one is face down and flips it if it is
                    if(cardBelowFrom.flipFlag == true){
                        flipCard(cardBelowFrom);
                    }
                }
            }
        }

        if ((this.id.substring(0,6) != "column" && getCardObj(this).link != "Playing Cards/Back.png") || (getCardObj(movingDiv).value == 13 && wasNull)) {
            console.log("Bottom if ran");
            //highlighting where it can be placed. i have it set underneath so that it will run to clear the highlighted sections after the second click
            for (let i = 0; i < arr.length; i++) {
                document.getElementById(arr[i]).classList.toggle("highlight");  //enlarged cards to make it obvious when they're legal
            }
            firstClickFlag = !firstClickFlag;//toggles. makes it so that if someone clicks on an unmovable column, it will cancel the move
            wasNull = false;
        }
    }
}

function clickHandlerRedo() {
    let length = showStack.childNodes.length
    for (let i = 0; i < length; i++) {
        let lastShowStackDiv = document.getElementById("showStack").lastChild;
        let temp = lastShowStackDiv;
        
        flipCard(getCardObj(lastShowStackDiv));
        removeCard(lastShowStackDiv);
        placeCard(getCardObj(temp), "stack");
    }
}

//returns an array of div ids where the card can be placed. The array will be empty if the card can not be placed anywhere
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
    
    //This one is for the columns and kings
    for (let i = 0; i < 7; i++) {
        let columnCard = document.getElementById("column" + i).lastChild

        if (columnCard != null && canPlaceColumn(card, getCardObj(columnCard))) //for regular cards
            placeArray.push(columnCard.id);
        else if (columnCard == null && card.value == 13) {  //for kings
            placeArray.push(document.getElementById("column" + i).id);
        }
    } 
    return placeArray;
}

//returns a Cards object from the specified div
function getCardObj(cardDiv) {
    let cardObj = JSON.parse(cardDiv.firstChild.innerText);
    cardObj.__proto__ = Cards.prototype;
    return cardObj;
}

//returns boolean variable. Needs Cards objects to be passed as parameters
function canPlaceColumn(cardTop, cardBottom) {
    let topSuitColor;
    let bottomSuitColor;

    if (cardTop.suit <=1) {
        topSuitColor = "red";
    } else {
        topSuitColor = "black";
    }
    if (cardBottom.suit <=1) {
        bottomSuitColor = "red";
    } else {
        bottomSuitColor = "black";
    }

    if (cardTop.value + 1 == cardBottom.value && topSuitColor != bottomSuitColor) {
        return true;
    } else {
        return false;
    }
}

//returns boolean variable. Needs Cards objects to be passes as parameters
function canPlaceFoundation(cardTop, cardBottom) {
    if (cardTop.value - 1 == cardBottom.value && cardTop.suit == cardBottom.suit) {
        return true;
    } else {
        return false;
    }
}

//Places a card in the column. Places it in the correct position away from the other card under it
function addToColumn(card, location) {
    let shift = 3.3;
    if (document.getElementById(location).childNodes.length == 0){
        placeCard(card, location);
    } else {
        placeCard(card, location);
        shiftDown(card.id, (Math.ceil(parseInt(window.getComputedStyle(document.getElementById(location).childNodes[document.getElementById(location).childNodes.length - 2])["top"])/parseInt(window.getComputedStyle(document.getElementById("board"))["height"]) * 10000) + shift * 100) / 100);
    }
}

//creates a div at a specified locatoin. Requires Cards object and the div id
function placeCard(card, locationId){

    let domCard = document.createElement("div");
    domCard.id = card.id;
    domCard.classList.add("card");
    document.getElementById(locationId).append(domCard);

    let cardObj = document.createElement("span");
    cardObj.style.display = "none";
    cardObj.innerText =  JSON.stringify(card);
    document.getElementById(domCard.id).append(cardObj);

    let img = document.createElement("img");
    img.src = card.link;
    img.style.width = "100%";
    document.getElementById(card.id).appendChild(img);
    document.getElementById(card.id).addEventListener("click",clickHandlerCards);
}

//removes the card div given a card object
function removeCard(cardDiv) {
    document.getElementById(cardDiv.id).remove();
}

 //For moving a card down a specific amount
function shiftDown(item, amount) {
    document.getElementById(item).style.top = (Math.ceil(parseInt(window.getComputedStyle(document.getElementById(item))["top"])/parseInt(window.getComputedStyle(document.getElementById("board"))["height"]) * 100) + amount) + "%";
}

//Takes a card object and flips it
function flipCard(card) {
    card.flip();
    document.getElementById(card.id).lastChild.src = card.link;
    updateDivObj(document.getElementById(card.id), card);
}

//Takes a div and object and updates the div's objects attributes based on the parameter object's attributes
function updateDivObj(div, object) {
    div.firstChild.innerText =  JSON.stringify(object);
}

 //Script for randomizing the order of any array
function randomizer(array){
    for (let i = 0; i < array.length; i++) {
        let temp = Math.floor(Math.random() * (array.length));
        [array[temp], array[i]] = [array[i], array[temp]];
    }
}