"use client";

import React, { useEffect, useState } from "react";
import styles from "./DrawingBoard.module.scss";
import { Button } from "./ui/button";

interface DrawingBoardProps {
  boardDimensions: {
    x: number;
    y: number;
  };
  drawColor: string;
  board: string[][];
  setBoard: React.Dispatch<React.SetStateAction<string[][]>>;
  title: string;
  randomFill: boolean;
  searchButton: boolean;
  setAlert: React.Dispatch<React.SetStateAction<string>>;
  isSearching: { current: boolean };
  searchHandler: (pattern: string[][]) => void;
  resetHandler: (
    setHandler: React.Dispatch<React.SetStateAction<string[][]>>
  ) => void;
}

const DrawingBoard = ({
  boardDimensions,
  drawColor,
  board,
  setBoard,
  title,
  randomFill,
  searchButton,
  setAlert,
  isSearching,
  searchHandler,
  resetHandler,
}: DrawingBoardProps) => {
  const colorValues = [
    "0,128,0,1",
    "255,0,0,1",
    "255,255,0,1",
    "127,0,255,1",
    "0,0,255,1",
  ];
  const changeBoardItem = (y: number, x: number, value: string) => {
    setBoard((prevBoard) => {
      if (prevBoard[y][x] !== "-1,-1,-1,0") {
        const newBoard = prevBoard.map((row) => [...row]);
        newBoard[y][x] = value;
        return newBoard;
      }
      return prevBoard;
    });
  };
  return (
    <div className={styles.boardWrapper}>
      <div className={styles.title}>{title}</div>
      <div className={styles.boardWrapper1}>
        <div
          style={{
            gridTemplate: `repeat(${boardDimensions.y}, 20px) / 20px`,
            width: `calc(${boardDimensions.x} * 20px)`,
          }}
          className={styles.board}
        >
          {board.map((row, rowIndex) => (
            <div
              key={rowIndex + "_row"}
              style={{
                gridTemplate: `20px / repeat(${boardDimensions.x}, 20px)`,
                height: "20px",
                width: `calc(${boardDimensions.x} * 20px)`,
                display: "grid",
              }}
            >
              {row.map((_, colIndex) => (
                <div
                  style={{
                    background: `rgba(
                    ${board[rowIndex][colIndex].split(",")[0]},
                    ${board[rowIndex][colIndex].split(",")[1]},
                    ${board[rowIndex][colIndex].split(",")[2]},
                    ${board[rowIndex][colIndex].split(",")[3]}
                )`,
                    boxShadow:
                      board[rowIndex][colIndex] !== "255,255,255,1"
                        ? ""
                        : "inset 1px 1px 3px -1px black",
                    transition: "all 0.1s",
                  }}
                  onClick={(e) => {
                    if (!isSearching.current)
                      changeBoardItem(rowIndex, colIndex, drawColor);
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onPointerMove={(e) => {
                    if (e.buttons == 1 && !isSearching.current) {
                      changeBoardItem(rowIndex, colIndex, drawColor);
                    }
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDragCapture={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  onDragEndCapture={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  draggable="false"
                  onDrag={() => {}}
                  key={rowIndex + "_" + colIndex}
                  className={styles.cell}
                ></div>
              ))}
            </div>
          ))}
        </div>
      </div>
      {searchButton && (
        <Button
          variant="secondary"
          style={{ cursor: isSearching.current ? "not-allowed" : "pointer" }}
          onClick={() => {
            if (isSearching.current) {
              return;
            }
            isSearching.current = true;
            let patternLeftBound = boardDimensions.x + 1,
              patternRightBound = -1,
              patterTopBound = boardDimensions.y + 1,
              patternBottomBound = -1;
            for (let i = 0; i < boardDimensions.y; i++) {
              for (let j = 0; j < boardDimensions.x; j++) {
                let cellValue = board[i][j];
                if (cellValue !== "255,255,255,1") {
                  if (j < patternLeftBound) {
                    patternLeftBound = j;
                  }
                  if (j > patternRightBound) {
                    patternRightBound = j;
                  }
                  if (i < patterTopBound) {
                    patterTopBound = i;
                  }
                  if (i > patternBottomBound) {
                    patternBottomBound = i;
                  }
                }
              }
            }
            if (patternRightBound === -1 || patternBottomBound === -1) {
              setAlert("Error!|No pattern found.");
              isSearching.current = false;
              return;
            }
            if (
              patternRightBound - patternLeftBound !==
              patternBottomBound - patterTopBound
            ) {
              setAlert("Error!|Pattern must be of NxN size");
              isSearching.current = false;
              return;
            }
            let pattern = [[""]];
            for (let i = 0; i < boardDimensions.y; i++) {
              for (let j = 0; j < boardDimensions.x; j++) {
                if (i < patterTopBound || i > patternBottomBound) {
                  changeBoardItem(i, j, "-1,-1,-1,0");
                } else if (j < patternLeftBound || j > patternRightBound) {
                  changeBoardItem(i, j, "-1,-1,-1,0");
                } else {
                  if (!pattern[i - patterTopBound]) {
                    pattern[i - patterTopBound] = [];
                  }
                  pattern[i - patterTopBound][j - patternLeftBound] =
                    board[i][j];
                }
              }
            }
            searchHandler(pattern);
          }}
        >
          Search the pattern
        </Button>
      )}
      {randomFill && (
        <Button
          variant="secondary"
          style={{ cursor: isSearching.current ? "not-allowed" : "pointer" }}
          onClick={() => {
            if (isSearching.current) {
              return;
            }
            setBoard(
              Array.from({ length: boardDimensions.y }, () =>
                Array.from(
                  { length: boardDimensions.x },
                  () =>
                    colorValues[Math.floor(Math.random() * colorValues.length)]
                )
              )
            );
          }}
        >
          Fill randomly
        </Button>
      )}
      <Button variant="destructive" onClick={() => resetHandler(setBoard)}>
        Reset
      </Button>
    </div>
  );
};

export default DrawingBoard;
