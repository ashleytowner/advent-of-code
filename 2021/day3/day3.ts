import * as fs from 'fs';
import * as path from 'path';

type Binary = (0 | 1);
type Input = Binary[][];

function getColumn(list: Input, index: number) {
  const col = list.map(row => row[index]);
  return col;
}

function mostCommonBit(list: Binary[]) {
  let sum = 0;
  for (let i = 0; i < list.length; i++) {
    sum += list[i];
  }
  if (sum > (list.length / 2)) {
    return 1;
  }
  return 0;
}

function leastCommonBit(list: Binary[]) {
  return Number(!mostCommonBit(list))
}

function main(list: Input) {
  const width = list[0].length;
  
  let gammaRate: number[] = [];

  for (let i = 0; i < width; i++) {
    gammaRate.push(mostCommonBit(getColumn(list, i)))
  }

  let epsilonRate: number[] = [];
  for (let i = 0; i < width; i++) {
    epsilonRate.push(leastCommonBit(getColumn(list, i)))
  }

  const gammaInt = parseInt(gammaRate.join(''), 2);
  const epsilonInt = parseInt(epsilonRate.join(''), 2);

  console.log('Gamma: ', gammaRate, gammaInt);
  console.log('Epsilon: ', epsilonRate, epsilonInt);
  console.log('power consumption: ', epsilonInt * gammaInt);
}

fs.readFile(path.join(__dirname, './input.txt'), 'utf8', (error, data) => {
  let input = (data.split('\n').map(x => x.split('').map(y => Number(y)))).filter(a => a.length > 0) as unknown as Input;
  main(input);
  if (error) {
	 console.error(error);
		  }
});
