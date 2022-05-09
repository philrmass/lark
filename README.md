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

#### Run the development client at `localhost:8080`
```
yarn dev
```

### Improvements
#### To Finish
- Add time - to setTime(time - 5) or setTime(0)
- Add time + to setTime(time + 5) or setTime(duration)
- Add next to setIndex(1)
- Add previous to seek(0) or setIndex(-1) if time < 2
- Set volume before play instead of after setOutput, does it work?
- Add duration to album data
- Display album duration and release date
- Deloy to server
#### After Finish
- Add by-letter quick scroll on right-side of artists
- Add search (artist, album, and song)
- Add groups to output
- Add drag and drop to queue
- Add art to album display
- Add wait spinner during network calls
