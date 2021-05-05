# QuarantinoFlix(client)
QuarantinoFlix(client) App runs using Build TOOL Parcel and Babel

## Project description 
This project addresses the development of the client-side of the movie application QuarantinoFlix. The frontend will be build by using the React framework. This will interact with the REST API that has been previously defined in a preceding project. In the end, the whole application will follow the MERN tech stack.

## setting up Parcel 
in the command prompt type:

```
npm install -g parcel-bundler
```

within app-folder create a "package.json" file with an empty JSON object: {}.

installing necessary dependencies in client-folder:
```
npm install --save react-dom
```
```
npm install --save-dev babel-preset-react babel-preset-env
```
```
npm install --save-dev babel-plugin-transform-class-properties
```

for building and running application use index.html as entry point for parcel

within Terminal, type:
```
npm start to run the build process
```
app will be run on: localhost:1234 

## Dependencies 
* React 
* ReactDOM 
* React-Bootstrap 
* Axios 
* PropTypes 
* Redux 

### Dev dependencies
* Babel 
* Sass 

## API 
This project connects to this API <br>
https://github.com/Calamity-chain/Quarantino <br>
https://quarantinoflix.herokuapp.com/

[![Netlify Status](https://api.netlify.com/api/v1/badges/d970e449-da3e-4f43-b5e2-19ab9b9d34fd/deploy-status)](https://app.netlify.com/sites/quarantinoflix/deploys)
