// Tensorflow.js code!

define([],
    function() {
        return {
            getPredictions: function(imageElement) {
                async function init() {
                    let model = await tmImage.load("./models/model.json", "./models/metadata.json");
                    const prediction = await model.predict(imageElement);
                    imageDiv=document.getElementById('imageDiv');
                    while (imageDiv.hasChildNodes()) {
                        imageDiv.removeChild(imageDiv.firstChild);
                      }                      

                    imageDiv.appendChild(imageElement);
                    //console.log(prediction); // returns predictions as a table.
                    result=document.getElementById('resultDiv');
                    if(prediction[0].probability>0.5)
                    { result.textContent ="Buildings present"; document.getElementById("bodyloadimg").style.display = "none"; return 1;}
                    else
                    {result.textContent ="No Buildings"; document.getElementById("bodyloadimg").style.display = "none"; return -1;}

                };
                return init();
            }
        };
    })