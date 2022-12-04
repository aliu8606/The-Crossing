function clickAvatar(element)
{
    if (removedListeners.includes(element)) {
        if (element.style.border === "1px solid yellow")
        {
            alert("Avatar directed out of hover car.");
            changeFunctionality(element, false);
            currCarArr.splice(currCarArr.indexOf(element), 1);
            element.style.border = "";
        }
        return;
    }
    else if (removedListeners.includes(findSide(element)[0])) {return;}

    element.style.border = "1px solid yellow";
    
    if (currCarArr.length >= 2) {
        alert("Hover car capacity already met.");
        element.style.border = "";
    }
    else {
        changeFunctionality(element, true);
        currCarArr.push(element);
    }
    
    if (!checkEnd()) {
        setTimeout(function() {summonSpider();}, 200);
        setTimeout(function() {display();}, 2100);
    }
}

function clickCar()
{
    if (currCarArr.length === 0) {
        alert("Hover car is empty.");
        return;
    }

    changeSide();
    currCarArr = [];

    if (!checkEnd()) {
        setTimeout(function() {summonSpider();}, 200);
        setTimeout(function() {display();}, 2100);
    }
    
}

function changeSide()
{
    let currSide = (currCarArr[0].id.endsWith("f")) ? OFF_PRECIPICE_ALL : ON_PRECIPICE_ALL;
    let oppSide = (currCarArr[0].id.endsWith("n")) ? OFF_PRECIPICE_ALL : ON_PRECIPICE_ALL;

    for (let i = 0; i < currCarArr.length; i++)
    {
        let element = currCarArr[i];

        element.style.border = "";
        changeVis(element, true);

        let mirrorElement = oppSide[currSide.indexOf(element)];
        changeVis(mirrorElement, false);
        changeFunctionality(mirrorElement, false);

        changeCount(element.id);
    }

    //changing hover car functionality + visibility
    changeVis(currSide[0], true);
    changeFunctionality(currSide[0], true);
    changeVis(oppSide[0], false);
    changeFunctionality(oppSide[0], false);
}

function changeCount(elementID)
{  
    let isOn = elementID.endsWith("n");
    let isBlom = elementID.includes("blom");
    let idx = 0;
    let creature = "agent";

    if (isBlom) {
        idx++;
        creature = "blomfargle"
    }
    log += "Directed one " + creature; 

    if (isOn) {
        COUNT_ARR[idx + 2] = COUNT_ARR[idx + 2] - 1;
        COUNT_ARR[idx] = COUNT_ARR[idx] + 1;
        log += " off the precipice. <br>"    
    }
    else {
        COUNT_ARR[idx] = COUNT_ARR[idx] - 1;
        COUNT_ARR[idx + 2] = COUNT_ARR[idx + 2] + 1;
        log += " back onto the precipice. <br>"
    }
}

function summonSpider()
{
    let summon = Math.random() * 100;
    if (summon <= 2)
    {
        alert("The Spider appeared.");
        const spider = document.createElement("img");
        spider.src = "spooder.png";
        spider.id = "spooder";
        board.appendChild(spider);

        let attackSide = (removedListeners.includes(OFF_PRECIPICE_ALL[0])) ? OFF_PRECIPICE_ALL : ON_PRECIPICE_ALL;
        let potentialVictims = new Array();
        for (let i = 1; i < attackSide.length; i++) 
        {
            if (!removedListeners.includes(attackSide[i])) 
            {
                potentialVictims.push(attackSide[i]);
            }
        }

        if (potentialVictims.length > 0) 
        {
            let randomVictim = potentialVictims[Math.floor(Math.random() * potentialVictims.length)];
            randomVictim.style.border = "1px solid red";

            setTimeout(function() {changeVis(randomVictim, true);}, 500);
            changeFunctionality(randomVictim, true);
            decreaseCount(randomVictim.id);

            if (currCarArr.includes(randomVictim)) {
                currCarArr.splice(currCarArr.indexOf(randomVictim), 1);
            }
        }
        
        setTimeout(function() {board.removeChild(spider)}, 1500);
        checkEnd();
    }
}

function decreaseCount(elementID)
{
    let isOn = elementID.endsWith("n");
    let isBlom = elementID.includes("blom");
    let idx = 0;
    let creature = "agent";

    if (isBlom) {
        idx++;
        creature = "blomfargle";
    }
    log += `Lost one ${creature}.<br>`; 

    (isOn) ? COUNT_ARR[idx + 2] = COUNT_ARR[idx + 2] - 1 : COUNT_ARR[idx] = COUNT_ARR[idx] - 1;
}

function endGame(isWin)
{
    let winStr = (isWin) ? "successfully completed" : "failed";
    setTimeout(function() {alert(`Agent, you have ${winStr} the mission.`);}, 1000);
    log += "<br>Mission ended."
    setTimeout(function() {hideAll();}, 1005);
}

let hideAll = () =>
{
    for (let i = 0; i < OFF_PRECIPICE_ALL.length; i++)
    {
        changeVis(OFF_PRECIPICE_ALL[i], true);
        changeVis(ON_PRECIPICE_ALL[i], true);
    }
}

let checkEnd = () => {
    if (checkRevolt()) 
    {
        endGame(false);
        return true;
    }
    if (checkWin())
    {
        endGame(true);
        return true;
    }
    return false;
}

let findSide = (element) => {return (element.id.endsWith("f")) ? OFF_PRECIPICE_ALL : ON_PRECIPICE_ALL};
let changeFunctionality = (element, doRemove) => {(doRemove) ? removedListeners.push(element) : removedListeners.splice(removedListeners.indexOf(element), 1)};
let changeVis = (element, haveHidden) => {element.style.visibility = (haveHidden) ? "hidden" : "visible";};
let checkRevolt = () => {return (COUNT_ARR[2] !== 0 && COUNT_ARR[3] > COUNT_ARR[2] || COUNT_ARR[0] !== 0 && COUNT_ARR[1] > COUNT_ARR[0])};
let checkWin = () => {return (COUNT_ARR[0] + COUNT_ARR[1] === 6)};