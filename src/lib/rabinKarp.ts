const rabinKarp = (
  text: string[][],
  pattern: string[][]
): { x: number; y: number }[] => {
  let patternRowLength = pattern.length;
  let patternColumnLength = pattern[0].length;
  let hash = calculateHash(pattern, []);

  let initialTextWindow = [[""]];
  for (let i = 0; i < patternRowLength; i++) {
    for (let j = 0; j < patternColumnLength; j++) {
      if (!initialTextWindow[i]) {
        initialTextWindow[i] = [];
      }
      initialTextWindow[i][j] = text[i][j];
    }
  }

  const columnHashes: number[] = [];
  const rowHashes: number[] = [];
  let initialTextWindowHash = calculateHash(initialTextWindow, columnHashes);
  calculateRowHash(initialTextWindow, rowHashes);
  let results: { x: number; y: number }[] = [];

  if (hash === initialTextWindowHash) {
    if (checkHashes(text, pattern, 0, 0)) {
      results.push({ x: 0, y: 0 });
    }
  }

  console.log(hash);
  console.log(initialTextWindowHash);
  getIndexes(
    text,
    pattern,
    initialTextWindowHash,
    hash,
    results,
    columnHashes,
    rowHashes
  );
  return results;
};

const getIndexes = (
  text: string[][],
  pattern: string[][],
  hash: number,
  patternHash: number,
  results: { x: number; y: number }[],
  columnHashes: number[],
  rowHashes: number[]
) => {
  for (let rowIndex = 0; rowIndex <= text.length - pattern.length; rowIndex++) {
    let rowHash = hash;
    for (
      let columnIndex = 1;
      columnIndex < text[0].length - pattern.length + 1;
      columnIndex++
    ) {
      if (rowIndex === 0) {
        let columnToAdd = [""];
        for (let i = rowIndex; i < rowIndex + pattern.length; i++) {
          columnToAdd[i - rowIndex] = text[i][columnIndex + pattern.length - 1];
        }
        let columnToRemoveHash = columnHashes[columnIndex - 1];
        let columnToAddHash = rollHash(columnToAdd) & (Math.pow(2, 16) - 1);
        columnHashes.push(columnToAddHash);
        if (columnToRemoveHash < 0) {
          columnToRemoveHash += Math.pow(2, 16) - 1;
        }
        if (columnToAddHash < 0) {
          columnToAddHash += Math.pow(2, 16) - 1;
        }
        rowHash =
          (((((rowHash & (Math.pow(2, 16) - 1)) -
            ((columnToRemoveHash * 255 ** (pattern.length - 1)) &
              (Math.pow(2, 16) - 1))) *
            255) &
            (Math.pow(2, 16) - 1)) +
            columnToAddHash * 1) &
          (Math.pow(2, 16) - 1);
        if (rowHash < 0) {
          rowHash += Math.pow(2, 16) - 1;
        }
        //console.log(`Next hash: ${rowHash}`);
        if (rowHash == patternHash) {
          if (checkHashes(text, pattern, columnIndex, rowIndex)) {
            results.push({ x: columnIndex, y: rowIndex });
          }
        }
      } else {
        let columnToRemoveHash =
          (((((columnHashes[columnIndex - 1] -
            convertToNumber(text[rowIndex - 1][columnIndex - 1]) *
              Math.pow(255, pattern.length - 1)) &
            (Math.pow(2, 16) - 1)) *
            255) &
            (Math.pow(2, 16) - 1)) +
            convertToNumber(
              text[rowIndex + pattern.length - 1][columnIndex - 1]
            )) &
          (Math.pow(2, 16) - 1);
        columnToRemoveHash = columnToRemoveHash & (Math.pow(2, 16) - 1);
        let columnToAddHash =
          (((((columnHashes[columnIndex + pattern.length - 1] -
            ((convertToNumber(
              text[rowIndex - 1][columnIndex + pattern.length - 1]
            ) *
              Math.pow(255, pattern.length - 1)) &
              (Math.pow(2, 16) - 1))) &
            (Math.pow(2, 16) - 1)) *
            255) &
            (Math.pow(2, 16) - 1)) +
            convertToNumber(
              text[rowIndex + pattern.length - 1][
                columnIndex + pattern.length - 1
              ]
            )) &
          (Math.pow(2, 16) - 1);
        columnToAddHash = columnToAddHash & (Math.pow(2, 16) - 1);

        if (columnToRemoveHash < 0) {
          columnToRemoveHash += Math.pow(2, 16) - 1;
        }
        if (columnToAddHash < 0) {
          columnToAddHash += Math.pow(2, 16) - 1;
        }

        columnHashes.splice(columnIndex - 1, 1, columnToRemoveHash);

        if (
          columnIndex + pattern.length - 1 >=
          text[0].length - pattern.length
        ) {
          columnHashes.splice(
            columnIndex + pattern.length - 1,
            1,
            columnToAddHash
          );
        }

        console.log(columnToRemoveHash);

        rowHash =
          ((((rowHash -
            ((columnToRemoveHash * 255 ** (pattern.length - 1)) &
              (Math.pow(2, 16) - 1))) *
            255) &
            (Math.pow(2, 16) - 1)) +
            columnToAddHash * 1) &
          (Math.pow(2, 16) - 1);
        if (rowHash < 0) {
          rowHash += Math.pow(2, 16) - 1;
        }
        if (rowHash == patternHash) {
          if (checkHashes(text, pattern, columnIndex, rowIndex)) {
            results.push({ x: columnIndex, y: rowIndex });
          }
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

      const rowToRemoveHash = rowHashes[rowIndex];
      const rowToAddHash = rollHash(rowToAdd);
      rowHashes.push(rowToAddHash);
      hash =
        ((((hash -
          ((rowToRemoveHash * 255 ** (pattern.length - 1)) &
            (Math.pow(2, 16) - 1))) *
          255) &
          (Math.pow(2, 16) - 1)) +
          rowToAddHash * 1) &
        (Math.pow(2, 16) - 1);
      if (hash < 0) {
        hash += Math.pow(2, 16) - 1;
      }
      if (hash == patternHash) {
        if (checkHashes(text, pattern, 0, rowIndex + 1)) {
          results.push({ x: 0, y: rowIndex + 1 });
        }
      }
    }
  }
};

const rollHash = (column: string[]) => {
  let hash = 0;
  for (let i = column.length - 1; i >= 0; i--) {
    hash =
      (hash +
        convertToNumber(column[i]) * Math.pow(255, column.length - 1 - i)) &
      (Math.pow(2, 16) - 1);
  }
  return hash & (Math.pow(2, 16) - 1);
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

const calculateHash = (pattern: string[][], columnHashes: number[]) => {
  let hash = 0;
  for (let columnIndex = pattern.length - 1; columnIndex >= 0; columnIndex--) {
    let columnHash = 0;
    for (let rowIndex = pattern[0].length - 1; rowIndex >= 0; rowIndex--) {
      columnHash +=
        (convertToNumber(pattern[rowIndex][columnIndex]) *
          Math.pow(255, pattern[0].length - 1 - rowIndex)) &
        (Math.pow(2, 16) - 1);
    }
    columnHashes.splice(0, 0, columnHash & (Math.pow(2, 16) - 1));
    hash =
      (hash +
        ((columnHash * Math.pow(255, pattern.length - 1 - columnIndex)) &
          (Math.pow(2, 16) - 1))) &
      (Math.pow(2, 16) - 1);
  }
  return hash & (Math.pow(2, 16) - 1);
};

const calculateRowHash = (pattern: string[][], rowHashes: number[]) => {
  for (let rowIndex = pattern.length - 1; rowIndex >= 0; rowIndex--) {
    let columnHash = 0;
    for (
      let columnIndex = pattern[0].length - 1;
      columnIndex >= 0;
      columnIndex--
    ) {
      columnHash +=
        (convertToNumber(pattern[rowIndex][columnIndex]) *
          Math.pow(255, pattern[0].length - 1 - columnIndex)) &
        (Math.pow(2, 16) - 1);
    }
    rowHashes.splice(0, 0, columnHash & (Math.pow(2, 16) - 1));
  }
};

const convertToNumber = (inputString: string) => {
  let parts = inputString.split(",");
  let numbers = parts.map((part) => parseInt(part, 10));
  return (numbers[0] + numbers[1] + numbers[2]) * numbers[3];
};

export default rabinKarp;
