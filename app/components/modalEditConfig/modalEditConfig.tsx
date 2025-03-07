"use client"

import React, { SetStateAction, useCallback, useState } from 'react'

import { Input } from '@/app/components/input/input'
import { Modal } from '@/app/components/modal/modal'

import { fetcherPost } from '@/app/utils';
import { ICard, IPeople } from '@/app/utils/types';
import { Toast } from '../toast/toast';

interface IUpdate {
  _id: string;
  color?: string;
  name: string;
}

interface IProps {
  item: IPeople | ICard | null;
  mutate: () => void;
  onCustomDismiss: (value: SetStateAction<boolean>) => void;
}

export const ModalEditConfig = ({ item, mutate, onCustomDismiss }: IProps) => {
  const [itemUpdated, setItemUpdated] = useState(item);
  const [toastCustom, setToastCustom] = useState({ error: true, message: ""});

  const handleToast = useCallback(async (error: boolean, message: string) => {
      setToastCustom({ error, message })
      onCustomDismiss(false)
      setTimeout(() => setToastCustom({ error, message: "" }), 2000);
    }, [onCustomDismiss])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!itemUpdated) return;

    try {
      let url = "peoples";
      let body: IUpdate = {
        _id: itemUpdated._id,
        name: itemUpdated.name,
      };

      if ("color" in itemUpdated) {
        url = "cards";
        body = {
          ...body,
          color: itemUpdated.color,
        };
      }

      const response = await fetcherPost<IUpdate, { message: string }>(`${process.env.NEXT_PUBLIC_API_URL}/${url}`, 
        "PUT", 
        body
      );
      mutate()
      handleToast(true, response.message)
    } catch (err) {
      handleToast(false, (err as Error).message);
    }
  }

  return (
    <>
      <Toast message={toastCustom.message} success={toastCustom.error} />
      
      <Modal
        background='#1E1E1E'
        customClass={`modal-form-active modal-form`}
        onCustomDismiss={() => onCustomDismiss(false)}
      >
        <h2 className='title' data-testid="title-edit">Atualizar</h2>

        <p className='subtitle' data-testid="subtitle-edit">Atualize a informação</p>

        <form onSubmit={handleSubmit}>
          <Input
            data-testid="item"
            label="Item"
            name="item"
            onChange={({ target }) => setItemUpdated(prev => prev ? { ...prev, name: target.value } : null)}
            required
            type="text" 
            value={itemUpdated?.name}
          />

          {itemUpdated && "color" in itemUpdated && (
            <Input
              data-testid="cor"
              label="Cor"
              name="item"
              onChange={({ target }) => setItemUpdated(prev => prev ? { ...prev, color: target.value } : null)}
              required
              type="color" 
              value={itemUpdated?.color}
            />
          )}

          <input type="submit" value="Atualizar" className="button button__primary" data-testid="submit-edit" />
        </form>
      </Modal>
    </>
  )
}
