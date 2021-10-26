import PDFLib, { PDFDocument, PDFPage } from 'react-native-pdf-lib';
import { FileSystem } from 'react-native-unimodules';
import * as IntentLauncher from 'expo-intent-launcher';

import { PermitLogObject } from '../storage/logs.storage';

const fontOptions = {
  x: 60,
  // y: 1674,
  color: '#000000',
  fontSize: 22,
  fontName: 'Arial',
  textAlign: 'center'
};

interface Line {
  text: string | string[];
  size: number;
  marginTop?: number;
  columnWidth?: number;
}

export const generatePdf = async (permitLog: PermitLogObject) => {
  const docsDir = await PDFLib.getDocumentsDirectory();

  const date = new Date(permitLog.startTimestamp);
  const fileName = date.toISOString().split('T')[0];
  const fileNameTime = date.toLocaleTimeString('en-US', { hour12: false, hour: 'numeric', minute: 'numeric' });

  const pdfPath = `${docsDir}/permit-log-${fileName}_${fileNameTime}.pdf`;

  const page1 = PDFPage.create().setMediaBox(1240, 1754);

  const lines: Line[] = [
    {
      text: 'Enclosed space entry log',
      size: 54
    },
    {
      text: 'Date: ' + date.toLocaleDateString(),
      size: 22,
      marginTop: 20
    },
    {
      text: 'Start time: ' + date.toLocaleTimeString('en-US', { hour12: false }),
      size: 22
    },
    {
      text: 'Vessel: ' + permitLog.vesselName,
      size: 22,
      marginTop: 50
    },
    {
      text: 'Space to be entered:   ' + permitLog.location,
      size: 22
    },
    {
      text: 'Safety parameters:',
      size: 22,
      marginTop: 40
    },
    {
      text: ['', 'Min value', 'Max value'],
      size: 22,
      columnWidth: 200
    }
  ];

  permitLog.safetyParameters.forEach((param) =>
    lines.push({
      text: [param.title, (param.minValue || '-').toString(), (param.maxValue || '-').toString()],
      size: 22,
      columnWidth: 200
    })
  );

  lines.push({
    text: '',
    marginTop: 40,
    size: 22
  });

  permitLog.timers.forEach((timer) =>
    lines.push({
      text: [timer.title, timer.interval + 'mins'],
      size: 22,
      columnWidth: 300
    })
  );

  lines.push({
    text: 'Person in charge: ' + permitLog.personInCharge,
    marginTop: 40,
    size: 22
  });

  console.log(permitLog.logs);

  let currentLineHeight = 1674;

  for (const line of lines) {
    currentLineHeight -= line.size + 10;

    if (line.marginTop) {
      currentLineHeight -= line.marginTop;
    }

    if (Array.isArray(line.text)) {
      let currentColumnOffsetX = 60;

      for (const column of line.text) {
        await page1.drawText(
          column,
          Object.assign({}, fontOptions, { y: currentLineHeight, fontSize: line.size | 22, x: currentColumnOffsetX })
        );
        currentColumnOffsetX += line.columnWidth || 200;
      }
    } else {
      await page1.drawText(line.text, Object.assign({}, fontOptions, { y: currentLineHeight, fontSize: line.size | 22 }));
    }
  }

  PDFDocument.create(pdfPath)
    // @ts-ignore
    .addPages(page1)
    .write() // Returns a promise that resolves with the PDF's path
    .then(() => {
      FileSystem.getContentUriAsync(FileSystem.documentDirectory + `/permit-log-${fileName}_${fileNameTime}.pdf`).then((cUri) => {
        IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
          data: cUri,
          flags: 1
        });
      });
    });
};
