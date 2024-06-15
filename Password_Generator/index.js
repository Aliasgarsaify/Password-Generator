const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]"); 
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;

// set strength indicator color top grey
setIndicator("#ccc");
// set password length
handleSlider();

function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    inputSlider.style.backgroundSize =  (passwordLength)*100/(20) + "% 100%";
} 

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
    
}

function getRndInterger(min, max){
    return Math.floor(Math.random()*(max -min)) + min ;
}

function getRandomNumber(){
    return getRndInterger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInterger(97, 123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInterger(65, 91));
}
 
function generateSymbol(){
    return symbols.charAt(getRndInterger(0 , symbols.length)); 
}
 
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } 
    else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6){
      setIndicator("#ff0");
    }
    else {
      setIndicator("#f00");
    } 
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.innerText);
        copyMsg.innerText = "copied"
    }
    catch(e){
        copyMsg.innerText = "failed"
    }

    // to make copied text visible
    copyMsg.classList.add('active')

    // to remove copied text after 2 sec
    setTimeout( () => {
        copyMsg.classList.remove('active');
    }, 2000); 

}

inputSlider.addEventListener('input' , (e)=>{
    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click' , () => {
    if(passwordDisplay.value)
        copyContent();
});

function handleCheckBoxChange(){
    checkCount =0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked){
            checkCount++;
        }
    })

    //special condition
    if(checkCount > passwordLength){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change' , handleCheckBoxChange);
})

function shufflePassword(array){
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

generateBtn.addEventListener('click', ()=>{
    if(checkCount == 0 || passwordLength == 0){
        return;
    }
    //lets make random passwords

    // remove old password
    password = ""; 

    let funcArr = [];

    if(uppercaseCheck.checked){
        funcArr.push(generateUpperCase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowerCase);
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymbol);
    }
    if(numbersCheck.checked){
        funcArr.push(getRandomNumber);
    }

    // compulsory elements
    for(let i =0; i< funcArr.length; i++){
        password += funcArr[i]();
    }

    // remaining additions
    for(let i =0; i< passwordLength-funcArr.length; i++){
        let randIndex = getRndInterger(0 , funcArr.length);
        password += funcArr[randIndex]();
    }

    password = shufflePassword(Array.from(password));

    passwordDisplay.value = password;

    calcStrength();

}) 