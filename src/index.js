import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import chokidar from 'chokidar';
import { PATH_INPUT_FILES, PATH_OUTPUT_FILES, PATH_OLD_FILES } from './utils/constants.js';
import { Drone } from './models/Drone.js';
import { Package } from './models/Package.js';
import { RandomDelivery } from './models/delivery/RandomDelivery.js';

/**
 *
 * @param {string} filename
 * @param {Drone[]} drones
 */
const writeOutputFile = (filename, drones) => {
  const writeStream = fs.createWriteStream(`${PATH_OUTPUT_FILES}/${Date.now()}_${filename}`);
  for (const drone of drones) {
    writeStream.write(`${drone.name}\n`)

    let countTrip = 1;
    for (const completedTrip of drone.completedTrips) {
      writeStream.write(`Trip #${countTrip++}\n`);

      for (const [index, trip] of completedTrip.entries()) {
        const textToWrite = index >= 1 ? `, ${trip}` : trip;
        writeStream.write(textToWrite);
      }
      writeStream.write('\n');
    }

    writeStream.write('\n');
  }

  writeStream.end();
}

/**
 *
 * @param {string} path
 */
const createDeliverySolution = (path) => {
  const [, filename] = path.split('/');
  const stream       = fs.createReadStream(path, { encoding: 'utf8' });

  stream.on('data', (chunk) => {
    const [ headerData, ...data ] = chunk.split('\r\n')

    const drones = []
    const headerInfo = headerData.split(', ');
    for (let i = 0; i < headerInfo.length; i = i+2) {
      const name               = headerInfo[i]
      const maxWeight           = headerInfo[i + 1]
      const maxWeightNoBrackets = maxWeight.replace(/\[|\]/g, '');

      const drone = new Drone({name, maxWeight: maxWeightNoBrackets});
      drones.push(drone)
    }
    drones.sort((a, b) => b.maxWeight - a.maxWeight);

    let destinationLocationWeight = [];
    for (const infoData of data) {
      const [ location, weight ] = infoData.split(', ');
      const weightNoBrackets     = weight.replace(/\[|\]/g, '');

      const destinationPackage = new Package({location, weight: Number(weightNoBrackets)});
      destinationLocationWeight.push(destinationPackage)
    }

    destinationLocationWeight.sort((a, b) => a.weight - b.weight);

    const randomDelivery = new RandomDelivery();
    randomDelivery.make(drones, destinationLocationWeight);

    writeOutputFile(filename, drones);
  });

  stream.on('end', async () => {
    await fsPromises.rename(`${PATH_INPUT_FILES}/${filename}`, `${PATH_OLD_FILES}/${filename}`)

    console.info('Process executed with success - Filename ', filename)
  });

  stream.on('error', (err) => {
      console.error('Error reading file:', err);
  });
};

const watcher = chokidar.watch(PATH_INPUT_FILES, {
  ignored    : /(^|[\/\\])\../,
  persistent : true
});

watcher
  .on('add', (path) => createDeliverySolution(path));