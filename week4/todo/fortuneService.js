// stand-in for an asynchronous service

export { fortuneService }

const fortunes = [
    "Do the WebPr Homework",
    "Care for the JavaScript Toolbox",
    "Watch the recommended videos",
    "Read the recommended chapters in You-dont-know-JS",
    "Do the dataflow excel challenge!"
];

function fortuneService(whenDone) {
    setTimeout(
        () => whenDone(fortunes[Math.floor((Math.random() * fortunes.length))]),
        Math.floor((Math.random() * 3000))
    );
}