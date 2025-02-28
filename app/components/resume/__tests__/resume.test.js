import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Resume } from '../resume';
import { useUser } from '../../../context/user';

// Mock the useUser hook
jest.mock('../../../context/user', () => ({
  useUser: jest.fn(),
}));

describe('Resume Component', () => {
  const mockSalary = "R$ 1.000,00"; // Mock salary
  const mockData = [
    {
      _id: "1",
      username: "Lucas",
      date: "Dezembro2024",
      people: "Eu",
      category: "Outros",
      value: "R$ 10,00",
      item: "Test Item 1",
      card: "Test Card 1",
    },
    {
      _id: "2",
      username: "Lucas",
      date: "Dezembro2024",
      people: "Eu",
      category: "Outros",
      value: "R$ 20,00",
      item: "Test Item 2",
      card: "Test Card 2",
    },
    {
      _id: "3",
      username: "Lucas",
      date: "Dezembro2024",
      people: "Eu",
      category: "Outros",
      value: "R$ 30,00",
      item: "Test Item 3",
      card: "Test Card 3",
    },
    {
      _id: "4",
      username: "Lucas",
      date: "Dezembro2024",
      people: "Eu",
      category: "Outros",
      value: "R$ 40,00",
      item: "Test Item 4",
      card: "Test Card 4",
    },
    {
      _id: "5",
      username: "Lucas",
      date: "Dezembro2024",
      people: "Eu",
      category: "Outros",
      value: "R$ 50,00",
      item: "Test Item 5",
      card: "Test Card 5",
    },
  ];

  beforeEach(() => {
    (useUser).mockReturnValue({ salary: mockSalary });
  });

  test('renders financial summary correctly', () => {
    render(<Resume salary={mockSalary} data={mockData} />);
    
    expect(screen.getByText('resumo financeiro')).toBeInTheDocument();
    expect(screen.getByText('salário')).toBeInTheDocument();
    expect(screen.getByText(mockSalary)).toBeInTheDocument();
    expect(screen.getByText('contas')).toBeInTheDocument();
    expect(screen.getByText("R$ 150,00")).toBeInTheDocument();
    expect(screen.getByText('saldo restante')).toBeInTheDocument();
    expect(screen.getByText("R$ 850,00")).toBeInTheDocument();
  });
});