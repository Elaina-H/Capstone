const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
const PORT = 5000;
const path = require('path');

app.use(cors());
app.use('/static', express.static(path.join(__dirname)));

let browser = null;
let page = null;

app.use('/static', express.static(path.join(__dirname), {
    setHeaders: (res, path) => {
        res.set('Cache-Control', 'no-store');
    }
}));

app.get('/scrape', async (req, res) => {
    const formattedDate = req.query.date;
    const capacity = req.query.capacity;

    if (!formattedDate || !capacity) {
        return res.status(400).json({ error: "Missing date or capacity" });
    }

    try {
        if (!browser) {
            // Change headless to 'true' to make the chrome window visible
            browser = await puppeteer.launch({ headless: false });
            page = await browser.newPage();
        }

        await page.goto("https://spaces.library.okstate.edu/");

        const grabParagraph = await page.evaluate(() => {
            const pgTag = document.querySelector(".cell.small-12 p");
            return pgTag ? pgTag.innerText : "No paragraph found";
        });

        await page.waitForSelector('#date');
        await page.$eval('#date', (input, value) => input.value = value, formattedDate);
        await page.select('#seatsDropDown', capacity);

        await page.waitForSelector('.large-12.cell.grid-x');

        const roomList = await page.$('.large-12.cell.grid-x');

        if (roomList) {
            const filePath = path.join(__dirname, 'roomList.png');
            await roomList.screenshot({ path: filePath });
        }

        res.json({
            message: "Scraping successful",
            paragraph: grabParagraph,
            usedDate: formattedDate,
            usedCapacity: capacity
        });
    } catch (error) {
        console.error("Scraping error:", error);
        res.status(500).json({ error: "Scraping failed" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});