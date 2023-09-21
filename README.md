# Overview

Grudge Match is a tool for Age of Empires 4 players to find out who they are playing against.

It is written in React Native and set up to support iOS, Android, and the web.

# Requirements

- Node.js
- Yarn

# Setup & run

- `yarn install`

- Dev build for web `yarn web`
- Dev build for iOS `yarn ios`
- Dev build for Android `yarn android`

# Issues:

- There is currently a bug in React Native's `FlatList` when using Babel's `@babel/plugin-proposal-private-methods` plugin.\
To fix this issue the FlatList component must explicitly set its `props` field. Unfortunately you need to edit the downloaded

```javascript
// Update file `node_modules/react-native/Libraries/Lists/FlatList.js`
// ~ Line 423
this.props = props;
```


# Credits

- [AOE4 World](https://aoe4world.com/) for being another awesome tool that this tool is built off of
- Some image assets were taken from https://github.com/aoe4world/overlay