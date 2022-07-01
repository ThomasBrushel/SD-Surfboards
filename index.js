import axios from 'axios'
import request from 'request-promise'
import cheerio from 'cheerio'
import express from 'express'

import path from 'path'
const __dirname = path.resolve();

const PORT = process.env.PORT || 8000;

const app = express();

app.get('', (req, res) => {
  res.sendFile(__dirname + '/frontend/index.html')
});

const surfboards = [];

axios("https://sandiego.craigslist.org/search/sss?query=surfboard")
.then(res => {
  const htmlData = res.data;
  const $ = cheerio.load(htmlData);
  $('#search-results > li').each((index, element) => {
    const postUrl = $(element).children('a').attr('href');
    const date = $(element).children('.result-info').children('.result-date').text();
    const title = $(element).children('.result-info').children('.result-heading').text().trim();
    const price = $(element).children('.result-info').children('.result-meta').children('.result-price').text();
    const location = $(element).children('.result-info').children('.result-meta').children(".result-hood").text().trim();
    const imageData = $(element).find('a.result-image').attr('data-ids');

    let images = [];

    if (imageData) {
      const parts = imageData.split(',');
      images = parts.map((id) => {
        return `https://images.craigslist.org/${id.split(':')[1]}_300x300.jpg`;
      });
    }
    surfboards.push({
      title,
      postUrl,
      date,
      price,
      location,
      images
    })
  })
  return surfboards
}).catch(err => console.error(err))


app.get('/api/surfboards', (req, res) => {

  const usedboards = surfboards
  
  return res.status(200).json({
    results: usedboards
  })
})


// Make App listen
app.listen(PORT, () => console.log(`Server is listening to port ${PORT}`))