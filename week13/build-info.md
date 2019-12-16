For running the code that is build on the ES6 module feature you either
- have to run a local server like with `npx http-server -c-1` or
- use a bundler like webpack, parcel, or [rollup](https://rollupjs.org), e.g.
  - install with  `sudo npm install --global rollup`
  - run via `rollup -o allTestsSuiteBundle.js -f es -w . allTestsSuite.js` 
  
        