export function base64ToFile(base64, filename) {
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];

  const binary = atob(arr[1]);

  let n = binary.length;

  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = binary.charCodeAt(n);
  }

  return new File(
    [u8arr],
    filename,
    {
      type: mime,
    }
  );
}