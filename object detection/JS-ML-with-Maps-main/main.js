// Main Mapping Application.

require([
    "esri/config",
    "esri/Map",
    "esri/views/MapView",
    "esri/widgets/Sketch/SketchViewModel",
    "esri/layers/GraphicsLayer",
    "esri/layers/FeatureLayer",
    "esri/geometry/geometryEngine",
    "esri/Graphic",
    // image recognition (tensorflow)
    "./modules/imageRecognition.js",

    // url, extentObject
    "./modules/returnImageByExtent.js"
], function(
    esriConfig,
    Map,
    MapView,
    SketchViewModel,
    GraphicsLayer,
    FeatureLayer,
    geometryEngine,
    Graphic,
    imageRecognition,
    returnImageByExtent
) {
    esriConfig.apiKey = 'AAPK57b45df9240f487397d837cb99175c99uGDqxpt-n3HuFLL2zDZofqcX1M7UI6_7G3RGXC2lO2dpd4hzrPjB77uW84SMs6-N';
    document.getElementById("bodyloadimg").style.display = "none";

    var worldImageService = "https://tiledbasemaps.arcgis.com/arcgis/rest/services/World_Imagery/MapServer";//"https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer"; // add your image service here!
    // Note: https://tiledbasemaps.arcgis.com/arcgis/rest/services/World_Imagery/MapServer requires Developer, or AGOL Subscription.

    var tempGraphicsLayer = new GraphicsLayer();
var school_data;
    point_layer = new FeatureLayer({url: "https://webgis1.nic.in/publishing/rest/services/MServices/school/MapServer/0"});

    point_layer.queryFeatures().then(function(results){
        // prints an array of all the features in the service to the console
      //  console.log(results.features[1].geometry.latitude);
      school_data=results;
      feature_count=results.features.length;
    /*  for (let i=0;i<10;i++)
      {  
        console.log(i);
        var buffer = geometryEngine.geodesicBuffer(
            results.features[i].geometry,
            200,
            "meters"
          );

         // tempGraphicsLayer.add(new Graphic({geometry: buffer}));

        var image = returnImageByExtent.getimageData(worldImageService, buffer.extent);
            // Once image returned, get predictions.
            image.then(function(results) {
                var canvas = document.getElementById('myCanvas');
                var context = canvas.getContext('2d');
                var sourceX = 200;
                var sourceY = 200;
                var sourceWidth = 100;
                var sourceHeight = 100;
                context.drawImage(results, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, 100, 100);
                let school_image = new Image();
                school_image.src = canvas.toDataURL('image/png');
                final_return=imageRecognition.getPredictions(school_image);
                final_return.then(function(prediction){ 
                    if(prediction==1) console.log(school_data.features[i].attributes['school_nam']);
                });
            });
        }
    */
});
    

    var map = new Map({
        basemap: "satellite",
        layers: [tempGraphicsLayer]
    });

    map.add(point_layer);

    var view = new MapView({
        container: "viewDiv",
        map: map,
        zoom: 15,
        center: [70.91179388712932,26.91858344485044]
    });
    view.constraints.maxZoom = 15;

    // Drawing toolbar
    var sketchVM = new SketchViewModel({
        layer: tempGraphicsLayer,
        view: view
    });

    // On "draw box"
    sketchVM.on("create", function(event) {
        if (event.state === "complete") {
            document.getElementById("bodyloadimg").style.display = "block";
            // Get image by extent defined.
            var image = returnImageByExtent.getimageData(worldImageService, event.graphic.geometry.extent);
            // Once image returned, get predictions.
            image.then(function(results) {

      var canvas = document.getElementById('myCanvas');
      var context = canvas.getContext('2d');
      var sourceX = 200;
      var sourceY = 200;
      var sourceWidth = 100;
      var sourceHeight = 100;
      context.drawImage(results, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, 100, 100);
      let school_image = new Image();
      school_image.src = canvas.toDataURL('image/png');
      imageRecognition.getPredictions(school_image);
      
    });
        };
    });

    document.getElementById("draw-button").addEventListener("click", function() {
        if(document.getElementById("draw-button").textContent=="Click to draw")
        document.getElementById("draw-button").textContent="Click to clear";
        else
        {document.getElementById("draw-button").textContent="Click to draw";
       // result.textContent ="Results will be displayed here";
        }
        tempGraphicsLayer.removeAll();
        sketchVM.create("rectangle", {
            mode: "freehand"
        });
    })
});