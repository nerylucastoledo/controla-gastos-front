"use client"

import React, { MouseEvent, useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';

import styles from "../../../styles/components/modal/invoice-modal.module.scss"

import People from './people';
import Item from './item';

import { formatToCurrencyBRL } from '@/utils';
import { Bill, BillDTOInputByDateAndCard } from '@/dto/billDTO';
import ModalEditInvoice from './modalEditInvoice';
import ModalDeleteInvoice from './modalDeleteInvoice';

type InvoiceModalProps = {
  data: BillDTOInputByDateAndCard[];
  card: string;
}

type Invoice = Bill & {
  _id: string;
}

type ModalActionType = {
  show: boolean;
  type: "edit" | "delete" | null;
  item: Invoice | null;
}

export default function InvoiceModal({ data, card }: InvoiceModalProps) {
  const router = useRouter();

  const [nameActive, setNameActive] = useState<string | null>(data[0]?.name);
  const [modalAction, setModalAction] = useState<ModalActionType>({ show: false, type: null, item: null });

  const handleCloseModalAction = useCallback(() => {
    setModalAction({ show: false, type: null, item: null });
  }, []);

  const handleCloseModal = useCallback((event: MouseEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;

    router.back();
  }, [router]);

  useEffect(() => {
    if (data.length === 0) {
      router.back();
      return;
    }

    const nameExists = data.some(item => item.name === nameActive);
    
    if (!nameExists) {
      setNameActive(data[0].name);
    }
  }, [data, nameActive, router]);

  const names = data.map(item => item.name);
  const cardName = card.replaceAll("%20", " ");
  const filteredData = data.filter(item => item.name === nameActive);

  return (
    <div className={`modal ${styles.invoice}`} onClick={handleCloseModal}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>{cardName}</h2>
          <p>{formatToCurrencyBRL(filteredData[0]?.totalInvoice ?? 0)}</p>
        </div>

        <div className={styles.content}>
          <People 
            names={names}
            nameActive={nameActive}
            setNameActive={setNameActive}
          />

          <Item
            data={filteredData}
            setShowModalAction={setModalAction}
          />
        </div>
      </div>

      {modalAction.show && modalAction.type === "edit" && modalAction.item && (
        <ModalEditInvoice
          handleCloseModal={handleCloseModalAction}
          invoice={modalAction.item}
        />
      )}

      {modalAction.show && modalAction.type === "delete" && modalAction.item && (
        <ModalDeleteInvoice
          handleCloseModal={handleCloseModalAction}
          invoice={modalAction.item}
        />
      )}
    </div>
  )
}
