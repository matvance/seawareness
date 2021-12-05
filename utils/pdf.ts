import PDFLib, { PDFDocument, PDFPage } from 'react-native-pdf-lib';
import { FileSystem } from 'react-native-unimodules';
import * as IntentLauncher from 'expo-intent-launcher';

import { PermitLogObject } from '../storage/logs.storage';

const fontOptions = {
  x: 120,
  // y: 1674,
  color: '#000000',
  fontSize: 22,
  fontName: 'Arial',
  textAlign: 'center'
};

interface Line {
  text: string | string[];
  size?: number;
  marginTop?: number;
  columnWidth?: number;
}

export const generatePdf = async (permitLog: PermitLogObject) => {
  const docsDir = await PDFLib.getDocumentsDirectory();

  const date = new Date(permitLog.startTimestamp);
  const fileName = date.toISOString().split('T')[0];
  const fileNameTime = date.toLocaleTimeString('en-US', { hour12: false, hour: 'numeric', minute: 'numeric' });

  const pdfPath = `${docsDir}/permit-log-${fileName}_${fileNameTime}.pdf`;

  const lines: Line[] = [
    {
      text: 'Enclosed space entry log',
      size: 54
    },
    {
      text: 'Date: ' + date.toLocaleDateString(),
      marginTop: 20
    },
    {
      text: 'Start time: ' + date.toLocaleTimeString('en-US', { hour12: false })
    },
    {
      text: 'Vessel: ' + permitLog.vesselName,
      marginTop: 50
    },
    {
      text: 'Space to be entered:   ' + permitLog.location
    },
    {
      text: 'Safety parameters:',
      marginTop: 40
    },
    {
      text: ['', 'Min value', 'Max value']
    }
  ];

  permitLog.safetyParameters.forEach((param) =>
    lines.push({
      text: [param.title, (param.minValue || '-').toString(), (param.maxValue || '-').toString()]
    })
  );

  lines.push({
    text: '',
    marginTop: 40
  });

  permitLog.timers.forEach((timer) =>
    lines.push({
      text: [timer.title, timer.interval + 'mins'],
      columnWidth: 300
    })
  );

  lines.push({
    text: 'Person in charge: ' + permitLog.personInCharge,
    marginTop: 40
  });

  // console.log(permitLog.logs);

  const getLogTime = (timestamp: number) => new Date(timestamp).toLocaleTimeString('en-GB', { hour12: false });

  lines.push({ text: 'Action logs:', size: 30, marginTop: 60 });

  permitLog.logs.forEach((log) => {
    switch (log.type) {
      case 'standby-person-change':
        lines.push({
          text: [getLogTime(log.timestamp), 'Standby person change: ' + log.standbyPerson],
          marginTop: 15
        });
        break;
      case 'measurements':
        lines.push({
          text: [getLogTime(log.timestamp), 'User took measurements: '],
          marginTop: 15
        });
        log.measurements.forEach((measurement) => {
          lines.push({
            text: ['', 'Parameter', 'Value']
          });
          lines.push({
            text: ['', measurement?.title + '', measurement.value + '']
          });
        });
        break;
      case 'preentry-preparations':
        lines.push({
          text: [getLogTime(log.timestamp), 'Preentry preparations confirmed.'],
          marginTop: 15
        });
        lines.push({
          text: ['', 'Initial standby person: ' + log.standbyPerson]
        });
        break;
      case 'communication-check':
        lines.push({
          text: [getLogTime(log.timestamp), 'Communication check: OK'],
          marginTop: 15
        });
        break;
      case 'change-position':
        lines.push({
          text: [getLogTime(log.timestamp), 'Crew are changing their positions:'],
          marginTop: 15
        });
        lines.push({
          text: ['', 'Member name:', 'New position']
        });
        log.positions.forEach((position) => {
          lines.push({
            text: ['', position.memberName, position.switchPosition ? 'IN' : 'OUT']
          });
        });
    }
  });

  // ===================== RENDER =====================
  const drawLine = async (page: any, line: Line, currentLineHeight: number) => {
    if (Array.isArray(line.text)) {
      let currentColumnOffsetX = fontOptions.x;

      for (const column of line.text) {
        await page.drawText(
          column,
          Object.assign({}, fontOptions, { y: currentLineHeight, fontSize: line.size || 22, x: currentColumnOffsetX })
        );
        currentColumnOffsetX += line.columnWidth || 200;
      }
    } else {
      await page.drawText(line.text, Object.assign({}, fontOptions, { y: currentLineHeight, fontSize: line.size || 22 }));
    }
  };

  let pages = [];

  pages.push(PDFPage.create().setMediaBox(1240, 1754));

  let currentLineHeight = 1674;

  for (const line of lines) {
    currentLineHeight -= (line.size || 22) + 10;

    if (line.marginTop) {
      currentLineHeight -= line.marginTop;
    }

    if ((line.marginTop || 0) + (line.size || 22) + currentLineHeight <= 200) {
      pages.push(PDFPage.create().setMediaBox(1240, 1754));
      currentLineHeight = 1600;
    }

    await drawLine(pages[pages.length - 1], line, currentLineHeight);
  }

  PDFDocument.create(pdfPath)
    // @ts-ignore
    .addPages(...pages)
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
