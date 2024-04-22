const express = require('express')
const path = require('path')

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const app = express()

const dbPath = path.join(__dirname, 'cricketTeam.db')

let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}

initializeDBAndServer()
app.get('/players/', async (request, response) => {
  const getPlayersQuery = `
    SELECT
      *
    FROM
      players
    ORDER BY
      player_name;`
  const PlayersArray = await db.all(getPlayersQuery)
  response.send(PlayersArray)
})

app.post('/players/', async (request, response) => {
  const playerDetails = request.body
  const {player_id, player_name, jersey_number, role} = playerDetails
  const addPlayerQuery = `
  INSERT INTO PLAYERS( player_name, jersey_number, role)
  VALUES(
    '${player_name}',
    '${jersey_number}'
    '${role}'
  );`
  const dbResponse = await db.run(addPlayerQuery)
  const PlayerId = dbResponse.lastID
  response.send('Player Added to Team')
})

app.get('/players/:playerId', async (request, response) => {
  const {playerId} = request.params
  const getPlayersQuery = `
    SELECT
      *
    FROM
      players
    WHERE
      player_id= ${playerId};`
  const PlayersArray = await db.get(getPlayersQuery)
  response.send(PlayersArray)
})

app.put('/players/:playerId', async (request, response) => {
  const {playerId} = request.params
  const playerDetails = request.body
  const {player_id, player_name, jersey_number, role} = playerDetails
  const updatePlayerQuery = `
    UPDATE
      player
    SET
      player_id='${playerId}',
      player_name=${player_name},
      jersey_number=${jersey_number},
      role=${role},
    WHERE
      player_id = ${playerId};`
  await db.run(updatePlayerQuery)
  response.send('Player Details Updated')
})

app.delete('/players/:playerId', async (request, response) => {
  const {playerId} = request.params
  const deletePlayerQuery = `
    DELETE FROM
      player
    WHERE
      player_id = ${playerId};`
  await db.run(deletePlayerQuery)
  response.send('Player Removed')
})

module.exports = app
