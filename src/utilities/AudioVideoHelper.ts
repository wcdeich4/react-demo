/**
 * download a url resource to a file
 * @param urlToDownload {string} url of resource to download
 * @param downloadFilename {string} filename to save as
 * @param revokeURLAfterDownload {boolean} revokes url if true
 */
export function downloadURL(urlToDownload: string, downloadFilename: string, revokeURLAfterDownload: boolean = false): void
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
 * download text into a file
 * @param {string} contents the text to be downloaded into a file
 * @param {string} fileName the name of the file
 */
export function downloadText(contents: string, fileName: string): void{
  const blob = new Blob([contents], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  downloadURL(url, fileName, true);
}

/**
 * download a Blob or MediaSource to a file
 * @param {Blob | MediaSource} blobOrMediaSource object to download
 * @param {string} downloadFilename  filename to save as
 * @param {boolean} revokeURLAfterDownload revokes url if true
 */
export function downloadBlobOrMediaSource(blobOrMediaSource: Blob | MediaSource, downloadFilename: string, revokeURLAfterDownload: boolean = false): void
{
  const url = URL.createObjectURL(blobOrMediaSource);
  downloadURL(url, downloadFilename, revokeURLAfterDownload);
}

/**
 * https://www.reddit.com/r/reactjs/comments/11n5ac0/export_nivo_diagram_as_a_picture
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL
 * @param canvasElement {HTMLCanvasElement} HTML Canvas Element to download
 * @param downloadFilename {string} name for file to download image as
 */
export function downloadCanvasToPNG(canvasElement: HTMLCanvasElement, downloadFilename: string)
{
  let dataURL = canvasElement.toDataURL('image/png');
  // Change MIME type to trick the browser to downlaod the file instead of displaying it 
  dataURL = dataURL.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');

  // In addition to <a>'s "download" attribute, you can define HTTP-style headers 
  dataURL = dataURL.replace(/^data:application\/octet-stream/, 'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=' + downloadFilename + '.png');

  downloadURL(dataURL, downloadFilename, true);
}
