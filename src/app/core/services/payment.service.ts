import { Injectable } from '@angular/core';

export interface PaymentOption {
  value: string;
  label: string;
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly expenseOptions: PaymentOption[] = [
    { value: 'CARD', label: 'Credit / Debit Card' },
    { value: 'UPI', label: 'UPI / Digital Wallet' },
    { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
    { value: 'CASH', label: 'Cash' },
    { value: 'WALLET', label: 'Wallet' }
  ];

  private readonly incomeOptions: PaymentOption[] = [
    { value: 'CARD', label: 'Credit / Debit Card' },
    { value: 'UPI', label: 'UPI / Digital Wallet' },
    { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
    { value: 'CASH', label: 'Cash' },
    { value: 'WALLET', label: 'Wallet / Other' },
    { value: 'OTHER', label: 'Other' }
  ];

  getExpenseOptions(): PaymentOption[] {
    return this.expenseOptions;
  }

  getIncomeOptions(): PaymentOption[] {
    return this.incomeOptions;
  }

  getLabel(value: string): string {
    const normalized = this.normalize(value);
    const match = [...this.expenseOptions, ...this.incomeOptions].find(option => option.value === normalized);
    return match?.label || normalized;
  }

  normalize(value: string | null | undefined): string {
    const normalized = (value || '').trim().toUpperCase();

    switch (normalized) {
      case 'CREDIT_CARD':
      case 'DEBIT_CARD':
      case 'CARD':
        return 'CARD';
      case 'DIGITAL_WALLET':
      case 'UPI':
        return 'UPI';
      case 'BANK_TRANSFER':
        return 'BANK_TRANSFER';
      case 'WALLET':
        return 'WALLET';
      case 'OTHER':
        return 'OTHER';
      case 'CASH':
      default:
        return normalized || 'CASH';
    }
  }
}
