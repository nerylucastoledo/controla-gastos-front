"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import Image from 'next/image'
import Link from "next/link";

import styles from "../styles/pages/login.module.scss"

import { Input } from "../components/input/input";
import { Toast } from "../components/toast/toast";

import { useUser } from "../context/user";

import { fetcherPost } from "../utils";
import wallet from "../images/wallet.png";
import walletRetina from "../images/wallet-retina.png";

interface IResponse {
  message: string,
  salary: string,
  username: string,
}

interface IData {
  email: string;
  password: string;
}

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastCustom, setToastCustom] = useState({ error: true, message: ""});
  const { setUsername, setSalary }  = useUser()
  const common = { alt: 'Imagem de uma carteira', width: 216, height: 288 };
  
  const handleToast = (error: boolean, message: string) => {
    setToastCustom({ error, message })
    setShowToast(true)
  }

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const body = { email, password }
      const response = await fetcherPost<IData, IResponse>(
        "http://localhost:4000/api/login",
        "POST", 
        body
      );

      const { username, salary, message }: IResponse = response;

      if (!response.username || !response.salary) {
        throw new Error(message);
      }

      localStorage.setItem("username", username)
      localStorage.setItem("salary", salary)
      setUsername(username);
      setSalary( salary)
      handleToast(true, message)
      router.replace("/");
      
    } catch (err) {
      handleToast(false, (err as Error).message)
    }
  }

  return (
    <div className={styles.background}>
      {showToast && (
        <Toast success={toastCustom.error} message={toastCustom.message} />
      )}
      
      <div className={styles.container_user}>
        <div className={styles.container_user__info}>
          <picture>
            <source media="(prefers-color-scheme: dark)" srcSet={walletRetina.src} />
            <Image {...common} src={wallet.src} alt="Imagem de uma carteira" />
          </picture>
          <p>Entre e visualize como foi seus gastos nos meses anteriores, como está no mês atual e como ficará nos próximos meses.</p>
        </div>
        
        <div className={styles.container_user__form}>
          <h1 className={styles.container_user__form_title}>Acessar sua conta</h1>
          <p className={styles.container_user__form_subtitle}>Insira sua conta</p>

          <form onSubmit={submit}>
            <Input
              data-testid="email"
              label="Email"
              type="email" 
              name="email"
              onChange={({ target }) => setEmail(target.value)}
              placeholder=""
              required
              value={email}
            />

            <Input
              data-testid="password"
              label="Senha"
              name="password"
              onChange={({ target }) => setPassword(target.value)}
              placeholder=""
              required
              role="password"
              type="password" 
              value={password}
            />

            <input type="submit" value="Acessar" className="button button__primary"/>
          </form>

          <p className={styles.container_user__form_new}>Não possui conta? <Link href="/register">Crie uma</Link></p>
        </div>
      </div>
    </div>
  );
}
