import { Controller } from "@hotwired/stimulus";
import { App, ToolConfig } from "dwv";

export default class extends Controller {
  static values = { url: String };

  connect() {
    console.log("DicomController connected");
    this.initLayout("one");
  }

  setTool(event) {
    const tool = event.target.dataset.toolName;
    if (this.app) this.app.setTool(tool);
  }

  one() {
    this.initLayout("one");
  }
  side() {
    this.initLayout("side");
  }
  mpr() {
    this.initLayout("mpr");
  }

  initLayout(type) {
    // Canvas-Container holen & leeren
    const container = this.element.querySelector(".dicom-canvas-container");
    container.innerHTML = "";

    // Layout-spezifische View-Konfigs erzeugen
    let dataViewConfigs;
    if (type === "one") {
      // Einzelansicht
      dataViewConfigs = {
        "*": [{ divId: "dwv_canvas_container", layerGroupCount: 1 }],
      };
    } else if (type === "side") {
      // Zwei nebeneinander
      dataViewConfigs = {
        "*": [
          { divId: "dwv_canvas_container_1", layerGroupCount: 1 },
          { divId: "dwv_canvas_container_2", layerGroupCount: 1 },
        ],
      };
      container.appendChild(
        this.createDiv("dwv_canvas_container_1", "50%", "100%")
      );
      container.appendChild(
        this.createDiv("dwv_canvas_container_2", "50%", "100%")
      );
    } else if (type === "mpr") {
      // MPR: Drei Orientierungen
      dataViewConfigs = {
        "*": [
          {
            divId: "dwv_canvas_axial",
            orientation: "axial",
            layerGroupCount: 1,
          },
          {
            divId: "dwv_canvas_sagittal",
            orientation: "sagittal",
            layerGroupCount: 1,
          },
          {
            divId: "dwv_canvas_coronal",
            orientation: "coronal",
            layerGroupCount: 1,
          },
        ],
      };
      container.appendChild(this.createDiv("dwv_canvas_axial", "100%", "33%"));
      container.appendChild(
        this.createDiv("dwv_canvas_sagittal", "100%", "33%")
      );
      container.appendChild(
        this.createDiv("dwv_canvas_coronal", "100%", "33%")
      );
    }

    // Ein Canvas-Div anlegen für one-Ansicht, falls noch nicht da
    if (type === "one") {
      if (!document.getElementById("dwv_canvas_container")) {
        container.appendChild(
          this.createDiv("dwv_canvas_container", "100%", "100%")
        );
      }
    }

    // DWV App neu initialisieren
    this.app = new App();
    this.app.init({
      dataViewConfigs: dataViewConfigs,
      tools: {
        ZoomAndPan: new ToolConfig(),
        Scroll: new ToolConfig(),
        WindowLevel: new ToolConfig(),
      },
      isMobile: false,
    });

    this.app.addEventListener("load", () => this.app.setTool("WindowLevel"));
    this.app.addEventListener("error", (e) => console.error("❌ Fehler:", e));
    this.app.loadURLs(this.urlValue.split(",").map((url) => url.trim()));
  }

  // Hilfsfunktion für Canvas-Divs
  createDiv(id, width = "100%", height = "100%") {
    const div = document.createElement("div");
    div.id = id;
    div.style.width = width;
    div.style.height = height;
    div.style.display = "inline-block";
    div.style.verticalAlign = "top";
    return div;
  }
}
