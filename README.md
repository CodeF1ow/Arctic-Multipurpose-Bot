# Arctic-Bot
Bot Multifuncional

# Servidor público del bot y soporte técnico!

<a href="https://arcticbot.xyz/discord"></a>
 
[**Invitar a la versión pública de este bot**](https://arcticbot.xyz/) para que no tenga que alojarlo usted mismo [únete a mi servidor Discord](https://arcticbot.xyz/discord) para obtener un Bot personalizado hosteado para ti!


# El creador de este codigo ❤️
En primer lugar, gracias por el código fuente [Tomato](https://github.com/Tomato6966)

* Agregando la traduccion a Español y el lenguaje por defecto pasa a ser Español.
* Tambien se han corregido varios errores del bot y eliminadas algunas funciones que estaban funcionando.
 
 [Servidor de Discord](https://arcticbot.xyz/discord)
# Guia de Instalacion 🔥

## ✅ Requisitos del Host

<details>
  <summary>Haga clic para ampliar</summary>

  * [nodejs](https://nodejs.org) version 16.6 o superior, Recomiendo la última versión STABLE
  * [python](https://python.org) version 3.8 o superior, para instalar la base de datos `enmap` (better-sqlite3)

</details>

## 🤖 Requisitos del bot

<details>
  <summary>Haga clic para ampliar</summary>
 
  1. Descargar el [Source Code](https://arcticbot.xyz/github)
     * Either by: `git clone https://github.com/K1ri86/Arctic-Bot-Multifuncional`
     * O descargándolo como zip desde la pestaña de lanzamientos o una rama.
  
</details>

## 🎶 Requisitos para música

<details>
  <summary>Haga clic para ampliar</summary>

  *Para permitir que su Bot reproduzca música, debe conectarlo a una estación LavaLink!*
  *Hay muchos públicos por ahí, por ejemplo. lava.link*
  An example for a public configuration will be listed down below.
   
  1. Asegúrese de que `Java 11` está instalado en su sistema!
     * [Haga clic aquí para descargar para **Linux**](https://github.com/Tomato6966/Debian-Cheat-Sheet-Setup/wiki/3.5.2-java-11)
     * [Haga clic aquí para descargar para **Windows**](https://downloads.milrato.eu/windows/java/jdk-11.0.11.exe) ​
  2. Descargar [Lavalink.jar](https://github.com/freyacodes/Lavalink/releases/download/3.4/Lavalink.jar)
     * Aquí hay un enlace directo: https://github.com/freyacodes/Lavalink/releases/download/3.4/Lavalink.jar
     * Si estás en linux haz esto: `wget https://github.com/freyacodes/Lavalink/releases/download/3.4/Lavalink.jar` (prep: `apt-get install -y wget`)
  3. Descargar [application.yml](https://cdn.discordapp.com/attachments/734517910025928765/934084553751015475/application.yml)
     * Descargue mi ejemplo, es la configuración del archivo lavalink.jar!
  4. Ahora pon application.yml y Lavalink.jar en la misma carpeta e inicialo
     * Para iniciar LavaLink escribe: `java -jar Lavalink.jar`
     * Asegúrese de mantener su terminal abierto!
     * Si desea utilizar algo como `npm i -g pm2` para alojarla sin mantener su terminal abierta escriba: `pm2 start java -- -jar Lavalink.jar`
  5. Los ajustes como **password** en application.yml y **port** debe proporcionarse en el `botconfig/config.json` del Bot
     * Si ha utilizado la configuración por defecto, no es necesario realizar ningún ajuste y debería tener el siguiente aspecto: 
     ```json
     {
        "clientsettings": {
            "nodes": [
                {
                    "host": "localhost",
                    "port": 2333,
                    "password": "youshallnotpass"
                }
            ]
        }
     }
     ```
  6. No quiere alojar su propio LavaLink?
     * [Aquí hay una lista de muchos servidores LavaLink de uso gratuito!](https://lavalink.darrennathanael.com/#how2host)
     * O simplemente utilizar algo como esto: 
     ```json
     {
        "clientsettings": {
            "nodes": [
                {
                    "host": "lava.link",
                    "port": 80,
                    "password": "Anything for the Password"
                }
            ]
        }
     }
     ```

</details>

## 🤖 Configuración y puesta en marcha

<details>
  <summary>Haga clic para ampliar</summary>

  **NOTA:** *Puedes hacer exactamente la misma configuración dentro del archivo `example.env`, sólo asegúrate de cambiarle el nombre a `.env` o utilizar variables de entorno!*
 
   1. Consulte `🎶 Requisitos de música` que comenzó a lavalink / utilizar una estación lavalink pública válida.
   2. Rellene todos los datos requeridos en `./botconfig/config.json` **NOTA:** *Si estás en replit.com, está expuesto a todo el mundo!(use .env en cambio)*
   3. Rellene todos los datos requeridos en el `.json` archivos en `./social_log/` (`./social_log/streamconfig.json` & `./social_log/twitter.json`), si quieres que los LOGS SOCIALES funcionen! (la clave `authToken` en streamconfig no necesita ser rellenada!)
   4. Puede ajustar algunos parámetros en el otro archivo`./botconfig/*.json`, **PERO POR FAVOR __MANTENGA__ MIS CRÉDITOS Y ANUNCIOS!** Esta es la única manera en que mi trabajo duro es "Compensado".".
   5. Ahora inicia el bot abriendo una línea cmd en esa carpeta y escribiendo: `node index.js` o `npm start`
     * Si no quieres mantener el terminal abierto o si estás en linux, echa un vistazo a [pm2 (y tutorial de Tomato6966)](https://github.com/Tomato6966/Debian-Cheat-Sheet-Setup/wiki/4-pm2-tutorial) y escriba: `pm2 start --name Bot_Name index.js`
  
</details>

## ❓ Dónde conseguir las claves Api

<details>
  <summary>Haga clic para ampliar</summary>

  **NOTA:** *Puedes hacer exactamente la misma configuración dentro del archivo `example.env`, sólo asegúrate de cambiarle el nombre a `.env` o use variables de entorno!*
 
  1. `./botconfig/config.json`
     * `token` puede obtener de: [discord-Developers](https://discord.com/developers/applications)
     * `memer_api` puede obtener de: [Meme-Development DC](https://discord.gg/Mc2FudJkgP)
     * `spotify.clientSecret` puede obtener de: [Spotify-Developer](https://developer.spotify.com)
     * `spotify.clientID` puede obtener de: [Spotify-Developer](https://developer.spotify.com)
     * `fnbr` es un FNBR token, que puede obtener de [FNBRO.co](https://fnbr.co/api/docs) (necesario para fnshop)
     * `fortnitetracker` es un token de FORTNITE TRACKER, que puedes obtener de [fortnitetracker.com](https://fortnitetracker.com/site-api) (necesario para fnstats)
  2. `./social_log/streamconfig.json`
     * `twitch_clientID` puede obtener de: [Twitch-Developer](https://dev.twitch.tv/docs/api) ([developer-console](https://dev.twitch.tv/console))
     * `twitch_secret` puede obtener de: [Twitch-Developer](https://dev.twitch.tv/docs/api) ([developer-console](https://dev.twitch.tv/console))
     * `authToken` no es necesario rellenarla --> se hará automáticamente
  3. `./social_log/twitter.json`
     * `consumer_key` puede obtener de: [twitter Developers](https://developer.twitter.com)
     * `consumer_secret` puede obtener de: [twitter Developers](https://developer.twitter.com)
     * `access_token` puede obtener de: [twitter Developers](https://developer.twitter.com)
     * `access_token_secret` puede obtener de: [twitter Developers](https://developer.twitter.com)
  
</details>


## APÓYAME A MÍ Y AL DESARROLLO DE ARCTIC

# Creditos

> Si consideras usar este Bot, asegúrate de darme creditos!
> Ejemplo: `Bot desarrolado por [Tomato#6966](https://discord.gg/dcdev) pero modificado por [Kiri86#8565](arcticbot.xyz/discord)`

# Contribuyendo a

> Si quieres ayudar a mejorar el código del Bot, corregir errores ortográficos o de diseño o si es posible incluso errores de código, puedes crear PULL REQUESTS.
> Gracias a cualquiera que considere ayudarme!
