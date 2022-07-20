"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _canvas = _interopRequireDefault(require("canvas"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class NodeCanvasFactory {
  create(width, height) {
    const canvas = _canvas.default.createCanvas(width, height);

    const context = canvas.getContext("2d");
    return {
      canvas,
      context
    };
  }

  reset(canvasAndContext, width, height) {
    canvasAndContext.canvas.width = width;
    canvasAndContext.canvas.height = height;
  }

  destroy(canvasAndContext) {
    canvasAndContext.canvas.width = 0;
    canvasAndContext.canvas.height = 0;
    canvasAndContext.canvas = null;
    canvasAndContext.context = null;
  }

}

exports.default = NodeCanvasFactory;