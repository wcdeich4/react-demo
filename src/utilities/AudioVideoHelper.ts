



export abstract class AudioVideoHelper
{
  /**
   * download a url resource to a file
   * @param urlToDownload {string} url of resource to download
   * @param downloadFilename {string} filename to save as
   * @param revokeURLAfterDownload {boolean} revokes url if true
   */
  public static downloadURL(urlToDownload: string, downloadFilename: string, revokeURLAfterDownload: boolean = false): void
  {
    let a = document.createElement('a'); 
    a.href = urlToDownload;
    a.download = downloadFilename;
    document.body.appendChild(a);
    a.click();
    if (revokeURLAfterDownload)
    {
      URL.revokeObjectURL(urlToDownload);
    }
  }

  /**
   * 
   * @param blobOrMediaSource {Blob | MediaSource} object to download
   * @param downloadFilename {string} filename to save as
   * @param revokeURLAfterDownload {boolean} revokes url if true
   */
  public static downloadBlobOrMediaSource(blobOrMediaSource: Blob | MediaSource, downloadFilename: string, revokeURLAfterDownload: boolean = false): void
  {
    const url = URL.createObjectURL(blobOrMediaSource);
    AudioVideoHelper.downloadURL(url, downloadFilename, revokeURLAfterDownload);
  }

  /**
   * https://www.reddit.com/r/reactjs/comments/11n5ac0/export_nivo_diagram_as_a_picture
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL
   * @param canvasElement {HTMLCanvasElement} HTML Canvas Element to download
   * @param downloadFilename {string} name for file to download image as
   */
  public downloadCanvasToPNG(canvasElement: HTMLCanvasElement, downloadFilename: string)
  {
    let dataURL = canvasElement.toDataURL('image/png');
    // Change MIME type to trick the browser to downlaod the file instead of displaying it 
    dataURL = dataURL.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');

    // In addition to <a>'s "download" attribute, you can define HTTP-style headers 
    dataURL = dataURL.replace(/^data:application\/octet-stream/, 'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=' + downloadFilename + '.png');

    AudioVideoHelper.downloadURL(dataURL, downloadFilename, true);

  }
}