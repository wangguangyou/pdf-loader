import * as pdf from "pdfjs-dist/legacy/build/pdf.js";
import NodeCanvasFactory from "./NodeCanvasFactory";


module.exports =async function(source) {
  const callback = this.async();

  const loadingTask = pdf.getDocument(
    new Uint8Array(
       source
    )
  );
  const pdfDocument = await loadingTask.promise;
  const pages = await Promise.all(
    new Array(pdfDocument._pdfInfo.numPages)
      .fill('')
      .map((_, index) => pdfDocument.getPage(index + 1))
  )
  
  let images = pages.map(async (page,index)=>{
    const viewport = page.getViewport({ scale: 1.0 });
    const canvasFactory = new NodeCanvasFactory();
    const canvasAndContext = canvasFactory.create(
      viewport.width,
      viewport.height
    );
    const renderContext = {
      canvasContext: canvasAndContext.context,
      viewport,
      canvasFactory,
    };

    const renderTask = page.render(renderContext);
    await renderTask.promise;
    process.nextTick(()=>{
      page.cleanup()
    })
    return canvasAndContext.canvas.toDataURL()
  })
  images = await Promise.all(images)
  callback(null,`export default ${ JSON.stringify(images) }`)
};

module.exports.raw = true;