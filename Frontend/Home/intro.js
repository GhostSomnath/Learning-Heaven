const intro = introJs();

intro.stepOptions({
    steps: [
        {
            element: '#intro',
            intro: "welcome to the Learning heaven"
        },
        {
            element: '#step-one',
            intro: "this is the first step"
        },
        {
            element: '#step-two',
            intro: "this is the second step"
        },
    ]
});


document.querySelector('.start-step').addEventListener('click', function(){
    intro.start();
})

intro.start();