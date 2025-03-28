import React from 'react';
import useSWR from 'swr';

import styles from "../../styles/components/dashboard.module.scss"

import { ChartExpensesMonthly } from '../chart/ChartExpensesMonthly';
import { ChartExpensesCategorys } from '../chart/ChartExpensesCategorys';
import { LoadingIcon } from '../loading/loadingIcon';

import { fetcher } from '@/app/utils';
import { Expense, ExpenseOutputByUsernameAndYear } from '@/app/dto/expenseDTO';

interface IData {
  data: ExpenseOutputByUsernameAndYear[]
}

interface IProps {
  dataByMonth: Expense[]
  username: string;
  year: string
}

export const Dashboard = ({ dataByMonth, username, year }: IProps) => {
  const { data, isLoading } = useSWR<IData>(
    username && year ? `${process.env.NEXT_PUBLIC_API_URL}/expenses/year/${username}/${year}` : null, 
    fetcher
  )

  const existingData = data?.data && dataByMonth && data.data.length && dataByMonth.length

  return (
    <div className={`content_card ${styles.dashboard}`}>
      <h1 className='content_card__title'>gráficos</h1>

      <div className={`${styles.container}`}>
        {isLoading ? (
          <LoadingIcon />
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
                    <ChartExpensesMonthly data={data.data} />
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