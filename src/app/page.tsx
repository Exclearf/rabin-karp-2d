"use client";

import Main from "@/components/Main";
import styles from "./page.module.scss";
import Head from "next/head";

export default function Home() {
  return (
    <div className={styles.main}>
      <Main></Main>
    </div>
  );
}
