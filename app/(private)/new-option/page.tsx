"use client"

import { useUser } from "../../context/user";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import styles from "../../styles/pages/home.module.scss";
import stylesNewExpense from "../../styles/pages/new-expense.module.scss";

import { Input } from "../../components/input/input";
import { Select } from "../../components/select/select";
import { Toast } from "../../components/toast/toast";

import { fetcherPost } from "../../utils";

interface IData {
  _id?: string;
  color?: string;
  name: string;
  username: string;
}

export default function NewOption() {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#000000");
  const [type, setType] = useState("");
  const [toastCustom, setToastCustom] = useState({ error: true, message: ""});

  const router = useRouter()
  const { username } = useUser();
  
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [username, router]);

  const handleToast = useCallback(async (error: boolean, message: string) => {
    setToastCustom({ error, message })
    setTimeout(() => setToastCustom({ error, message: "" }), 2000);
  }, [])

  const resetOptions = useCallback(() => {
    setName("")
    setColor("")
    setType("")
  }, []) 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const body: IData = {
        username,
        name,
        ...(type === "cards" ? { color } : {})
      };

      const response = await fetcherPost<IData, { message: string }>(`${process.env.NEXT_PUBLIC_API_URL}/${type}`, 
        "POST", 
        body
      );

      handleToast(true, response.message)
      resetOptions()
    } catch (err) {
      const message = (err as Error).message
      handleToast(false, message)
    }
  }

  return (
    <section className={`container ${stylesNewExpense.new_expense}`}>
      <Toast message={toastCustom.message} success={toastCustom.error} />
      
      <div className={styles.container_home}>
        <form onSubmit={handleSubmit}>
          <h1 className="title">Cadastre a opção</h1>

          <Select 
            data-testid="name-select" 
            id='type' 
            label='O que?' 
            onChange={({ target }) => setType(target.value)}
            required
            value={type}
          >
            <option value={""} disabled>Selecione</option>
            <option value={"peoples"}>Pessoa</option>
            <option value={"cards"}>Cartão</option>
          </Select>

          <Input
            data-testid="name"
            label="Nome"
            name="name"
            onChange={({ target }) => setName(target.value)}
            type="text" 
            required
            value={name}
          />

          {type === "cards" && (
            <Input
              data-testid="cor"
              label="Cor"
              name="color"
              onChange={({ target }) => setColor(target.value)}
              required
              type="color" 
              value={color}
            />
          )}
          
          <input type="submit" value="Cadastrar" className="button button__primary" />
        </form>
      </div>
    </section>
  );
}
