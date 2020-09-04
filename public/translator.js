import { americanOnly } from './american-only.js';
import { britishOnly } from './british-only.js';
import { americanToBritishSpelling } from './american-to-british-spelling.js';
import { americanToBritishTitles } from './american-to-british-titles.js';

function Translator(){
  let language="American"
  this.htmlUpdates = true
  const updateHTML = (valid,msg) =>{
    this.clear(true);
    return valid ? document.getElementById('translated-sentence').innerHTML = msg : document.getElementById('error-msg').innerHTML = msg;
  }
  const formatTags = (input,punctuation="") =>{
    return this.htmlUpdates ? `<span class="highlight"> ${input}</span>${punctuation} ` : `${input}${punctuation}`
  }
  const translateSentence = (input,output="") =>{
    let outVal;
    let returnVal
    if (input.length === 0){
          outVal = output
    } 
    else
    {
      const sentenceIn = input;
      const sentenceOut = output;
      let stringTest = sentenceIn.shift();
      if (stringTest.length === 1){return translateSentence(sentenceIn,sentenceOut.concat(" ",stringTest));}
      let capitalised = (stringTest.match(/^[A-Z]/)) ? true : false;
      let punctuation = (stringTest.match(/\W$/)) ? stringTest.replace(/\d+[:\.]\d+|\w+/,'') : '';
      stringTest = punctuation ? stringTest.replace(/\W$/,'') : stringTest
      if (language === "American"){
        if (Object.values(americanToBritishTitles).indexOf(stringTest.toLowerCase().concat(punctuation)) > -1 && !outVal){
          const findVal = Object.keys(americanToBritishTitles).find(key=>americanToBritishTitles[key] === stringTest.toLowerCase());
          returnVal = capitalised ? formatTags(findVal.charAt(0).toUpperCase().concat(findVal.slice(1,findVal.length))) : formatTags(findVal);
          outVal = translateSentence(sentenceIn,sentenceOut.concat(" ",returnVal));
        }
        if (stringTest.match(/\d\.\d/) && !outVal){outVal = translateSentence(sentenceIn,sentenceOut.concat(" ",formatTags(stringTest.replace(/\./,':'),punctuation)));}
        if (Object.values(americanToBritishSpelling).indexOf(stringTest.toLowerCase()) > -1 && !outVal){
          const findVal = Object.keys(americanToBritishSpelling).find(key=>americanToBritishSpelling[key] === stringTest.toLowerCase());
          returnVal = capitalised ? formatTags(findVal.charAt(0).toUpperCase().concat(findVal.slice(1,findVal.length),punctuation)) : formatTags(findVal,punctuation);
          outVal = translateSentence(sentenceIn,sentenceOut.concat(" ",returnVal));
        } 
        if (Object.keys(britishOnly).indexOf(stringTest.toLowerCase()) > -1 && !outVal){
          const findVal = britishOnly[stringTest.toLowerCase()]
          returnVal = capitalised ? formatTags(britishOnly[stringTest.toLowerCase()],punctuation) : formatTags(britishOnly[stringTest],punctuation);
          outVal = translateSentence(sentenceIn,sentenceOut.concat(" ",returnVal));
        }
        if (Object.keys(britishOnly).filter((el)=>{if(el.split(" ").indexOf(stringTest.toLowerCase()) >= 0){return el}}).length > 0 && !outVal)
        {
          const testPossibles = (Object.keys(britishOnly).filter((el)=>{if(el.split(" ").indexOf(stringTest.toLowerCase()) >= 0){return el}}))  
          let testSuccess = false;
          testPossibles.forEach((poss,index)=>{
            if (stringTest.toLowerCase() === poss.split(" ")[0]){
              let tempString = stringTest.concat(" ",sentenceIn.map(e=>{return e}).slice(0,poss.split(" ").length-1).join(" "));
              let punctuation = (tempString.match(/\W$/)) ? tempString.replace(/[A-Za-z\s]+/,'') : '';
              tempString = punctuation ? tempString.replace(/\W$/,'') : tempString;
              if (tempString.toLowerCase() === poss && !testSuccess){
                let returnStr;
                returnStr = britishOnly[poss]
                if (returnStr.split(" ").length === tempString.split(" ").length)
                {
                  capitalised = false
                  returnStr = britishOnly[poss].split(" ").map((el,ind)=>{return tempString.split(" ")[ind].match(/^[A-Z]/) ? el.charAt(0).toUpperCase().concat(el.slice(1,poss.length)) : el }).join(" ")
                } 
                returnVal = capitalised ? formatTags(returnStr.charAt(0).toUpperCase().concat(returnStr.slice(1,poss.length),punctuation)) : formatTags(returnStr,punctuation);  
                const nextInput = sentenceIn.length > 1 ? sentenceIn.splice(poss.split(" ").length-1) : [];
                testSuccess = true;
                outVal = translateSentence(nextInput,sentenceOut.concat(" ",returnVal))
              }
            }  
          })
        }        
       }
      if (language === "British")
      {
          if (Object.keys(americanToBritishTitles).indexOf(stringTest.toLowerCase().concat(punctuation)) > -1)
          {
            const findVal = americanToBritishTitles[stringTest.toLowerCase().concat(punctuation)]
            const returnVal = capitalised ? formatTags(findVal.charAt(0).toUpperCase().concat(findVal.slice(1,findVal.length))) : formatTags(findVal);
            return translateSentence(sentenceIn,sentenceOut.concat(" ",returnVal));
          }
          if (stringTest.match(/\d\:\d/)){outVal = translateSentence(sentenceIn,sentenceOut.concat(" ",formatTags(stringTest.replace(/:/,'.'),punctuation)));}
          if (Object.keys(americanToBritishSpelling).indexOf(stringTest.toLowerCase()) > -1 && !outVal)
          {
            const findVal = americanToBritishSpelling[stringTest.toLowerCase()]
            const returnVal = capitalised ? formatTags(findVal.charAt(0).toUpperCase().concat(findVal.slice(1,findVal.length),punctuation)) : formatTags(findVal,punctuation);
            return translateSentence(sentenceIn,sentenceOut.concat(" ",returnVal));
          }
          if (Object.keys(americanOnly).indexOf(stringTest.toLowerCase()) > -1 && !outVal)
          {
            const findVal = americanOnly[stringTest.toLowerCase()]
            returnVal = capitalised ? formatTags(britishOnly[stringTest.toLowerCase()],punctuation) : formatTags(americanOnly[stringTest],punctuation);
            outVal = translateSentence(sentenceIn,sentenceOut.concat(" ",returnVal));
          }
          if (Object.keys(americanOnly).filter((el)=>{if(el.split(" ").indexOf(stringTest.toLowerCase()) >= 0){return el}}).length > 0 && !outVal)
          {
            const testPossibles = (Object.keys(americanOnly).filter((el)=>{if(el.split(" ").indexOf(stringTest.toLowerCase()) >= 0){return el}}))  
            let testSuccess = false;
            testPossibles.forEach((poss,index)=>{
              if (stringTest.toLowerCase() === poss.split(" ")[0]){
                let tempString = stringTest.concat(" ",sentenceIn.map(e=>{return e}).slice(0,poss.split(" ").length-1).join(" "));
                let punctuation = (tempString.match(/\W$/)) ? tempString.replace(/[A-Za-z\s]+/,'') : '';
                tempString = punctuation ? tempString.replace(/\W$/,'') : tempString;
                if (tempString.toLowerCase() === poss && !testSuccess){
                  let returnStr;
                  returnStr = americanOnly[poss]
                  if (returnStr.split(" ").length === tempString.split(" ").length)
                  {
                    capitalised = false
                    returnStr = americanOnly[poss].split(" ").map((el,ind)=>{return tempString.split(" ")[ind].match(/^[A-Z]/) ? el.charAt(0).toUpperCase().concat(el.slice(1,poss.length)) : el }).join(" ")
                  } 
                  returnVal = capitalised ? formatTags(returnStr.charAt(0).toUpperCase().concat(returnStr.slice(1,poss.length),punctuation)) : formatTags(returnStr,punctuation);  
                  const nextInput = sentenceIn.length > 1 ? sentenceIn.splice(poss.split(" ").length-1) : [];
                  testSuccess = true;
                  outVal = translateSentence(nextInput,sentenceOut.concat(" ",returnVal))
                }
              }  
            })
          }    
      }  
      if (!outVal)
      {
        outVal =  translateSentence(sentenceIn,sentenceOut.concat(" ",stringTest,punctuation))   
      }
    }
    return outVal
  }
  this.toAmerican = () =>{
    language = "American"
  }
  this.toBritish = () =>{
    language = "British"
  }
  this.translate = (input) =>{
    if(input.length === 0){return this.htmlUpdates ? updateHTML(false,"Error: No text to translate.") : "Error: No text to translate";}
    const translateArr = input.replace(/ +(?= )/g,'').split(" ");
    const translated = translateSentence(translateArr).trim()
    return this.htmlUpdates ? translated.localeCompare(input.replace(/ +(?= )/g,'')) ? updateHTML(true,translated) : updateHTML(true,"Everything looks good to me!") : translated.localeCompare(input.replace(/ +(?= )/g,'')) ? translated : "Everything looks good to me!";
  }
  this.clear = (inTranslation) =>{
    if (!inTranslation)
    {document.getElementById('text-input').value = '';}
    document.getElementById('translated-sentence').innerHTML = '';
    document.getElementById('error-msg').innerHTML = '';
  }
}

document.addEventListener('DOMContentLoaded',()=>{
  const translatorApp = new Translator();
  document.getElementById('locale-select').value === "british-to-american" ? translatorApp.toAmerican() : translatorApp.toBritish();
  document.getElementById('locale-select').addEventListener('change',(e)=>{e.target.value === 'british-to-american' ? translatorApp.toAmerican() : translatorApp.toBritish();})
  document.getElementById('translate-btn').addEventListener('click',(e)=>{
    const translateVal = document.getElementById('text-input').value;
    translatorApp.translate(translateVal);
  })
  document.getElementById('clear-btn').addEventListener('click',(e)=>{translatorApp.clear(false)})
})
/* 
  Export your functions for testing in Node.
  Note: The `try` block is to prevent errors on
  the client side
*/
try {
  module.exports = {
    Translator: Translator
  }
} catch (e) {}
