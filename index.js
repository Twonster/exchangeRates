const { Telegraf } = require('telegraf');
const fetch = require('node-fetch');
const { format } = require('date-fns');

const TOKEN = '1639205327:AAGKLG9CX8ywSCC_jnXd-oAuYHzPBRpm5dg';
const API_QUERY = 'https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11'

const bot = new Telegraf(TOKEN);

let cache = [];
let date = '';

const getRates = async function () {
    try {
        const response = await fetch(API_QUERY);
        const data = await response.json();
        date = format(new Date(Date.now()), 'PPpp');
        cache = data;
    } catch(e) {
        bot.reply(e.text)
    }
}

setInterval(getRates, 432 * 10_000)

bot.command('curse', async (ctx) => {
    if (cache.length === 0) {
       await getRates()
    }
    const resp = [...cache];
    const ready = resp.reduce((acc, { ccy, base_ccy, buy, sale }) => {
        return acc += `${ccy}:\n⬇️ Покупка: ${Number(buy)} ${base_ccy}\n⬆️ Продажа: ${Number(sale).toFixed(2)} ${base_ccy}\n\n`
    }, `Update ${date}\n\n`)
    await ctx.reply(ready);
})

bot.launch();