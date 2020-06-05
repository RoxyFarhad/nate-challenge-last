const got = require('got');
const cheerio = require('cheerio');

const parserController = {}

/*
 * parseHtml is the driver function responsible for parsing the text 
 * mode refers to the optional sort function: 
 * 0 = no sort, 1 = Most Frequent, 6 = Least Frequent, 2 = Word Length, 3 = Alphabetically, 4 = Only letters, 5 = Words with length greater than 3,
*/

parserController.parseHtml = async function(url, mode) {

  try {

    var textString = await got(url); 
    textString = textString.body  
    const $ = cheerio.load(textString)

    var wordCount = {}

    var text = await $('*').not('script, link, style').contents().map(async function() {
      if (this.type === 'text')
          var temp = $(this).text().trim()
          if(temp !== undefined && temp.indexOf("<") === - 1) {
            filtered = await removePunctuation(temp)
            for(var j = 0; j < filtered.length; j++){
              var el = filtered[j]
              if(el in wordCount){
                count = wordCount[el] + 1
                wordCount[el] = count
              }
              else if (!(el in wordCount)){
                // only add based on certain mode conditions - if mode is 5, then length > 3, if mode = 4 then must be word, if mode != 5 or 4 
                if((mode === 5 && el.length > 3) || (mode === 4 && isNaN(el) || (mode !== 5 && mode !== 4))) {
                  wordCount[el] = 1
                }
              }
            }
          }
    }).get()

    if(mode === 4 || mode === 5 || mode === 0) {

      // parse into JSON object
      keys = Object.keys(wordCount)
      values = Object.values(wordCount)
      
      var json = []
      for(var i = 0; i < keys.length; i++){
        var temp = {}
        temp["word"] = keys[i]
        temp["count"] = values[i]
        json.push(temp)
      }
      return json
    }

    // else sort the object before we return it 
    var newCount = await sortWordCount(wordCount, mode)
    return newCount

  } catch(err) {
    console.log(err.response)
    return 500
  }
}

async function sortWordCount(wordCount, mode) {

  // first we build a 2D array that we can sort using lambda function

  keys = Object.keys(wordCount)
  values = Object.values(wordCount)

  if(keys.length !== values.length){ /* there is an error here - return status code of error to be rendered;*/ return 500 }
  
  var wordCount2D = []

  for(var i = 0; i < keys.length; i++){
    var temp = []
    temp[0] = keys[i]
    temp[1] = values[i]
    wordCount2D.push(temp)
  }

  if(mode === 1) {
    wordCount2D.sort(sortMostFrequent)
  }
  else if(mode === 2){
    wordCount2D.sort(sortWordLength)
  }
  else if(mode === 3){
    wordCount2D.sort(sortAlphabetically)
  } 
  else if(mode === 6){
    wordCount2D.sort(sortLeastFrequent)
  }

  // need to make the 2D array back to an obj  
  var json = wordCount2D.map((x) => {
    return {
      "word": x[0],
      "count": x[1]
    }
  })

  return json

}

// sorting functions 
function sortMostFrequent(a, b) {
  return (b[1]) - (a[1])
}

function sortLeastFrequent(a, b){
  return (a[1] - b[1])
}

function sortWordLength(a, b) {
  return (b[0].length - a[0].length)
}

function sortAlphabetically(a, b) {
  if(a[0] < b[0]) { return -1 }
  if(a[0] > b[0]) { return 1 }
  return 0
}

async function removePunctuation(text) {

  // first need to replace all punctuation by a space
  // one of the things I noticed when parsing the file is that if there were lowercase followed by uppercase that usually meant two separate words
  text = text.replace(/([a-z])([A-Z])/g, '$1 $2');

  // removing all amp values and replace with space
  text = text.replace(/amp/g, ' ')

  // remove all additional whitespaces
  text = text.replace(/[^\w\s]|_/g, " ")
  text = text.replace(/\s+/g, " ")

  // strip all punctuation that isn't _ (want to remove words that have this because they are part of DOM Def usually)
  text = text.replace(/[.,\/#!$%\^&\*;:{}=\-`~()]/g," ")

  // first split words on new lines \ tabs \ and then split on white space
  // text = text.split(/\n|\t|\r/).join(" ")
  all_text = text.split(" ")

  filtered = []
  for(var i = 0; i < all_text.length; i++) {

      // checks for underscore // words larger than length 1 // make sure only alpha words or numbers pass through
    if (all_text[i].indexOf("_") === -1  && all_text[i].length > 1 && all_text[i].match(/^(?:[0-9]+[a-z]|[a-z]+[0-9])[a-z0-9]*$/i) === null) {

      // only add lowercase values of the word 
      filtered.push(all_text[i].toLowerCase()) 
    }
  }

  return filtered
}

module.exports = parserController; 