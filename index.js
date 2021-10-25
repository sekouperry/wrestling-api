const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

const newspapers = [
    {
        name: 'sports illustrated',
        address: 'https://www.si.com/wrestling',
        base: 'https://www.si.com/',
    },
    {
        name: 'wrestling inc',
        address: 'https://www.wrestlinginc.com/news/',
        base: '',
    },
    {
        name: 'wwe',
        address: 'https://www.wwe.com/news/',
        base: 'https://www.wwe.com/',
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
    },
    {
        name: 'bleacherreport',
        address: 'https://bleacherreport.com/wwe',
        base: '',
    },
    {
        name: 'wrestling news',
        address: 'https://wrestlingnews.co/',
        base: '',
    },
    {
        name: 'wrestling news source',
        address: 'https://www.wrestlingnewssource.com/',
        base: 'https://www.wrestlingnewssource.com/',
    },
    {
        name: 'mandatory',
        address: 'https://www.mandatory.com/wrestlezone/',
        base: 'https://www.mandatory.com/wrestlezone/',
    },
    {
        name: 'ringside news',
        address: 'https://www.ringsidenews.com/',
        base: 'https://www.ringsidenews.com/'
    }/*,
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

            $('a:contains("Charlotte Flair")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            }),

            $('a:contains("Paul Heyman")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            }),

            $('a:contains("Brock Lesnar")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            }),

            $('a:contains("Bound For Glory")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            }),

            $('a:contains("Carmella")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            }),

            $('a:contains("Lex Luger")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
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
