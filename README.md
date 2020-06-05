
Nate-Backend-Programming Challenge
-----------------------------------

The requirements of this challenge was to build a full-stack application where a client would input a url and a server would parse that url and return a list of all the words on the page with their word counts. Within the file, there is a client folder that holds all the code relating to the frotend, and the main directory holds all the files for the backend/server. 

As this was mainly a back-end project, I didn't focus at all on the styling of the frontend of the project, but rather on its functionality. 

Setup
-------

There are 2 different repos from github that store the backend and frontend code. 

1. run git clone https://github.com/RoxyFarhad/nate-challenge-last
2. cd nate-challenge-last
3. git clone https://github.com/RoxyFarhad/nate_frontend client 
-- N.b. you must clone into the repo into a directory named client for the scripts to run 
4. cd client 
5. npm install
6. cd .. 
(at this point you should be in nate-challenge-last)
7. yarn install
8. yarn dev

Once all the modules are downloaded, you  run  `yarn dev` to start the dev server

Backend
--------

There are two main files for the Backend:
1. server.js
2. parseText.js

Server.js: 

This file uses express to listen for incoming client connections and after calling the parsing functions returns either an object that holds that word data with a response of 200. If there is a problem with response, the server will return a code of 400 if:
    1. The client didn't supply a valid url 
    2. The client didn't supply a url at all 
If there is a status code of 400 the client will pick up on that and reflect the necessary changes the client must make to their input in order for the server to process a valid request. 

If there is a server problem, it will return a 500 and instruct the client to re-attempt their request. 

ParseText.js:

This file is responsible for actually parsing and sorting the html file and creating a valid structure to send back to the client. 

parseHtml(url, mode) :
@ returns json object that is sorted if that is requested by the user 

- This function is called directly by the server, and is responsible for calling all necessary functions to parse and sort the valid url.
- It uses the got package to validate the html and parse the contents into an html string, and uses the cheerio package to parse the actual text string. 
- I use cheerio to parse the file, validating elements that I want to parse through the "text" type. I then call the text() on the element to get the text within the tag. While I was writing and checking this function, I noticed that a lot of script files were passing this test, which is not part of the text that I was trying to pass. I added a condition to check for text scripts by checking if there was any character in the text string was a "<". If this condition rendered true, then this was not a valid text I wanted to parse. 
- Once a piece of valid text was found, this text was sent to the function removePunctuation() (see functionality below) which would then return an array of valid words. 
- This array was then immediately parsed and the dictionary wordCount that maintained the word and their coutns seen so far would be added to / updated. 

- If there was no sort mode sent to the server, the object would be converted into a json with the following definition:
    json = [{word: '', count: ''}, {word: '', count: ''}, ...]

    At first, I actually sent the original dict back to the client, but once I implemented sorting functions of which one would remove words that were purely numeric, there were bugs with the returned wordCount, so this hack method seemed to work. 

- If there was a sort, the sort function would be called which would return a valid json object to then be returned. 

RemovePunctuation.js:
@ return array of words ready to be added to dictionary

- This function is responsible for removing punctuation, or breaking apart words that had been incorrectly parsed from the html. From testing, these were the main cases I found:
    1. Some words in the text file would be made up of multiple words without spaces, and this was recognised through having a small letter followed by a capital. 
    2. & symbols were passed as valid ampersands and "amp" through the text() funtion in cheerio. 
    3. Replacing multiple whitespaces / newline  / return / tabs  
    4. Stripping punctuation from the beginning and end of words -- there was one bug that I found with this such as "you've" would be split in "you" and "ve"
    6. If there was an underscore in the word, it wasn't valid. 
    7. Do not include single characters
    8. If there were alphanumber strings, these were also not valid words. 

There were a few cases in which my wordcount would be one or two values higher than what I could see on the html file, and this would have been due to some splitting of words that should not be split. If I had more time, this is something that I would perfect. 

Sorting:

I wrote custom sorting functions that would sort based on a user's choice of 1 of the following choices:
    1. Most Frequent Count (sortMostFrequent(a, b))
    2. Word Length sortWordLength(a, b)
    3. Alphabetically sortAlphabetically(a, b)
    4. Least Frequent Count (sortLeastFrequent(a, b))
    5. Only words above length 3 
    6. No digit strings 

If I had more time, I would have created functions that would allow a user to choose multiples of those sorting methods. 

Frontend
---------

There are two main components:
1. App (root of project)
2. DataComponent (renders the data for each request)

The main things I focused on the frontend was making sure the user history of the searches were saved, and the client would correctly pass data to the server. Again, as this was more of a backend challenge, I didn't focus on style at all, and this is something I would have changed if I had more time. 

A user can see their previous searches through clicking on the links. 
For each request, the data is rendered through a simple table (this is something that I would again improve as there were some really long lists which worsens the user experience)

Once a request is passed, and successfully returned, the history of the localStorage gets updated. The history is rendered through the data component that takes an obj that stores: url, wordData, sort for each request 

Test
-----

I tested the most important frontend component DataComponent using enzyme (dataComponent.test.js), and the test can be run through entering the client directory and running "npm test". 

I tested the backend service using chai and mocha. I ran a couple of tests: 
1. Tested the correct number for a word was returned 
2. The most frequent and length sort functions were correctly implemented 

To test the backend be in `nate-challenge-last` and run yarn test

Limitations
------------

The hardest thing to test was for long documents if the correct word counts were returned. On the whole, I believe that my code is relatively accurate and I tested a few random words on pages using ctrl-f. Due to the punctuation parsing function, there were a couple of errors that did come up, but I believe that these were few and far between and on the whole my code was accurate. 

If I had more time I would work to improve sorting, more testing and improve styling. 

The Tech Stack
---------------

I chose nodejs and react as my stack because they is a lot of documentation on how to use them together, but more importantly there are extremely popular choices for modern web development. I also have had most of my experience in both the backend and frontend in noejs and react, which made the project easier to undertake. 

If I was going to change my tech stack, I would choose python and django for the backend as there are popular parsing packages and their data structures are useful for parsing and manpulating text structures. 





