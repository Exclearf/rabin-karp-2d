const rabinKarp = (
  text: string[][],
  pattern: string[][]
): { x: number; y: number }[] => {
  let patternRowLength = pattern.length;
  let patternColumnLength = pattern[0].length;
  let hash = calculateHash(pattern);
  console.log(hash);
  let initialTextWindow = [[""]];
  for (let i = 0; i < patternRowLength; i++) {
    for (let j = 0; j < patternColumnLength; j++) {
      if (!initialTextWindow[i]) {
        initialTextWindow[i] = [];
      }
      initialTextWindow[i][j] = text[i][j];
    }
  }
  console.log(initialTextWindow);
  console.log(pattern);

  let initialTextWindowHash = calculateHash(initialTextWindow);

  let results: { x: number; y: number }[] = [];
  if (hash === initialTextWindowHash) {
    if (checkHashes(text, pattern, 0, 0)) {
      results.push({ x: 0, y: 0 });
    }
  }
  getIndexes(text, pattern, initialTextWindowHash, hash, results);
  return results;
};

const getIndexes = (
  text: string[][],
  pattern: string[][],
  hash: number,
  patternHash: number,
  results: { x: number; y: number }[]
) => {
  for (let rowIndex = 0; rowIndex <= text.length - pattern.length; rowIndex++) {
    let rowHash = hash;
    for (
      let columnIndex = 1;
      columnIndex < text[0].length - pattern.length + 1;
      columnIndex++
    ) {
      let columnToRemove = [""];
      for (let i = rowIndex; i < rowIndex + pattern.length; i++) {
        columnToRemove[i - rowIndex] = text[i][columnIndex - 1];
      }
      let columnToAdd = [""];
      for (let i = rowIndex; i < rowIndex + pattern.length; i++) {
        columnToAdd[i - rowIndex] = text[i][columnIndex + pattern.length - 1];
      }
      console.log(`Column to remove: `);
      console.log(columnToRemove);
      console.log(`Column to add: `);
      console.log(columnToAdd);
      console.log(`Prev hash: ${rowHash}`);
      rowHash =
        ((rowHash - rollHash(columnToRemove, pattern.length - 1)) * 255 +
          rollHash(columnToAdd, 0)) %
        29437;
      if (rowHash < 0) {
        rowHash += 29437;
      }
      console.log(`Next hash: ${rowHash}`);
      if (rowHash == patternHash) {
        if (checkHashes(text, pattern, columnIndex, rowIndex)) {
          results.push({ x: columnIndex, y: rowIndex });
        }
      }
    }
    if (rowIndex != text.length - pattern.length) {
      let rowToRemove = [""];
      let rowToAdd = [""];
      for (let i = 0; i < pattern.length; i++) {
        rowToRemove[i] = text[rowIndex][i];
      }
      for (let i = 0; i < pattern.length; i++) {
        rowToAdd[i] = text[rowIndex + pattern.length][i];
      }
      console.log(`Row to remove: ${rowToRemove}`);
      console.log(`Row to add: ${rowToAdd}`);
      console.log(`Prev hash: ${hash}`);
      hash =
        ((hash - rollHash(rowToRemove, pattern.length - 1)) * 255 +
          rollHash(rowToAdd, 0)) %
        29437;
      if (hash < 0) {
        hash += 29437;
      }
      console.log(`Next hash: ${hash}`);
      if (hash == patternHash) {
        if (checkHashes(text, pattern, 0, rowIndex + 1)) {
          results.push({ x: 0, y: rowIndex + 1 });
        }
      }
    }
  }
};

const rollHash = (column: string[], power: number) => {
  let hash = 0;
  for (let i = column.length - 1; i >= 0; i--) {
    hash =
      (hash +
        convertToNumber(column[i]) * Math.pow(255, column.length - 1 - i)) %
      29437;
  }
  hash = hash * Math.pow(255, power);
  return hash % 29437;
};

const checkHashes = (
  text: string[][],
  pattern: string[][],
  x: number,
  y: number
) => {
  for (let i = y; i < y + pattern.length; i++) {
    for (let j = x; j < x + pattern.length; j++) {
      if (text[i][j] !== pattern[i - y][j - x]) {
        return false;
      }
    }
  }
  return true;
};

const calculateHash = (pattern: string[][]) => {
  let hash = 0;
  for (let rowIndex = pattern.length - 1; rowIndex >= 0; rowIndex--) {
    let rowHash = 0;
    for (
      let columnIndex = pattern[0].length - 1;
      columnIndex >= 0;
      columnIndex--
    ) {
      rowHash +=
        (convertToNumber(pattern[rowIndex][columnIndex]) *
          Math.pow(255, pattern[0].length - 1 - columnIndex)) %
        29437;
    }
    hash += (rowHash * Math.pow(255, pattern.length - 1 - rowIndex)) % 29437;
  }
  return hash % 29437;
};

const convertToNumber = (inputString: string) => {
  let parts = inputString.split(",");
  let numbers = parts.map((part) => parseInt(part, 10));
  return (numbers[0] + numbers[1] + numbers[2]) * numbers[3];
};

export default rabinKarp;
