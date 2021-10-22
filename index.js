const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

const newspapers = [
    {
        name: 'sports illustrated',
        address: 'https://www.si.com/wrestling',
        base: 'https://www.si.com/wrestling'
    },
    {
        name: 'wrestling inc',
        address: 'https://www.wrestlinginc.com/news/',
        base: ''
    },
    {
        name: 'wwe',
        address: 'https://www.wwe.com/shows/wwe-crown-jewel',
        base: 'https://www.wwe.com/shows/wwe-crown-jewel'
    },
    {
        name: 'wrestling headlines',
        address: 'https://wrestlingheadlines.com/news/wwe-news/',
        base: '',
    },
    {
        name: 'ewrestling news',
        address: 'https://www.ewrestlingnews.com/latest/news?filter=wwe',
        base: '',
    }/*,
    {
        name: 'nyt',
        address: 'https://www.nytimes.com/international/section/climate',
        base: '',
    },
    {
        name: 'latimes',
        address: 'https://www.latimes.com/environment',
        base: '',
    },
    {
        name: 'smh',
        address: 'https://www.smh.com.au/environment/climate-change',
        base: 'https://www.smh.com.au',
    },
    {
        name: 'un',
        address: 'https://www.un.org/climatechange',
        base: '',
    },
    {
        name: 'bbc',
        address: 'https://www.bbc.co.uk/news/science_and_environment',
        base: 'https://www.bbc.co.uk',
    },
    {
        name: 'es',
        address: 'https://www.standard.co.uk/topic/climate-change',
        base: 'https://www.standard.co.uk'
    },
    {
        name: 'sun',
        address: 'https://www.thesun.co.uk/topic/climate-change-environment/',
        base: ''
    },
    {
        name: 'dm',
        address: 'https://www.dailymail.co.uk/news/climate_change_global_warming/index.html',
        base: ''
    },
    {
        name: 'nyp',
        address: 'https://nypost.com/tag/climate-change/',
        base: ''
    }*/
]

const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("Crown")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                const a = $(this)

                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name,
                    image: a.find('.entry-thumb').find('img').attr('src')
                })
            })

        })
})

app.get('/', (req, res) => {
    res.json('Welcome to my Wrestling News API')
})

app.get('/news', (req, res) => {
    res.json(articles)
})

app.get('/news/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base


    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("Crown")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))
