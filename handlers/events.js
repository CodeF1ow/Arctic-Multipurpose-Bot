const fs = require("fs");
const allevents = [];
module.exports = (client) => {
  try {
    let dateNow = Date.now();
    console.log(`${String("[x] :: ".magenta)}Cargando los eventos ...`.brightGreen)
    const load_dir = (dir) => {
      const event_files = fs.readdirSync(`./events/${dir}`).filter((file) => file.endsWith(".js"));
      for (const file of event_files) {
        try{
          const event = require(`../events/${dir}/${file}`)
          let eventName = file.split(".")[0];
          if(eventName == "message") continue;
          allevents.push(eventName);
          client.on(eventName, event.bind(null, client));
        }catch(e){
          console.log(String(e.stack).grey.bgRed)
        }
      }
    }
    ["client", "guild"].forEach(e => load_dir(e));
    
    console.log(`[x] :: `.magenta + `Cargados ${allevents.length} EVENTOS despues de: `.brightGreen + `${Date.now() - dateNow}ms`.green)
    try {
      const stringlength2 = 69;
      console.log("\n")
      console.log(`     ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`.bold.yellow)
      console.log(`     ┃ `.bold.yellow + " ".repeat(-1 + stringlength2 - ` ┃ `.length) + "┃".bold.yellow)
      console.log(`     ┃ `.bold.yellow + `BOT iniciando en Discord...`.bold.yellow + " ".repeat(-1 + stringlength2 - ` ┃ `.length - `BOT iniciando en Discord...`.length) + "┃".bold.yellow)
      console.log(`     ┃ `.bold.yellow + " ".repeat(-1 + stringlength2 - ` ┃ `.length) + "┃".bold.yellow)
      console.log(`     ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`.bold.yellow)
    } catch {
      /* */ }
    } catch (e) {
    console.log(String(e.stack).grey.bgRed)
  }
};

