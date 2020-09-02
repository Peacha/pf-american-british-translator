import { americanOnly } from './american-only.js';
import { britishOnly } from './british-only.js';
import { americanToBritishSpelling } from './american-to-british-spelling.js';
import { americanToBritishTitles } from './american-to-british-titles.js';

function Translator(){
  //language: american- translate to american.  british- translate to british
  let language="British"
  this.htmlUpdates = true
  const updateHTML = (valid,msg) =>{
    this.clear(true);
    return valid ? document.getElementById('translated-sentence').innerHTML = msg : document.getElementById('error-msg').innerHTML = msg;
  }
  const formatTags = (input,punctuation="") =>{
    return this.htmlUpdates ? `<span class="highlight"> ${input}</span>${punctuation} ` : `${input}${punctuation}`
  }
  const translateWord = (word) =>{
    const findWord = word.replace(/[^\w]/,'').toLowerCase();
    const punctuation = word.replace(/[a-zA-Z]+/,'')
    if (language === "American")
    {
      if (Object.values(americanToBritishTitles).indexOf(findWord) > -1){return formatTags(Object.keys(americanToBritishTitles).find(key=>americanToBritishTitles[key] === findWord),punctuation)}
      if (Object.keys(britishOnly).indexOf(findWord) > -1){return formatTags(britishOnly[findWord],punctuation)}
      if (Object.values(americanToBritishSpelling).indexOf(findWord) > -1){return formatTags(Object.keys(americanToBritishSpelling).find(key=>americanToBritishSpelling[key] === findWord),punctuation)}  
      if (word.match(/\d\.\d/)){return formatTags(word.replace(/\./,':'))}
    }
    if (language === "British")
    {
      if (Object.keys(americanOnly).indexOf(findWord) > -1){return formatTags(americanOnly[findWord],punctuation)}
      if (Object.keys(americanToBritishSpelling).indexOf(findWord) > -1){return formatTags(americanToBritishSpelling[findWord],punctuation)}
      if (Object.keys(americanToBritishTitles).indexOf(findWord) > -1){return formatTags(americanToBritishTitles[findWord],punctuation)}
      if (word.match(/\d:\d/)){return formatTags(word.replace(/:/,'.'))}
    }
    return word
  }
  this.toAmerican = () =>{
    language = "American"
  }
  this.toBritish = () =>{
    language = "British"
  }
  this.translate = (input) =>{
    if(input.length === 0){return updateHTML(false,"Error: No text to translate.");}
    const translateStr = input.replace(/ +(?= )/g,'');
    const translated = translateStr.split(" ").map(el=>{return translateWord(el)}).join(" ");
    if (translated.localeCompare(translateStr) === 0){ return this.htmlUpdates ? updateHTML(true,"Everything looks good to me!") : translated;}  
    return this.htmlUpdates ? updateHTML(true,translated) : translated;
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
