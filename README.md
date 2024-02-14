# Element

Element (formerly known as Vector and Riot) is a Matrix web client built using the [Matrix
React SDK](https://github.com/matrix-org/matrix-react-sdk).


# Setting up a dev environment

Build and start Element itself:

```bash
yarn install
yarn start
```

Wait a few seconds for the initial build to finish; you should see something like:

```
[element-js] <s> [webpack.Progress] 100%
[element-js]
[element-js] ℹ ｢wdm｣:    1840 modules
[element-js] ℹ ｢wdm｣: Compiled successfully.
```

Remember, the command will not terminate since it runs the web server
and rebuilds source files when they change. This development server also
disables caching, so do NOT use it in production.

Open <http://127.0.0.1:8080/> in your browser to see your newly built Element.
