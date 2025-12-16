/**
 * download text into a file
 * @param {string} contents the text to be downloaded into a file
 * @param {string} fileName the name of the file
 */
export function download(contents: string, fileName: string): void{
  const blob = new Blob([contents], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName; // Use the user-defined file name
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url); // Clean up the object URL
}

