"use client"

import useSWR from "swr";
import { useEffect, useState } from "react";

import styles from "../styles/pages/home.module.scss";
import stylesConfig from "../styles/pages/config.module.scss";

import { useUser } from "../context/user";
import { fetcher, fetcherPost, formatCurrency } from "../utils";

import { ConfigList } from "../components/configList/list";
import { Input } from "../components/input/input";
import { ModalEditConfig } from "../components/modalEditConfig/modalEditConfig";
import { ModalConfigDelete } from "../components/modalDeleteConfig/modalDeleteConfig";
import { Toast } from "../components/toast/toast";

import { ICard, IPeople } from "../utils/types";
import Loading from "./loading";
import { Error } from "../components/error/Error";

interface IData {
  data: IPeople[] | ICard[]
}

export default function Config() {
  const { username, salary, setSalary } = useUser();
  const [salaryUpdate, setSalaryUpdate] = useState("R$ 0,00");
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [item, setItem] = useState<IPeople | ICard | null>(null);
  const [toastCustom, setToastCustom] = useState({ error: true, message: ""});
  const [showToast, setShowToast] = useState(false);

  const { data: peopleData, error: peopleError, mutate: mutatePeole, isLoading: loadingPeople } = useSWR<IData>(`${process.env.NEXT_PUBLIC_API_URL}/peoples/${username}`, fetcher);
  const { data: cardData, error: cardError, mutate: mutateCard, isLoading: loadingCard } = useSWR<IData>(`${process.env.NEXT_PUBLIC_API_URL}/cards/${username}`, fetcher);


  useEffect(() => {
    setSalaryUpdate(salary)
  }, [salary])

  const handleFetch = () => {
    mutatePeole();
    mutateCard()
  }

  if (loadingPeople || loadingCard) return <Loading />
  if (peopleError || cardError) return <Error mutate={handleFetch} />
  if (!peopleData || !cardData) return null;

  const openModal = (item: IPeople | ICard, method: "PUT" | "DELETE") => {
    setItem(item);

    if (method === "PUT") {
      setIsModalEdit(true);
      return;
    }
    
    setIsModalDelete(true);
  };

  const handleToast = (error: boolean, message: string) => {
    setToastCustom({ error, message })
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000);
  }

  const upateSalary = async () => {
    try {
      const response = await fetcherPost<{ salary: string }, { message: string }>(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${username}`, 
        "PUT", 
        { salary: salaryUpdate }
      );
      handleToast(true, response.message)
      localStorage.setItem("salary", salaryUpdate)
      setSalary(salaryUpdate)
    } catch (err) {
      handleToast(false, (err as Error).message);
    }
  }

  return (
    <>
      {showToast && (
        <Toast success={toastCustom.error} message={toastCustom.message} />
      )}
      <section className={`container ${styles.container_home} ${stylesConfig.config}`}>
        <div className={`${stylesConfig.content}`}>
          <h2 className="title">Atualize os dados</h2>
          <p className="subtitle">Aqui você mantém total controle das pessoas, cartões e dos eu salário</p>

          <div className={`${stylesConfig.content__container}`}>
            <div className={`${stylesConfig.item}`}>
              <h3>salário</h3>

              <div className={`${stylesConfig.item__salary}`}>
                <Input
                  data-testid="value"
                  label="Valor (R$)"
                  name="value"
                  onChange={({ currentTarget }) => setSalaryUpdate(formatCurrency(currentTarget.value))}
                  required
                  type="text" 
                  value={salaryUpdate}
                />
                <button className="button button__primary" onClick={() => upateSalary()} data-testid="update-salary">
                  Salvar
                </button>
              </div>
            </div>

            <div className={`${stylesConfig.item}`}>
              <h3>pessoas</h3>
              {!peopleData.data.length ? (
                <p className="empty">nenhuma pessoa cadastrada</p>
              ) : (
                <ConfigList data={peopleData.data} openModal={openModal} />
              )}
            </div>

            <div className={`${stylesConfig.item}`}>
              <h3>cartões</h3>
              {!cardData.data.length ? (
                <p className="empty">nenhum cartão cadastrado</p>
              ) : (
                <ConfigList data={cardData.data} openModal={openModal} />
              )}
            </div>
          </div>
        </div>
      </section>

      {isModalEdit && <ModalEditConfig item={item} mutate={handleFetch} onCustomDismiss={() => setIsModalEdit(false)} />}
      {isModalDelete && <ModalConfigDelete item={item} mutate={handleFetch} onCustomDismiss={() => setIsModalDelete(false)} />}
    </>
  );
}
