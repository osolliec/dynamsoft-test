import React from "react";
import Dynamsoft from "dwt";

let camera = null;
export default class DWT extends React.Component {
  constructor(props) {
    super(props);
  }
  DWObject = null;
  camera = null;
  containerId = "dwtcontrolContainer";
  componentDidMount() {
    Dynamsoft.DWT.RegisterEvent("OnWebTwainReady", () => {
      this.Dynamsoft_OnReady();
    });
    Dynamsoft.DWT.ProductKey =
      "t0154KQMAAATATj9c59vqmJE7nAM5ppFefOc0H8s/dvNDe2eMnIb5/hsDFxfwicHLZ6xtqgQKc1luIkTeC6QStNchaFlReTy+odQ3jMAgu0h7JZteleHDvN1IMbip8zf+1p354Lho1KkMDxjpG+9P24SZzx5ynLk2PGCkb8LMlYn7nNT+8SugrWSmluEBI31TMl/NrDNlJP4BqCWjAA==";
    Dynamsoft.DWT.ResourcesPath = "/dwt-resources";
    Dynamsoft.DWT.Containers = [
      {
        WebTwainId: "dwtObject",
        ContainerId: this.containerId,
        Width: "300px",
        Height: "400px",
      },
    ];
    Dynamsoft.DWT.Load();
  }
  Dynamsoft_OnReady() {
    this.DWObject = Dynamsoft.DWT.GetWebTwain(this.containerId);
    this.createCamera(this);
    console.log(this.camera);
  }
  acquireImage() {
    this.DWObject.AcquireImage();
  }
  acquireCamera() {
    if (camera) {
      camera.Addon.Camera.capture().then(function (result) {
        console.log(result);
        var objectURL = URL.createObjectURL(result);
        document.getElementById("img").src = objectURL;
      });
    }
  }
  createCamera(obj) {
    var cameraObj;
    Dynamsoft.DWT.CreateDWTObjectEx(
      {
        WebTwainId: "camera",
        UseLocalService: false,
      },
      function (obj) {
        cameraObj = obj;
        cameraObj.AcquireImage();
        //cameraObj.Viewer.bind(document.getElementById("container"));
        const template = cameraObj.Viewer.createTemplate("documentScanner", {
          scannerViewer: {
            maxDocuments: 1,
            autoDetect: {
              acceptedBlurryScore: 10,
              enableAutoDetect: true,
              //acceptedPolygonConfidence: 90,
            },
            autoScan: {
              enableAutoScan: true,
            },
          },
          documentEditorSettings: {},
        });
        cameraObj.Viewer.bind(document.getElementById("container"), template);

        cameraObj.Viewer.width = 480;
        cameraObj.Viewer.height = 640;
        cameraObj.Viewer.show();
        cameraObj.Addon.Camera.play();
        camera = cameraObj;

        cameraObj.HTTPUpload();
      },
      function (ec, es) {
        console.log(es);
        return null;
      }
    );
  }

  render() {
    return (
      <>
        <button onClick={() => this.acquireCamera()}>Download Last File</button>
        <div id={this.containerId}> </div>
      </>
    );
  }
}
