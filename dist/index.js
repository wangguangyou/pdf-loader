"use strict";

var pdf = _interopRequireWildcard(require("pdfjs-dist/legacy/build/pdf.js"));

var _NodeCanvasFactory = _interopRequireDefault(require("./NodeCanvasFactory"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

module.exports = async function (source) {
  const callback = this.async();
  const loadingTask = pdf.getDocument(new Uint8Array(source));
  const pdfDocument = await loadingTask.promise;
  const pages = await Promise.all(new Array(pdfDocument._pdfInfo.numPages).fill('').map((_, index) => pdfDocument.getPage(index + 1)));
  let images = pages.map(async (page, index) => {
    const viewport = page.getViewport({
      scale: 1.0
    });
    const canvasFactory = new _NodeCanvasFactory.default();
    const canvasAndContext = canvasFactory.create(viewport.width, viewport.height);
    const renderContext = {
      canvasContext: canvasAndContext.context,
      viewport,
      canvasFactory
    };
    const renderTask = page.render(renderContext);
    await renderTask.promise;
    process.nextTick(() => {
      page.cleanup();
    });
    return canvasAndContext.canvas.toDataURL();
  });
  images = await Promise.all(images);
  callback(null, `export default ${JSON.stringify(images)}`);
};

module.exports.raw = true;