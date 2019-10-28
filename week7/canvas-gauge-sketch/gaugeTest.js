// requires /util/test.js
// requires gauge.js

const gauge = Suite("gauge");

gauge.test("no-exception", assert => {

    const canvas = document.createElement("canvas");

    canvas.style = "" +
                   "--section-divider:   0.6;" +
                   "--section-one-color: red;" +
                   "--section-two-color: green;" +
                   "--progress-color:    rgba(116,160,194,0.5);";

    document.body.appendChild(canvas);

    try {
        progressPie(canvas, 0.55);
        assert.true(true);
    } catch(err) {
        assert.true(false);
    }

    document.body.removeChild(canvas);
});

gauge.test("evt-value", assert => {

    const progressView = {width: 200, height: 200};

    assert.is( valueFromEvent( progressView, {type: "", offsetX: 100, offsetY:  0}), 1);
    assert.is( Math.floor( 100 * valueFromEvent( progressView, {type: "", offsetX: 101, offsetY:  0})), 0);
    assert.is( valueFromEvent( progressView, {type: "", offsetX: 200, offsetY:100}), 0.25);
    assert.is( valueFromEvent( progressView, {type: "", offsetX: 100, offsetY:200}), 0.5);
    assert.is( valueFromEvent( progressView, {type: "", offsetX:   0, offsetY:  0}), 7/8);
});
