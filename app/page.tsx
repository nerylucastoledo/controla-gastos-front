"use client"

import { useState } from "react";
import useSWR from "swr";

import styles from "./styles/pages/home.module.scss";

import Filter from "./components/filter/filter";
import Resume from "./components/resume/resume";
import LatestExpenses from "./components/latest-expenses/latest-expenses";
import Card from "./components/card/card";
import Dashboard from "./components/dashboard/dashboard";

import { fetcher, months } from "./utils/index";
import { IExpensesByUsernameAndDate } from "./utils/types";
import { useUser } from "./context/user";

export interface IData {
  data: IExpensesByUsernameAndDate
}

export default function Home() {
  const [month, setMonth] = useState(months[new Date().getMonth()]);
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const { username, salary } = useUser();

  const currentDate = `${month}${year}`
  const { data, error, isLoading, mutate } = useSWR<IData>(`http://localhost:4000/api/expenses/${username}/${currentDate}`, fetcher, { refreshInterval: 1000 })

  if (isLoading) {
    return;
  }

  if (error || !data) {
    return (
      <div className={styles.container_home}>
        <div className={styles.container_home_error}>
          <h1>Tivemos um problema para carregar seus dados! Você pode clicar no botão abaixa e tentar novamente :)</h1>
          <button className="button" onClick={() => mutate()}>Recarregar</button>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className={styles.container_home}>
        <section>
          <Filter
            setMonth={setMonth}
            setYear={setYear}
            currentMonth={month}
            currentYear={year}
          />
          <Resume
            salary={salary}
            data={data.data.expenses}
          />
          <LatestExpenses
            data={data.data.expenses}
          />
        </section>
        <section>
          <Card
            username={username}
            date={currentDate}
            data={data.data.expenses}
            cards={data.data.cards}
          />
          <Dashboard
            dataByMonth={data.data.expenses}
            username={username}
            year={year}
          />
        </section>
      </div>
    </div>
  );
}