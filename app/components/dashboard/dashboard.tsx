"use client"

import React from 'react';
import useSWR from 'swr';

import styles from "../../styles/components/dashboard.module.scss"

import Loading from '../loading/loading-icon';
import ChartExpensesMonthly from '../chart/ChartExpensesMonthly';
import ChartExpensesCategorys from '../chart/ChartExpensesCategorys';
import { Data } from '@/app/utils/types';

interface DataByYear {
  month: string;
  value: string;
}

interface Params {
  username: string;
  year: string
  dataByMonth: Data[]
}

const fetcher = (url: string) => 
  fetch(url, {
    method: 'GET',
    credentials: 'include',
  }).then((res) => res.json());

export default function Dashboard({ dataByMonth, username, year }: Params) {
  const { data, isLoading } = useSWR<DataByYear[]>(`http://localhost:4000/api/expenses/year/${username}/${year}`, fetcher)

  const existingData = data?.length && dataByMonth?.length

  return (
    <div className={`content_card ${styles.dashboard}`}>
      <h1 className='content_card__title'>gráficos</h1>

      <div className={`${styles.container}`}>
        {isLoading ? (
          <Loading />
        ) : (
          <>
            {!existingData ? (
              <div className='empty'>
                <p>você não cadastrou nenhum gasto até o momento</p>
              </div>
            ) : (
              <>
                <div className={`${styles.chart}`}>
                  <div className="wrapper-chart">
                    <ChartExpensesMonthly data={data} />
                  </div>
                  <div className="wrapper-chart">
                    <ChartExpensesCategorys data={dataByMonth} />
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}