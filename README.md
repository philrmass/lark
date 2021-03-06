# Lark

By Phil Mass

### Description

A PwA music player built with React and Koa

### Installation

#### Install dependencies and build the client
```
yarn setup
yarn build
```

#### Run the server at `localhost:4445`
```
yarn start [PATH-1] [PATH-N]
```
*Paths will be added to the library and scanned for music files*

#### Start over SSH and logout
```
nohup yarn start &
disown
```

#### Run the development client at `localhost:8080`
```
yarn dev
```

### Improvements
- Solve problem of too large local storage (local forage?)
- If queue empty, display a message
- Remove NotFound, redirect to Artists instead
- Stop playing before switching devices
- Show server errors in app bottom right corner, red dot, clear
- Figure out how to take over TV, other non-play issues
- Add by-letter quick scroll on right-side of artists
- Add search (artist, album, and song)
- Add groups to output
- Add drag and drop to queue
- Add art to album display
- Add wait spinner during network calls
- Show album release date, add to more
