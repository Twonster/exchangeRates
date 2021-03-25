const { Telegraf } = require('telegraf');
const fetch = require('node-fetch');

const TOKEN = '1639205327:AAGKLG9CX8ywSCC_jnXd-oAuYHzPBRpm5dg';
const API_QUERY = 'https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11'

const getRates = async function () {
    try {
        const response = await fetch(API_QUERY);
        const data = await response.json()
        return data
    } catch(e) {
        console.log(e)
    }
}


const bot = new Telegraf(TOKEN)

bot.start(async (ctx) => {
    const resp = await getRates();
    const ready = resp.reduce((acc, { ccy, base_ccy, buy, sale }) => {
        return acc += `${ccy}:\nПокупка: ${buy}\nПродажа: ${sale} ${base_ccy}\n\n`
    },'')
    await ctx.reply(ready);
})

bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('хуй', (ctx) => ctx.reply('Хуй зер'))
bot.launch();