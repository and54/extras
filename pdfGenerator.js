import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default (reference, type = 'save') => {
  const elem = reference.getElementsByTagName('div')[0];
  const tmpcanvas = document.createElement('canvas');
  html2canvas(elem, { scale: 2 }).then(canvas => {
    const doc = new jsPDF('p', 'pt', 'letter');
    const context = tmpcanvas.getContext('2d');
    const pdfWidth = 560;
    const pdfHeight = 700;
    const pageHeight = Math.round(pdfHeight * (canvas.width / pdfWidth));
    let images = [];
    let posy = 0;

    tmpcanvas.width = canvas.width;

    for (let i = 0; i < 10; i++) {
      if (i) posy += pageHeight - 10;
      if (posy > canvas.height) break;
      const imgHeight =
        posy + pageHeight > canvas.height ? canvas.height - posy : pageHeight;
      tmpcanvas.height = imgHeight;
      context.drawImage(
        canvas,
        0, //The x coordinate where to start clipping
        posy, //The y coordinate where to start clipping
        canvas.width, //The width of the clipped image
        imgHeight, //The height of the clipped image
        0, //The x coordinate where to place the image on the canvas
        0, //The y coordinate where to place the image on the canvas
        canvas.width, //The width of the image to use (stretch or reduce the image)
        imgHeight //The height of the image to use (stretch or reduce the image)
      );
      images.push({
        image: tmpcanvas.toDataURL('image/jpeg', .8),
        height: imgHeight * (pdfWidth / canvas.width)
      });
    }

    for (let i = 0; i < images.length; i++) {
      if (i) doc.addPage();
      doc.addImage(images[i].image, 'JPEG', 30, 30, pdfWidth, images[i].height);
    }

    if (type === 'save') doc.save('payment.pdf');
    else {
      doc.autoPrint({ variant: 'non-conform' });
      window.open(doc.output('bloburl'), '_blank');
    }
  });
};
