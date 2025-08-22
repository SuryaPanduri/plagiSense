import Jimp from "jimp";

export async function fmmSimilarity(img1Path, img2Path) {
  try {
    const img1 = await Jimp.read(img1Path);
    const img2 = await Jimp.read(img2Path);

    console.log("img1 bitmap:", img1.bitmap);
    console.log("img2 bitmap:", img2.bitmap);

    const SIZE = 64;

    // Resize + grayscale
    try {
      img1.resize(SIZE, SIZE).grayscale();
      img2.resize(SIZE, SIZE).grayscale();
    } catch (err) {
      console.error("Error resizing images:", err);
      throw err;
    }

    let diff = 0;

    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        const gray1 = Jimp.intToRGBA(img1.getPixelColor(x, y)).r;
        const gray2 = Jimp.intToRGBA(img2.getPixelColor(x, y)).r;

        // Threshold difference
        if (Math.abs(gray1 - gray2) > 5) diff++;
      }
    }

    const similarity = (1 - diff / (SIZE * SIZE)) * 100;
    return similarity;
  } catch (err) {
    console.error("❌ fmmSimilarity error:", err);
    throw err;
  }
}