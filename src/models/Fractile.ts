import { ScreenRangeConverter2D } from "../math/ScreenRangeConverter2D";
import { IMathDrawable } from "./IMathDrawable";
import { IProcessable } from "./IProcessable";
import { MathCanvas2D } from "./MathCanvas2D";

export abstract class Fractile implements IProcessable, IMathDrawable {
  abstract draw(mathCanvas: MathCanvas2D): void;
  abstract process(): void;
  abstract stop(): boolean;
  protected calculated: boolean;
  protected worker: Worker;
  public clearCanvasBeforeDraw: boolean = true;
  public range: ScreenRangeConverter2D;

  public onresize(width: number, height: number): void {
    if (this.range != null) {
      this.range.resize(width, height);
    }
  }


  public disposeOfWorker(): void {
    if (this.worker != undefined && this.worker != null) {
      this.worker.terminate();
      this.worker = undefined;
    }
  }
}