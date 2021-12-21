import * as fs from 'fs';
import { walkUpBindingElementsAndPatterns } from 'typescript';

function findLargestNumber(list: number[][], position: number) {
  let largest = 0;

  list.forEach(item => {
    if (item[position] > largest) {
      largest = item[position];
    }
  })

  return largest;
}

function createGrid(height: number, width: number) {
  const grid = [];
  for (let x = 0; x <= height; x++) {
    const row = [];
    for (let y = 0; y <= width; y++) {
      row.push('.')
    }
    grid.push(row);
  }
  
  return grid;
}

function foldY(grid: string[][], row: number) {
  if (grid.length - row - 1 > row) {
    // Bottom half bigger than the top
    console.error('We have a problem, bottom too big');
    return;
  }

  for (let i = row + 1; i < grid.length; i++) {
    const currentRow = grid[i];
    currentRow.forEach((cell, ind) => {
      if (cell === '#') {
        grid[row - (i - row)][ind] = '#';
      }
    })
  }

  return grid.filter((_, ind) => ind < row);
}

function foldX(grid: string[][], col: number) {
  if (grid[0].length - col - 1 > col) {
    console.error('We have a problem, right too big');
    return;
  }

  const newGrid: string[][] = [];
  for (let x = 0; x < grid.length; x++) {
    const row = grid[x];
    for (let i = col + 1; i < row.length; i++) {
      if (row[i] === '#') {
        row[col - (i - col)] = '#';
      }
    }
    newGrid.push(row);
  }
  return newGrid.map(row => row.filter((_,ind) => ind < col));
}

function fold(grid: string[][], dimension: 'x' | 'y', position: number) {
  if (dimension === 'y') {
    return foldY(grid, position);
  }
  return foldX(grid, position);
}

fs.readFile('./input.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const lines = data.split('\n');
  const coords = lines
    .filter(line => line.match(/^\d+,\d+$/))
    .map(coord => coord.split(',').map(num => Number(num)));

  const folds = lines
    .filter(line => line.startsWith('fold along'))
    .map(line => line.match(/[xy]=\d+$/)[0])
    .map(fold => fold.split('='))
    .map(fold => [ fold[0], Number(fold[1]) ])

  const firstFold = folds[0];
  const height = findLargestNumber(coords, 0);
  const width = findLargestNumber(coords, 1);
  const grid = createGrid(width, height);
  coords.forEach(coord => {
    grid[coord[1]][coord[0]] = '#';
  });
  console.log(grid.map(row => row.join('')).join('\n'));
  let newGrid = grid;
  folds.forEach(foldInstruction => {
    newGrid = fold(newGrid, foldInstruction[0] as 'x' | 'y', foldInstruction[1] as number) as string[][];
  });
  // let newGrid = fold(grid, firstFold[0] as 'x' | 'y', firstFold[1] as number) as string[][];
  // console.log('===')
  console.log(newGrid.map(row => row.join('')).join('\n'));
  let dots = 0;
  newGrid.forEach(row => row.forEach(cell => { if (cell === '#') dots++; }));
  console.log(dots);
});
