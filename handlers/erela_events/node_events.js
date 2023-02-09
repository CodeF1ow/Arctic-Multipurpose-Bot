const stringlength = 69;
module.exports = (client) => {
    client.manager
        .on("nodeConnect", (node) => {
            console.log("\n")
            console.log(`     ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`.bold.brightGreen)
            console.log(`     ┃ `.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length) + "┃".bold.brightGreen)
            console.log(`     ┃ `.bold.brightGreen + `Node Conectado: `.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length - `Node Conectado: `.length) + "┃".bold.brightGreen)
            console.log(`     ┃ `.bold.brightGreen + ` { ${node.options.identifier} } `.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length - ` { ${node.options.identifier} } `.length) + "┃".bold.brightGreen)
            console.log(`     ┃ `.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length) + "┃".bold.brightGreen)
            console.log(`     ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`.bold.brightGreen)
        })
        .on("nodeCreate", (node) => {
            console.log("\n")
            console.log(`     ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`.bold.brightGreen)
            console.log(`     ┃ `.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length) + "┃".bold.brightGreen)
            console.log(`     ┃ `.bold.brightGreen + `Node creado: `.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length - `Node creado: `.length) + "┃".bold.brightGreen)
            console.log(`     ┃ `.bold.brightGreen + ` { ${node.options.identifier} } `.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length - ` { ${node.options.identifier} } `.length) + "┃".bold.brightGreen)
            console.log(`     ┃ `.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length) + "┃".bold.brightGreen)
            console.log(`     ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`.bold.brightGreen)
        })
        .on("nodeReconnect", (node) => {
            console.log("\n")
            console.log(`     ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`.bold.brightYellow)
            console.log(`     ┃ `.bold.brightYellow + " ".repeat(-1 + stringlength - ` ┃ `.length) + "┃".bold.brightYellow)
            console.log(`     ┃ `.bold.brightYellow + `Node reconectado: `.bold.brightYellow + " ".repeat(-1 + stringlength - ` ┃ `.length - `Node reconectado: `.length) + "┃".bold.brightYellow)
            console.log(`     ┃ `.bold.brightYellow + ` { ${node.options.identifier} } `.bold.brightYellow + " ".repeat(-1 + stringlength - ` ┃ `.length - ` { ${node.options.identifier} } `.length) + "┃".bold.brightYellow)
            console.log(`     ┃ `.bold.brightYellow + " ".repeat(-1 + stringlength - ` ┃ `.length) + "┃".bold.brightYellow)
            console.log(`     ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`.bold.brightYellow)
        })
        .on("nodeDisconnect", (node) => {
            //setTimeout(()=>{node.connect();}, 1000);
            console.log("\n")
            console.log(`     ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`.bold.brightMagenta)
            console.log(`     ┃ `.bold.brightMagenta + " ".repeat(-1 + stringlength - ` ┃ `.length) + "┃".bold.brightMagenta)
            console.log(`     ┃ `.bold.brightMagenta + `Node desconectado: `.bold.brightMagenta + " ".repeat(-1 + stringlength - ` ┃ `.length - `Node desconectado: `.length) + "┃".bold.brightMagenta)
            console.log(`     ┃ `.bold.brightMagenta + ` { ${node.options.identifier} } `.bold.brightMagenta + " ".repeat(-1 + stringlength - ` ┃ `.length - ` { ${node.options.identifier} } `.length) + "┃".bold.brightMagenta)
            console.log(`     ┃ `.bold.brightMagenta + " ".repeat(-1 + stringlength - ` ┃ `.length) + "┃".bold.brightMagenta)
            console.log(`     ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`.bold.brightMagenta)
        })
        .on("nodeError", (node, error) => {
            //setTimeout(()=>{node.connect();}, 1000);
            console.log("\n")
            console.log(`     ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`.bold.brightRed)
            console.log(`     ┃ `.bold.brightRed + " ".repeat(-1 + stringlength - ` ┃ `.length) + "┃".bold.brightRed)
            console.log(`     ┃ `.bold.brightRed + `Node error: `.bold.brightRed + " ".repeat(-1 + stringlength - ` ┃ `.length - `Node reconectado: `.length) + "┃".bold.brightRed)
            console.log(`     ┃ `.bold.brightRed + ` { ${node.options.identifier} } `.bold.brightRed + " ".repeat(-1 + stringlength - ` ┃ `.length - ` { ${node.options.identifier} } `.length) + "┃".bold.brightRed)
            console.log(`     ┃ `.bold.brightRed + " ".repeat(-1 + stringlength - ` ┃ `.length) + "┃".bold.brightRed)
            console.log(`     ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`.bold.brightRed)
            if(error && error.toString().includes("ECONNREFUSED")) {
                console.error(`No hay permisos para conectarse al Lavalink: ${node.options.host}\nPuerto: ${node.options.port}\nContraseña: ${node.options.password}\n :: Tal vez contraseña incorrecta / Lavalink offline?`)
            } else if(error) {
                console.error(error);
            }
        })

};
