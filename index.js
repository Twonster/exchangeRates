const { Telegraf } = require('telegraf');
const fetch = require('node-fetch');

const TOKEN = '1639205327:AAGKLG9CX8ywSCC_jnXd-oAuYHzPBRpm5dg';
const API_QUERY = 'https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11'

const bot = new Telegraf(TOKEN);

const getRates = async function () {
    try {
        const response = await fetch(API_QUERY);
        const data = await response.json()
        return data
    } catch(e) {
        console.log(e)
    }
}

bot.command('curse', async (ctx) => {
    const resp = await getRates();
    const ready = resp.reduce((acc, { ccy, base_ccy, buy, sale }) => {
        return acc += `${ccy}:\n⬇️ Покупка: ${Number(buy)} ${base_ccy}\n⬆️ Продажа: ${Number(sale).toFixed(2)} ${base_ccy}\n\n`
    },'')
    await ctx.reply(ready);
})

bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'));
bot.hears('hi', (ctx) => ctx.reply('Hi, how are you?'))
bot.launch();