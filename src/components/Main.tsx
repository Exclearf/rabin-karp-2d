"use client";
import React, { SyntheticEvent, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AnimatePresence, motion } from "framer-motion";
import DrawingBoard from "./DrawingBoard";
import styles from "./Main.module.scss";
import rabinKarp from "@/lib/rabinKarp";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const Main = () => {
  const isSearching = useRef(false);
  const alertVariants = useRef({
    initial: { top: "100%", transition: {} },
    animate: { top: 0 },
    exit: { top: "100%" },
  });
  const [boardDimensions, setBoardDimensions] = useState({ x: 35, y: 22 });
  const [isCustomColor, setIsCustomColor] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [color, setColor] = useState("255,255,0,1");
  const [board, setBoard] = useState<string[][]>(
    Array.from({ length: boardDimensions.y }, () =>
      Array.from({ length: boardDimensions.x }, () => "255,255,255,1")
    )
  );
  const [patternBoard, setPatternBoard] = useState<string[][]>(
    Array.from({ length: boardDimensions.y }, () =>
      Array.from({ length: boardDimensions.x }, () => "255,255,255,1")
    )
  );
  const startSearch = (pattern: string[][]) => {
    let results = rabinKarp(board, pattern);
    console.log(results);
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
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[0].length; j++) {
        const newValue = board[i][j].split(",").slice(0, -1);
        changeBoardItem(i, j, newValue.toString() + ",0.2");
      }
    }
    for (let i = 0; i < results.length; i++) {
      for (let y = results[i].y; y < results[i].y + pattern.length; y++) {
        for (let x = results[i].x; x < results[i].x + pattern[0].length; x++) {
          const newValue = board[y][x].split(",").slice(0, -1);
          changeBoardItem(y, x, newValue.toString() + ",1");
        }
      }
    }
  };

  const resetHandler = (
    setHandler: React.Dispatch<React.SetStateAction<string[][]>>
  ) => {
    if (isSearching.current) {
      isSearching.current = false;
      [setBoard, setPatternBoard].forEach((handler) =>
        handler(
          Array.from({ length: boardDimensions.y }, () =>
            Array.from({ length: boardDimensions.x }, () => "255,255,255,1")
          )
        )
      );
    } else {
      setHandler(() =>
        Array.from({ length: boardDimensions.y }, () =>
          Array.from({ length: boardDimensions.x }, () => "255,255,255,1")
        )
      );
    }
  };

  const changeXDimension = (e: any) => {
    isSearching.current = false;
    setBoardDimensions((prev) => ({
      x: Number(e.target.value),
      y: prev.y,
    }));

    setPatternBoard((prev) =>
      Array.from({ length: prev.length }, () =>
        Array.from({ length: Number(e.target.value) }, () => "255,255,255,1")
      )
    );
    setBoard((prev) =>
      Array.from({ length: prev.length }, () =>
        Array.from({ length: Number(e.target.value) }, () => "255,255,255,1")
      )
    );
  };

  const changeYDimension = (e: any) => {
    isSearching.current = false;
    setBoardDimensions((prev) => ({
      x: prev.x,
      y: Number(e.target.value),
    }));

    setPatternBoard((prev) =>
      Array.from({ length: Number(e.target.value) }, () =>
        Array.from({ length: prev[0].length }, () => "255,255,255,1")
      )
    );
    setBoard((prev) =>
      Array.from({ length: Number(e.target.value) }, () =>
        Array.from({ length: prev[0].length }, () => "255,255,255,1")
      )
    );
  };

  return (
    <div style={{ height: "100%" }}>
      <div className="padding" style={{ height: "10%" }}></div>
      <div
        className={styles.settings}
        draggable="false"
        style={{ height: "10%" }}
      >
        <Label className={styles.header}>Choose a color:</Label>
        <div className={styles.container}>
          <input
            className={styles.checkbox + " " + styles.green}
            type="radio"
            id="green"
            name="color"
            value="huey"
            onChange={() => {
              setIsCustomColor(false);
              setColor("0,128,0,1");
            }}
            checked={!isCustomColor && color == "0,128,0,1"}
          />
          <input
            className={styles.checkbox + " " + styles.red}
            type="radio"
            id="red"
            name="color"
            value="huey"
            onChange={() => {
              setIsCustomColor(false);
              setColor("255,0,0,1");
            }}
            checked={!isCustomColor && color == "255,0,0,1"}
          />
          <input
            className={styles.checkbox + " " + styles.violet}
            type="radio"
            id="violet"
            name="color"
            value="huey"
            onChange={() => {
              setIsCustomColor(false);
              setColor("127,0,255,1");
            }}
            checked={!isCustomColor && color == "127,0,255,1"}
          />
          <input
            className={styles.checkbox + " " + styles.yellow}
            type="radio"
            id="yellow"
            name="color"
            value="huey"
            onChange={() => {
              setIsCustomColor(false);
              setColor("255,255,0,1");
            }}
            checked={!isCustomColor && color == "255,255,0,1"}
          />
          <input
            className={styles.checkbox + " " + styles.blue}
            type="radio"
            id="blue"
            name="color"
            value="huey"
            onChange={() => {
              setIsCustomColor(false);
              setColor("0,0,255,1");
            }}
            checked={!isCustomColor && color == "0,0,255,1"}
          />
          <input
            className={styles.checkbox + " " + styles.white}
            type="radio"
            id="white"
            name="color"
            value="huey"
            onChange={() => {
              setIsCustomColor(false);
              setColor("255,255,255,1");
            }}
            checked={!isCustomColor && color == "255,255,255,1"}
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                style={{
                  fontSize: "1.4rem",
                  width: isCustomColor ? "50px" : "40px",
                  height: isCustomColor ? "50px" : "40px",
                  transition: "all 0.1s;",
                  background: isCustomColor
                    ? `rgba(
                    ${color.split(",")[0]},
                    ${color.split(",")[1]},
                    ${color.split(",")[2]},
                    ${color.split(",")[3]}
                  )`
                    : "",
                }}
              >
                {isCustomColor ? "" : "+"}
              </Button>
            </DialogTrigger>
            <DialogContent className={styles.sidebar}>
              <DialogHeader>
                <DialogTitle className={styles.textColorHeader}>
                  Custom color
                </DialogTitle>
                <DialogDescription className={styles.textColorContent} asChild>
                  <div className={styles.sideContainer}>
                    <div
                      className={styles.preview}
                      style={{
                        backgroundColor: `rgba(
                      ${color.split(",")[0]},
                      ${color.split(",")[1]},
                      ${color.split(",")[2]},
                      ${color.split(",")[3]}
                    )`,
                      }}
                    />
                    <div className={styles.settings}>
                      <Input
                        type="number"
                        placeholder={color.split(",")[0]}
                        className={styles.input}
                        min={0}
                        max={255}
                        onChange={(e) => {
                          setIsCustomColor(true);
                          setColor(
                            e.target.value +
                              "," +
                              color.split(",")[1] +
                              "," +
                              color.split(",")[2] +
                              "," +
                              color.split(",")[3] +
                              ","
                          );
                        }}
                      />
                      <Input
                        type="number"
                        placeholder={color.split(",")[1]}
                        className={styles.input}
                        min={0}
                        max={255}
                        onChange={(e) => {
                          setIsCustomColor(true);
                          setColor(
                            color.split(",")[0] +
                              "," +
                              e.target.value +
                              "," +
                              color.split(",")[2] +
                              "," +
                              color.split(",")[3] +
                              ","
                          );
                        }}
                      />
                      <Input
                        type="number"
                        placeholder={color.split(",")[2]}
                        className={styles.input}
                        min={0}
                        max={255}
                        onChange={(e) => {
                          setIsCustomColor(true);
                          setColor(
                            color.split(",")[0] +
                              "," +
                              color.split(",")[1] +
                              "," +
                              e.target.value +
                              "," +
                              color.split(",")[3] +
                              ","
                          );
                        }}
                      />
                      <Input
                        type="number"
                        placeholder={color.split(",")[3]}
                        className={styles.input}
                        min={0}
                        max={1}
                        step={0.01}
                        onChange={(e) => {
                          setIsCustomColor(true);
                          setColor(
                            color.split(",")[0] +
                              "," +
                              color.split(",")[1] +
                              "," +
                              color.split(",")[2] +
                              "," +
                              e.target.value
                          );
                        }}
                      />
                    </div>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className={styles.drawingBoardSizeButton}
                style={{
                  fontSize: "1.4rem",
                  width: "40px",
                  height: "40px",
                  transition: "all 0.1s;",
                }}
              >
                ?
              </Button>
            </SheetTrigger>
            <SheetContent className={styles.sidebar}>
              <SheetHeader>
                <SheetTitle className={styles.textColorHeader}>
                  Settings
                </SheetTitle>
                <SheetDescription className={styles.textColorContent} asChild>
                  <div className={styles.matrixSizeSettingWrapper}>
                    <div className={styles.title}>Choose dimensions</div>
                    <div className={styles.content}>
                      <Input
                        type="number"
                        placeholder="X"
                        className={styles.input}
                        min={1}
                        max={20}
                        onChange={(e) => changeXDimension(e)}
                        value={boardDimensions.x}
                      />
                      <Input
                        type="number"
                        placeholder="Y"
                        className={styles.input}
                        min={1}
                        max={20}
                        onChange={(e) => changeYDimension(e)}
                        value={boardDimensions.y}
                      />
                    </div>
                  </div>
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <div className={styles.boards} style={{ height: "65%" }}>
        <DrawingBoard
          boardDimensions={boardDimensions}
          drawColor={color}
          board={board}
          setBoard={setBoard}
          title="Matrix"
          randomFill={true}
          searchButton={false}
          setAlert={setAlertText}
          isSearching={isSearching}
          searchHandler={startSearch}
          resetHandler={resetHandler}
        />
        <DrawingBoard
          boardDimensions={boardDimensions}
          drawColor={color}
          board={patternBoard}
          setBoard={setPatternBoard}
          title="Pattern"
          randomFill={false}
          searchButton={true}
          setAlert={setAlertText}
          isSearching={isSearching}
          searchHandler={startSearch}
          resetHandler={resetHandler}
        />
      </div>
      <div style={{ height: "15%", position: "relative" }}>
        <AnimatePresence mode="wait">
          {alertText && (
            <motion.div
              key="popUp"
              style={{
                position: "absolute",
                width: "100%",
                padding: "0px 0px 0px 0px",
              }}
              variants={alertVariants.current}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ delay: 0, ease: "easeInOut" }}
              onAnimationComplete={(e) => {
                setTimeout(() => setAlertText(""), 2000);
              }}
            >
              <Alert style={{ width: "100%", textAlign: "center" }}>
                <AlertTitle>{alertText.split("|")[0]}</AlertTitle>
                <AlertDescription>{alertText.split("|")[1]}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Main;
