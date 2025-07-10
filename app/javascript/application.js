import { Application } from "@hotwired/stimulus";
import DicomController from "./controllers/DicomController";

const application = Application.start();
application.register("dicom", DicomController);
