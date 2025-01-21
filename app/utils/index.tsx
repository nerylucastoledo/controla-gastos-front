import { ENUM_CATEGORYS } from "../components/icon/icons";

export const months = [
	"Janeiro",
	"Fevereiro",
	"Marco",
	"Abril",
	"Maio",
	"Junho",
	"Julho",
	"Agosto",
	"Setembro",
	"Outubro",
	"Novembro",
	"Dezembro"
]

export const years = [
	2021,
	2022,
	2023,
	2024,
	2025,
	2026,
	2027,
	2028,
]

export const ENUM_CATEGORYS_DISPLAY = Object.fromEntries(
  Object.entries(ENUM_CATEGORYS).map(([key, value]) => [value, key])
);

export const formatCurrency = (value: string) => {
	value = value.replace(/\D/g, "");
	value = (Number(value) / 100).toFixed(2) + "";
	value = value.replace(".", ",");
	value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
	return "R$ " + value;
  }

export const parseCurrencyString = (currencyString: string) => {
	let numberString = currencyString.replace("R$", "").trim();
	numberString = numberString.replace(/\./g, "");
	numberString = numberString.replace(",", ".");

	return parseFloat(numberString);
}

export const formatToCurrencyBRL = (amount: number) => {
	// Format the number to Brazilian Real currency
	return amount.toLocaleString('pt-BR', {
		style: 'currency',
		currency: 'BRL',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	});
}

export const fetcher = (url: string) => 
	fetch(url, {
	  method: 'GET',
	  credentials: 'include',
	}).then((res) => res.json());

export const fetcherPost = async <T, R>(url: string, method: string, body?: T): Promise<R> => {
	try {
		const res = await fetch(url, {
			method,
			credentials: 'include',
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});

		if (!res.ok) {
			const errorData = await res.json();
			throw new Error(errorData.message || 'Ocorreu um erro interno! Tente novamente');
		}

		return res.json() as Promise<R>;
	} catch (err) {
		console.error(err);
		throw err;
	}
};