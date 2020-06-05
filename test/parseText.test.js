const expect = require('chai').expect

const parserController = require("../parseText.js")
const testUrl = "https://www.w3.org/TR/PNG/iso_8859-1.txt"

describe('testing word parser', () => {
    describe('Testing parser with url: https://www.w3.org/TR/PNG/iso_8859-1.txt and sort: 0 i.e. no sort', () => {

        it('the word `hex` should appear twice', async () => {
            const result = await parserController.parseHtml(testUrl, 0)
            
            // find the word hex 
            var count; 
            for(var i = 0; i < result.length; i++){
                if(result[i]['word'] === "hex"){
                    count = result[i]['count']
                }
            }
            expect(count).to.equal(2)
        })
    
    })

    describe('Testing parser with url: https://www.w3.org/TR/PNG/iso_8859-1.txt and sort: word length > 3', () => {
        it('There should be no parsed word with length greater than 3', async () => {

            const result = await parserController.parseHtml(testUrl, 5)

            var count = 0; 
            for(var i = 0; i < result.length; i++){
                if(result[i]['word'].length < 3){
                    count += 1
                }
            }
            expect(count).to.equal(0)
        })
    })

    describe('Testing parser with url: https://www.w3.org/TR/PNG/iso_8859-1.txt and sort: most frequent', () => {
        it('The result should be in non-ascending word length', async () => {

            const result = await parserController.parseHtml(testUrl, 1)

            var max = result[0]['count'], found = false; 

            for(var i = 1; i < result.length; i++){
                if(result[i]['count'].length > max){

                    max = result[i]['count'].length
                    found = true
                }
            }
            expect(found).to.equal(false)
        })
    })
})
